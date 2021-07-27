---
title: "【Netlify + Heroku】Socket.IO アプリのデプロイ"
date: 2021-01-15T12:00:00+09:00
lastmod: 2021-01-15T12:00:00+09:00
categories: [プログラミング, Web アプリ]
tags: [Netlify, JavaScript/TypeScript]
draft: false
---

<p>{{% tltp Socket.IO %}}クライアント-サーバ間の双方向通信ができる JS ライブラリ<br>[公式サイト](https://socket.io/){{% /tltp %}}
 で作成した通信対戦アプリをデプロイするときに結構苦労したので、その記録を書いておきます。</p>

<!--more-->

当該のアプリはこちらです。

→ [Geister Online](https://geister-online.netlify.app)

<br>

## アプリの構造

Socket.IO を使用して、クライアント-サーバ間で通信をするアプリです。

コードは TypeScript で書き、Webpack を使って、

クライアントのコードは`public/bundle.js`として、サーバのコードは`dist/main.js`としてコンパイルしています。

`public`配下の HTML の`script`タグから`bundle.js`を読み込み、

ローカルでは`node dist/main.js`をターミナルから入力することでサーバのコードを動かしていました。

ディレクトリ構成は、このようになっていました。

```yml {linenos=false}
# 静的ファイル
public/
    # css、画像、音声など
    - static/
    - bundle.js
    - index.html
# サーバのコードがコンパイルされたやつ
dist/
    - main.js
# クライアントのコード
src/
# サーバのコード
server.ts
package.json
tsconfig.json
webpack.config.js
...
```

<br>

## デプロイ方法

`public`配下の静的ファイルは [Netlify](https://www.netlify.com/)、`dist`配下のサーバのファイルは [Heroku](https://jp.heroku.com/) で動かしています。

以下の図のように、クライアントサイドは Netlify、サーバサイドは Heroku っていう感じです。

{{< img src=relation ext=svg alt=デプロイの構造 >}}

おそらく Netlify は静的専用なので、動的なことはできないんだと思います。

この動画を参考にしながらデプロイを進めていきました。

{{< yout M9RDYkFs-EQ >}}

<br>

しかし、ここでいくつか問題が発生してしまいました。

<br>

## 問題点

### Heroku でビルドできない

Heroku でビルドできなかったので、デプロイログを見ると、`package.json`がないとのこと。

Heroku のプロジェクトパスには`dist`を指定しているのですが、その中には`main.js`しかないからです。

仕方ないのでルートにあった`package.json`を`dist`に移動すると、ビルドできるようになりました。

{{% fukidashi ase %}}

こんなところにあっていいんだろうか…

{{% /fukidashi %}}

### Heroku で Application error

`heroku logs --tail`すると、`code=H10 desc=App crashed status=503`なエラー。

ログを遡ると、`npm start`でこけてるっぽい。

実は`package.json`の中身はこうなっていました。

```json:package.json
{
    ...
    "scripts": {
        "start": "npx webpack && node dist/main.js"
    },
    ...
}
```

このファイルのパスをさきほど変えたので、この部分のパスも変えなくてはなりません。

`webpack.config.js`をこの`dist`ディレクトリに入れてもいいかもしれないですが、

このファイルはクライアントのコードもコンパイルしているし、いろいろ面倒そうなので、

ローカルで`npx webpack`して、`npm start`には`node main.js`だけ載せることにしました。

```json:package.json
{
    ...
    "scripts": {
        "start": "node main.js"
    },
    ...
}
```

これで Heroku 側の 503 エラーはなくなりました。

いまだに Heroku の URL には Not Found と表示されますが、本体は Netlify 側の URL なので問題ないと思います。

{{% fukidashi neut %}}

コードの変更があるとデプロイのたびにローカルでいちいちコンパイルしないといけないのがつらいけど、仕方ないか

{{% /fukidashi %}}

### ブラウザで CORS エラー

これが一番煩わしかったです。

ブラウザで Netlify の URL にアクセスして、デベロッパーツールのコンソールを開くと、

[このエラー](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin)が表示されました。

セキュリティ的な意味で、**ドメインが違うサイト間で通信するには明示が必要**だということです。

さて、困ったのはどこにそれを書けばいいのかわからないということでした。

クライアント側か？サーバ側か？

<br>

クライアント側だとすれば、Netlify の`netlify.toml`や`_headers`ファイルで HTTP ヘッダを指定することができます。

ところがこれを追加してもうまくいかず…

ということはサーバ側かと思って、Express.js の CORS について調べていろいろ書いてみるも、うまくいかず…

先の動画でもそのコードでも何か特別なことをしているようには見えなかったし、八方塞がりでありました。

<br>

ところが、ふと「Socket.IO CORS」で調べると、

なんと**バージョンが変わってからは明示的な CORS 設定が必要**とか言うじゃないですか。

→ [Handling CORS | Socket.IO](https://socket.io/docs/v3/handling-cors/)

{{% fukidashi ase %}}

そんなところに原因があるとは思わなかったよ…

{{% /fukidashi %}}

Netlify の設定ファイルも Express の CORS のコードも必要なく、これだけでヘッダを認識するようになりました。

<br>

それで、origin として設定する URL は Netlify の URL にすべきだったのですが、

Heroku の URL にするものだと勘違いしていたため、またも[エラー](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS/Errors/CORSAllowOriginNotMatchingOrigin)。

よく考えれば Socket.IO の CORS 設定のコード（サーバのコード）は Heroku 側だし、

Heroku 側が Netlify 側をブロックしてるんだから、Netlify の URL を書くべきだったんですね。

<br>

これでエラーもきれいになくなり、期待通りに動くようになりました。

---

お役に立てれば幸いです。

では:wave: