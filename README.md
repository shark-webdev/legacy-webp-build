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

## おまけ：`.htaccess` で WebP を自動配信する

リポジトリに同梱している `.htaccess` は、画像の URL を変更せず、WebP 対応ブラウザにだけ同名の WebP を配信する Apache 用の設定例です。

たとえば、HTML から `images/photo.jpg` を参照した場合、同じ場所に `images/photo.jpg.webp` があれば、その WebP を内部的に配信します。WebP に対応していないブラウザには `images/photo.jpg` をそのまま配信します。

### 導入手順

1. `pnpm build` を実行し、`dest` に圧縮画像と WebP を生成します。
2. `dest` の中身を、Web サイト上の元画像と同じディレクトリ構成でアップロードします。
3. 同梱の `.htaccess` を、画像ディレクトリまたは Web サイトの公開ルートに配置します。

公開先に既存の `.htaccess` がある場合は上書きせず、バックアップを取ったうえで同梱ファイルの設定を既存ファイルへ追記してください。

この設定には Apache 2.4 と、`mod_rewrite`、`mod_headers`、`mod_mime` が必要です。また、対象ディレクトリで `.htaccess` の `FileInfo` 設定が許可されている必要があります。Nginx、IIS、静的ホスティングでは使用できません。サーバー側の設定を変更できない場合は、管理者またはホスティング事業者に確認してください。

### 動作確認

デプロイ後、PowerShell から次のように確認できます。URL は実際の画像 URL に置き換えてください。

```powershell
curl.exe -I -H "Accept: image/webp" "https://example.com/images/photo.jpg"
```

レスポンスに `Content-Type: image/webp` と `Vary: Accept` が含まれていれば、WebP が配信されています。続いて、WebP を指定しない場合も元画像が返ることを確認します。

```powershell
curl.exe -I -H "Accept: image/jpeg" "https://example.com/images/photo.jpg"
```

`.jpeg` は圧縮時に `.jpg` へ変換されます。`photo.jpeg.webp` と対になる元画像は `photo.jpeg` なので、公開先で `.jpg` の URL を使う場合は `photo.jpg.webp` が生成されるよう、入力画像の拡張子も `.jpg` に揃えてください。

この設定は、要求された画像と同じ場所に WebP ファイルが実在する場合だけ内部書き換えを行います。任意のパスや存在しないファイルへの書き換えは行いません。また、キャッシュによる形式の取り違えを防ぐため、`Vary: Accept` を付与します。

## 対応画像形式

| 形式       | 処理内容                                                                   |
| ---------- | -------------------------------------------------------------------------- |
| jpg / jpeg | quality 92、progressive JPEG、mozjpeg 有効、圧縮後の拡張子は `.jpg` に統一 |
| png        | compressionLevel 9、effort 10                                              |
| WebP       | jpg / jpeg / png から quality 92 で生成                                    |

## 使用パッケージ

- gulp
- gulp-cli
- del
- sharp

---

設計意図や制作メモはこちらです。  
[Notion Portfolio](https://gelatinous-alligator-d9a.notion.site/Portfolio-2fe45c4eb2d980aca9e3e247af534dd9)
