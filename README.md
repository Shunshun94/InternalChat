# InternalChat

議事録をとったり、模擬戦をやったりするのに使う一人チャットツール。
使っているライブラリとかは [libs.md](./libs.md) を見てね

## 使い方

[http://hiyo-hitsu.sakura.ne.jp/InternalChat/](http://hiyo-hitsu.sakura.ne.jp/InternalChat/) にアクセスすればすぐ使える。

## いじる

### ローカルでサーバを起動

`$ npm start` でサーバを起動し、 [http://localhost:3000](http://localhost:3000) にアクセスするとローカルで操作できる。
そのままソースコードをいじればそれなりに即時反映される。

### ビルド

`$ npm run build` すれば `build` ディレクトリ以下に生成される。

### ライブラリ一覧を出す

[license-checker](https://github.com/davglass/license-checker) を入れていることが前提。

```bash
$ license-checker --production --json > ./licnese.json
$ node libFormat.js > libs.md
```
