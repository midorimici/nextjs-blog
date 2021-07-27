---
title: "【HTML】これがやりたい！一問一答"
date: 2020-05-23T12:00:00+09:00
lastmod: 2020-05-23T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, HTML]
draft: false
---

この記事では、「HTML でこういうことがやりたいけど、何を使えばいいのかわからない」という方へ向けて、

一問一答形式で方法を書いていきます。

調べたら出てきそうなことよりも、ちょっと手の届かなさそうなかゆいところを中心にご紹介します。

それでは参りましょう！

<!--more-->

<br>

## 画像を表示させたいけど、ブラウザが対応してないかも！

`<picture></picture>`の中に`<source>`タグと`<img>`タグを入れましょう。

`<picture>`は、中にある複数の`<source>`の`srcset`で指定された URL を検討して、ブラウザがそれに対応していれば選択し、

対応していなければ`<img>`の`src`で指定された URL を選択します。

つまり、別の拡張子の２枚の画像を用意する必要があります。

{{< relpos site-webp-donuhoho >}}

<br>

## 動画を表示させたいけど、ブラウザが対応してないかも！

`<video></video>`の中に`<source>`タグを入れましょう。

`<picture>`と同様に、`<video>`の中にある複数の`<source>`の`src`で指定された URL を検討して、

ブラウザが理解できるものが使用されます。

`<video>`には`controls`属性を付与しなければ再生や音量調整ができないので、付与することをおすすめします。

<br>

## サイトやページのタイトルを変えたい！

{{< img src=tab-title alt="サイトタイトル" >}}

`<head></head>`内部の`<title></title>`タグの内容を変更しましょう。

<br>

## タブのタイトル横のロゴ（favicon）を変えたい！

{{< img src=tab-favicon alt="favicon" >}}

まず[Favicon Generator](https://realfavicongenerator.net/)などのサービスで`.ico`形式のアイコン画像を作成します。

次に`<head></head>`内部に

```html {linenos=false}
<link rel="icon" href="/favicon.ico">
```

のように記述します。

<br>

## SNS でシェアしたときに表示される画像を変えたい！

`<head></head>`内部に、次のような記述があると思います。

```html {linenos=false, hl_lines=[3, 5]}
<meta name="twitter:site" content="@user_name">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://example.com/images/subnail.jpg">
<meta property="og:url" content="https://example.com/posts/example-post/">
<meta property="og:image" content="https://example.com/images/subnail.jpg">
<meta property="og:title" content="ページのタイトル">
<meta property="og:description" content="ページの説明">
```

`twitter:image`と`og:image`の画像への URL を変更することで、SNS で表示される画像を変更することができます。

---

参考になれば幸いです。

では:wave: