import gulp from 'gulp';
const { series, src, dest } = gulp;
import { existsSync } from 'node:fs';
import { Transform } from 'node:stream';
import { deleteAsync } from 'del';
import sharp from 'sharp';

// パス設定 ====================================
const srcPath = {
  images: './src/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}',
  webpImages: './src/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}',
};

const destPath = {
  images: './dest/',
};

const hasSrcDirectory = () => existsSync('./src');

// sharp設定 ====================================
const sharpOptions = {
  failOn: 'warning',
  limitInputPixels: 12000 * 12000,
};

const imageOptions = {
  jpg: {
    quality: 92,
    progressive: true,
    mozjpeg: true,
    chromaSubsampling: '4:4:4',
  },
  png: {
    compressionLevel: 9,
    effort: 10,
  },
};

const webpOptions = {
  quality: 92,
  alphaQuality: 100,
  effort: 6,
  smartSubsample: true,
};

const normalizeImageExt = (extname) => {
  const normalizedExtname = extname.toLowerCase();
  return normalizedExtname === '.jpeg' ? '.jpg' : normalizedExtname;
};

const compressWithSharp = () => new Transform({
  objectMode: true,
  async transform(file, _encoding, callback) {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (!file.isBuffer()) {
      callback(new Error(`${file.relative} is not a buffer.`));
      return;
    }

    const outputExtname = normalizeImageExt(file.extname);
    const format = outputExtname.slice(1);

    try {
      file.contents = await sharp(file.contents, sharpOptions)
        .rotate()
        .toFormat(format === 'jpg' ? 'jpeg' : format, imageOptions[format])
        .toBuffer();

      file.extname = outputExtname;
      callback(null, file);
    } catch (error) {
      callback(error);
    }
  },
});

const convertToLegacyWebp = () => new Transform({
  objectMode: true,
  async transform(file, _encoding, callback) {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (!file.isBuffer()) {
      callback(new Error(`${file.relative} is not a buffer.`));
      return;
    }

    const originalExtname = file.extname.toLowerCase();

    try {
      file.contents = await sharp(file.contents, sharpOptions)
        .rotate()
        .webp(webpOptions)
        .toBuffer();

      file.basename = `${file.basename}${originalExtname}`;
      file.extname = '.webp';
      callback(null, file);
    } catch (error) {
      callback(error);
    }
  },
});

// destディレクトリ内のファイルを削除 ============
const clean = async () => {
  await deleteAsync([`${destPath.images}/**`, `!${destPath.images}`]);
};

// 画像圧縮 ====================================
const compressImages = () => {
  if (!hasSrcDirectory()) {
    return Promise.resolve();
  }

  return src(srcPath.images, { encoding: false, allowEmpty: true })
    .pipe(compressWithSharp())
    .pipe(dest(destPath.images));
};

// WebP変換 ====================================
const createWebpImages = () => {
  if (!hasSrcDirectory()) {
    return Promise.resolve();
  }

  return src(srcPath.webpImages, { encoding: false, allowEmpty: true })
    .pipe(convertToLegacyWebp())
    .pipe(dest(destPath.images));
};

const build = series(clean, compressImages, createWebpImages);

export { clean, compressImages, createWebpImages, build };
export default build;
