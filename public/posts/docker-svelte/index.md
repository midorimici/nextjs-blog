---
title: "Docker 上で Svelte 開発環境を構築する"
date: 2020-08-28T12:00:00+09:00
lastmod: 2020-08-28T12:00:00+09:00
categories: [プログラミング, Web アプリ]
tags: [アプリ開発]
draft: false
---

Docker を使って建てた仮想コンテナ内で Svelte の開発環境を構築する方法をご紹介します。

Docker の導入は済んでいるものとします。

<!--more-->

<br>

## Docker とは

「コンテナ」と呼ばれる**仮想環境を作成したり編集したりすることができる**ものです。

仮想環境を作ることで、物理的な制約とは無関係な仮想的な環境で作業をすることができます。

<br>

「イメージ」と呼ばれるものを元にしてコンテナを作成します。

{{< relpos windows10home-docker >}}

<br>

## Svelte とは

JavaScript のフレームワークです。

初版が 2016 年と、React や Vue と比べても比較的新しいものです。

<br>

HTML、JavaScript とほぼ同じコード形態で書けるために**学習コストが少なく、**

**シンプルに書ける**ことが特徴です。

その名前の表す通り、ミニマムな印象です。

<br>

関係ないですが、読み方は英語読みだと「スヴェルト」。

私はラテン語風に「スウェルテ」と読むのが好きです。

{{< relpos library-framework-chigai >}}

<br>

## 戦略

目的は「Docker コンテナ内で Svelte 関連ファイルを編集して、コンテナ内で立ち上げた localhost に接続したら変更が反映されている」ことです。

つまり、コンテナ内で vi エディタなどを使ってファイルを編集し、

`npm run dev`コマンドで localhost 立ち上げをし、ブラウザでそこに接続します。

そうすることでホストOS内のファイルを編集することなく、Svelte をいじれます。

<br>

## 手順

### コンテナ外部の操作

まずは Svelte を導入します。

プロジェクトのディレクトリ名（最後の引数）は任意です。

```bash
$ npx degit sveltejs/template svelte-docker-test

$ cd svelte-docker-test
```

コンテナ内で`npx degit`しようとすると`degit`がエラーになってしまったので、

いったんローカルに初期ファイルを置いて、それを Docker コンテナ内に移すことにしています。

<br>

次にプロジェクトのディレクトリ以下で、イメージ作成のための Dockerfile を作成します。

```docker {name="Dockerfile"}
# Node.js のイメージを元にする
FROM node:14-alpine

# コンテナ内の作業ディレクトリ
WORKDIR /usr/src/app

# ローカルのファイルをコンテナ内にコピー
COPY rollup.config.js ./
COPY package*.json ./

# 必要なパッケージをインストール
RUN npm install

# ローカルのファイルをコンテナ内にコピー
COPY ./src ./src
COPY ./public ./public

# コンテナ内でポートを公開
EXPOSE 5000

# 環境変数でホストアドレスを指定
ENV HOST=0.0.0.0
```

参考：[How to put a Svelte app in a docker container?](https://stackoverflow.com/questions/61106423/how-to-put-a-svelte-app-in-a-docker-container)

このファイルを元にイメージを作成します。

`svelte-image`の部分はイメージ名で、任意です。

```bash
$ docker build -t svelte-image .
```

`docker images`コマンドでイメージが作成されたことを確認します。

<br>

続いて、このイメージを元にコンテナを作成します。

```bash
$ docker run -p 5000:5000 --name svelte-container svelte-image
```

`--name`オプションでコンテナに名前（`svelte-container`）をつけています。

`-p`オプションではホストOSのポートとコンテナ内部のポートを接続しています。

`docker ps`でコンテナが起動していることを確認してください。

<br>

### コンテナ内部の操作

続いて、コンテナ内部に入ります。

```bash
$ winpty docker exec -it svelte-container sh
/usr/src/app # 
```

私は Git Bash を使っているので、先頭に`winpty`をつけました。

最後の引数は使用するシェルで、bash だとエラーになるので sh を指定しました。

<br>

localhost を立ち上げます。

```sh
/usr/src/app # npm run dev

> svelte-app@1.0.0 dev /usr/src/app
> rollup -c -w

rollup v2.26.6
bundles src/main.js → public/build/bundle.js...
LiveReload enabled
created public/build/bundle.js in 833ms

[2020-08-28 12:00:00] waiting for changes...

> svelte-app@1.0.0 start /usr/src/app
> sirv public "--dev"

  Your application is ready~! �

  - Local:      http://0.0.0.0:5000
  - Network:    http://172.17.0.2:5000

────────────────── LOGS ──────────────────


```

ブラウザから`localhost:5000`に接続すると、スタート画面が表示されます。

（表示されている２つの URL ではいずれもうまく接続できませんでした。）

{{< img src=hello-world alt="Svelte スタート画面" >}}

<br>

### ファイルの編集

ファイルの編集もコンテナ内から行います。

ターミナルをもう一つ立ち上げてコンテナ内に入るか、サーバを停止します。

試しに`main.js`を編集してみます。

```sh
/usr/src/app # ls
node_modules       package.json       rollup.config.js
package-lock.json  public             src
/usr/src/app # cd src
/usr/src/app/src # ls
App.svelte  main.js
/usr/src/app/src # vi main.js
```

エディタは vi/vim になると思います。

vim が入っていなかったら`apk add vim`コマンドなどでインストールできます。

<br>

main.js を編集します。

```js {name="main.js", hl_lines=[6,7], ins=[1], del=[0]}
import App from './App.svelte';

const app = new App({
        target: document.body,
        props: {
                name: 'world'
                name: 'svelte'
        }
});

export default app;
```

このように編集して再度`npm run dev`コマンドを打つ（別のターミナルで編集した場合はページをリロードする）と、変更が反映されます。

{{< img src=hello-svelte alt="Hello Svelte" >}}

これでコンテナ内のコードをいじりまくっても、ローカルにはまったく影響なく開発できるようになります！

---

お役に立てれば幸いです。

では:wave: