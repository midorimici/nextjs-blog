---
title: '【Netlify】サブディレクトリにページをデプロイする方法'
date: 2020-07-23T12:00:00+09:00
lastmod: 2020-08-4T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Netlify]
draft: false
---

例えば`example.com`という URL を持っていたとして、

`example.com/subdir`というサブディレクトリの URL にデプロイしたいときに

どうすればいいのかというお話です。

Netlify での場合を説明していますが、

他のサービスでもおおむね同じような設定になるのではないかと思います。

<!--more-->

<br>

## サイトを２つデプロイする

ここでは例として`example.com/subdir`という URL にデプロイをしていくことを考えます。

まずは`example.com`のサイトと`example.com/subdir`にする予定のサイトのデプロイを完了させます。

<br>

この時点では`example.com/subdir`にする予定のサイトの URL は別のもの、

例えば`marvellous-sheep.netlify.app`のようになっていると思います。

<br>

これは変更してもいいですし、そのままにしておいても構いません。

<br>

## リダイレクトを設定する

次に、`example.com`のサイトのルートディレクトリに`netlify.toml`を作成し、

次のように記述します。

```toml {name="netlify.toml"}
[[redirects]]
	from = "/static/*"
	to = "https://marvellous-sheep.netlify.com/static/:splat"
	status = 200
	force = true

[[redirects]]
	from = "/subdir"
	to = "https://marvellous-sheep.netlify.com"
	status = 200
	force = true
```

200 リダイレクトによって、

アドレスバーの URL の表示を変更させることなく目的のサイトに飛ばすことができ、

見た目上はサブディレクトリにそのサイトが配置される形になります。

<br>

7-11 行目は、`example.com/subdir`にアクセスがあると、

`https://marvellous-sheep.netlify.com`に 200 リダイレクトするという意味になります。

<br>

{{< img src=404err alt="CSS や画像が見つからない" >}}

サイトだけリダイレクトしても、CSS や画像のパスがおかしくなって表示されないので、

1-5 行目で`example.com/subdir/static`以下にあるすべてのファイルを

`https://marvellous-sheep.netlify.com/static`以下に移しています。

<br>

`:splat`というのは`*`（ワイルドカード）の部分を展開しているので、

例えば`example.com/subdir/static/app.css`は

`https://marvellous-sheep.netlify.com/static/app.css`に、

`example.com/subdir/static/images/image1.png`は

`https://marvellous-sheep.netlify.com/static/images/image1.png`に移ります。

<br>

これでリソースの読み込みも正常に行われます。

<br>

## ユースケース

例えば、`example.com/works/react`には React 製のサイトを、

`example.com/works/gatsby`には Gatsby 製のサイトを、

`example.com/works/hugo`には Hugo 製のサイトを置く、

というようなことができるようになります。

<br>

とはいえ、そう見えているだけであって、実際には他の URL が存在しているので、

管理はサイトごとに行うことになります。

---

ドメインを追加購入しているわけでもないので、無料でできます。

お役に立てれば幸いです。

では:wave: