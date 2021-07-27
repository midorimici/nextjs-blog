---
title: 'create-react-app で自動生成される CSS や JS へのパスを変更する方法'
date: 2020-08-05T12:00:00+09:00
lastmod: 2020-08-05T12:00:00+09:00
categories: [プログラミング, Web アプリ]
tags: [React, JavaScript/TypeScript]
draft: false
---

`create-react-app`で作成したアプリでは、デフォルトでは CSS や画像や JS へのパスが

`/static/css/main.xxxxxxxx.chunk.css`、

`/static/media/...`、

`/static/js/...chunk.js`

のようになっています。

<!--more-->

何らかの事情でこれを変えたいときがあります。

今回はこれらのパスを変更する方法をご紹介します。

<br>

## 設定ファイルを表示させる

まずはプロジェクトのルートディレクトリで`npm run eject`のコマンドを入力して、

設定ファイルを出現させます。

実は`create-react-app`をしただけでは、細かい設定をするためのファイル群は隠れたままなのです。

eject によって {{% tltp webpack %}}複数のファイルをひとつにまとめるバンドラ{{% /tltp %}} などの設定ができるようになります。

実行後はルートディレクトリに`config`ディレクトリが生成されます。

<br>

## パスを書き換える

webpack の設定ファイル`config/webpack.config.js`を編集します。

長大なファイルなので、ファイル内検索で`static`を検索します。

```js {name="webpack.config.js", hl_lines=[3, 9, 14, 18, 24, 25]}
...
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'         // ← ここを変える
        : isEnvDevelopment && 'static/js/bundle.js',
      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'   // ← ここを変える
        : isEnvDevelopment && 'static/js/[name].chunk.js',
...
              options: {
                limit: imageInlineSizeLimit,
                name: 'static/media/[name].[hash:8].[ext]',   // ← ここを変える
              },
...
              options: {
                name: 'static/media/[name].[hash:8].[ext]',   // ← ここを変える
              },
...
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].[contenthash:8].css',              // ← ここを変える
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',   // ← ここを変える
        }),
...
```

JavaScript のパスは前の２つ、

画像ファイルなどのパスは中の２つ、

CSS のパスは後の２つを変更すれば十分です。

ファイルを読み込んでおらず構造もつかめていないので、両方必要かはわかりません。

---

お役に立てれば幸いです。

では:wave: