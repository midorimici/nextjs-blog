---
title: "CSS を遅延読み込みさせる方法"
date: 2020-05-23T12:00:00+09:00
lastmod: 2020-05-23T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, HTML]
draft: true
---

ページの読み込み速度を上昇させるために、

<p>{{% tltp ファーストビュー %}}スクロールなしで表示される部分{{% /tltp %}}に影響を与えない CSS や重要度の低い CSS を、ページ全体の読み込みが完了した後に表示させるという方法があります。</p>

今回は、CSS の遅延読み込みを JavaScript を使って実現する方法をご紹介します。

<!--more-->

<br>

## `</body>`直前にコードを挿入

`</body>`直前に次のコードを挿入します。

```html
<script type="text/javascript" defer>
    var delaycss = document.createElement('link');
    delaycss.rel = 'stylesheet';
    delaycss.href = '/css/delaycss.css';
    document.head.appendChild(delaycss);
</script>
```

これは、ページの読み込み段階でこのコードにたどり着いたときに、

JavaScript で動的に`</head>`の直前に

```html {linenos=false}
<link rel='stylesheet' href='/css/delaycss.css'>
```

というコードを挿入するという仕組みです。

つまり、この`<script>`タグにたどり着いたときにはじめて CSS が読み込み・反映されるというわけです。

ちなみに、この`<script>`タグ自体も`defer`属性を指定して、実行を遅らせています。

<br>

## 