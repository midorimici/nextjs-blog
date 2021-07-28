---
title: "【Hugo + Netlify】デプロイ時に CSS, JS が適用されない場合の対処法"
date: 2020-03-20T12:00:00+09:00
lastmod: 2020-05-08T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo, Netlify]
draft: false
---

<p>
{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}} 
で作成したサイトを
{{% tooltip %}}Netlify((静的サイトをホスティング（サーバ貸出）できるサービス<br>[公式サイト](https://www.netlify.com/){{% /tooltip %}}
でデプロイ（公開）した際に、
</p>

ローカルホスト（hugo server）ではうまく動いていた CSS/SCSS や JS が動なくなってしまうことがあります。

考えられる原因はいろいろあるので、トラブルシューティングとしてお読みいただければと思います。

<!--more-->

<br>

## 原因の調べ方（Chrome の場合）

以下の手順で適用されている CSS や JS ファイルを特定できます。

ローカルホスト、デプロイページの両方を開いて比較します。

ファイル名は異なっていても、内容が同一であれば問題ありません。

内容は右クリックから新規タブで開くなどして確認することができます。

### CSS/SCSS ①

ページ内の同じ要素にマウスカーソルをのせて、右クリックからデベロッパーツール（検証ツール）を開きます。

そこで、Styles という欄に、現在ハイライトしている HTML 要素に適用されている CSS が表示されます。

{{< img src=devtool_css ext=png width=360 alt=デベロッパーツールCSS >}}

（クリックで拡大できます）

そのスタイルがどの CSS ファイル由来なのかも右肩に表示されます。

### CSS/SCSS ②

デベロッパーツールを開き、 HTML の中から`<link rel="stylesheet" href="..." ...>`を探します。

おそらく head タグ内にあります。

{{< img src=devtool_link_ss ext=png alt=デベロッパーツールlink-stylesheet >}}

### JS

デベロッパーツールを開き、 HTML の中から`<script src="...">`を探します。

おそらく head タグ内か、 body タグ内の最後のほうにあると思います。

src にはどの JS ファイルが読み込まれるか指定されています。

{{< img src=devtool_script_src ext=png alt=デベロッパーツールscript >}}

{{< relpos no-hugo-tableofcontents >}}

<br>

## 全体的に適用されない

おそらく[先述の手順](#cssscss-)でファイル内容を比較しても相違点がなかったり、

そもそも表示がされていなかったりするかと思います。

### Hugo のバージョンが extended でない（SCSS の場合）

extended ではないバージョンの Hugo は SASS/SCSS をサポートしていません。

SASS/SCSS を使いたい場合は extended version をインストールしましょう。

### CSS/JS ファイルが読み込まれていない

該当する link タグや script タグが見つからない場合、ページに CSS/JS ファイルを読み込むことができていません。

`/layouts`以下のファイルからタグを探して、なければ書き加えましょう。

### config.toml の設定が適切でない

link タグや script タグが存在し、指定されているファイルに相違点が見つからない場合、

config.toml が適切に記述できていない可能性があります。

この場合、 CSS では、[CSS/SCSS ①](#cssscss-)の手順で Styles の欄に表示されるものが異なります。

`baseURL`がデプロイページのものと一致していること、`theme`がローカルの`/themes`直下のフォルダ名と同一であることを確認してください。

<br>

## 一部のみ適用されない

おそらく[先述の手順](#cssscss-)でファイル内容を比較すると、

内容が違う、自分で書き加えた部分が記載されていないなどという状態になるかと思います。

### ローカルリポジトリとリモートリポジトリのファイルが異なる

Netlify はリモートリポジトリ（GitHub など）のファイルをもとにサイトを構築します。

プッシュをしていないために、ローカルでの変更内容がリモートリポジトリに反映されていないと

デプロイページに変更が反映されません。

ルートディレクトリにて次のコマンドを打ってから再度確認してみましょう。

```
git add .
git commit -m "commit message"
git push origin master
```

### Build image selection を変えてみる（SCSS の場合）

Netlify の Settings > Build & Deploy > Build image selection > Edit settings から

Build image を変更してデプロイしてみます。

私の場合、 Ubuntu Xenial 16.04 (default) を Ubuntu Trusty 14.04 に変更したところ

カスタム SCSS が適用されました。

### `/static`以下に置いてみる（`/static`以下にない場合）

`/static/css`や`/static/js`を作成し、そこに反映させたい CSS や JS を置きます。

その後`/layouts`以下の適切なファイルの中で、 CSS や JS を読み込むコードを記述します。

```html {linenos=false}
CSS の場合
<link rel="stylesheet" href="/css/custom.css">
　
JS の場合
<script type="text/javascript" src="/js/custom.js"></script>
```

私の場合、カスタム JS はこの方法ではじめて適用されました。

{{< relpos blog-koukai-sooner-better >}}

---

デプロイできたと思ったらレイアウトがぐちゃぐちゃになっていたら、結構焦りますよね。

もはや公開されてしまっているから。

でも最初は見ている人が少ないので、ゆっくり冷静に対応していきましょう。

この記事がお役に立てたなら幸いです。

それではまた～:wave: