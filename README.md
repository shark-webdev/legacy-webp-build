# legacy-webp-build

Gulp と sharp で画像を圧縮し、レガシー形式の WebP ファイル名も生成するビルド環境です。  
`src` ディレクトリの画像は残したまま、処理後の画像を `dest` ディレクトリへ出力します。

## 特徴

- jpg / png を圧縮
- `.jpg.webp` 形式で WebP を生成
- `.htaccess` による自動切り替えに対応
- Apache 環境向け
- レガシー WordPress 案件向け

## 出力内容

`pnpm build` または `legacy-webp-build.bat` を実行すると、次の順番で処理します。

1. `dest` ディレクトリの中身を削除
2. `src` 内の jpg / jpeg / png を sharp で圧縮して `dest` へ出力
3. `src` 内の jpg / jpeg / png から WebP を生成して `dest` へ出力

WebP のファイル名は、元画像の拡張子を残した形式になります。

```text
src/photo.jpg
dest/photo.jpg
dest/photo.jpg.webp
```

`.jpeg` の圧縮画像は `.jpg` に統一されます。WebP は元拡張子をファイル名に残します。

```text
src/photo.jpeg
dest/photo.jpg
dest/photo.jpeg.webp
```

## 使用環境

- Node.js 20以上
- pnpm 11
- Gulp 5

## セットアップ

初回のみ依存パッケージをインストールします。

```powershell
pnpm install
```

## 使い方

### WindowsでBATファイルを使う場合

1. `src` ディレクトリに圧縮したい画像を入れます。
2. `legacy-webp-build.bat` をダブルクリックします。
3. `dest` ディレクトリに圧縮画像と WebP が出力されます。

### コマンドで実行する場合

```powershell
pnpm build
```

圧縮のみ実行する場合は、次のコマンドを使います。  
この場合、`dest` の削除と WebP 生成は行いません。

```powershell
pnpm compress
```

WebP 生成のみ実行する場合は、次のコマンドを使います。

```powershell
pnpm webp
```

`dest` ディレクトリの削除のみ実行する場合は、次のコマンドを使います。

```powershell
pnpm clean
```

## 対応画像形式

| 形式 | 処理内容 |
| --- | --- |
| jpg / jpeg | quality 90、progressive JPEG、mozjpeg 有効、圧縮後の拡張子は `.jpg` に統一 |
| png | compressionLevel 9、effort 10 |
| WebP | jpg / jpeg / png から quality 85 で生成 |

## 使用パッケージ

- gulp
- gulp-cli
- del
- sharp

---

設計意図や制作メモはこちらです。  
[Notion Portfolio](https://gelatinous-alligator-d9a.notion.site/Portfolio-2fe45c4eb2d980aca9e3e247af534dd9)
