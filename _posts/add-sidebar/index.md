---
title: "【Hugo】ブログにサイドバーを追加/レスポンシブデザイン"
date: 2020-02-26T10:00:00+09:00
lastmod: 2020-05-16T10:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo, HTML]
summary: "このブログは Hugo で作っていて、テーマはもともとサイドバーがついていないものだったのですが、

サイドバーが欲しかったので付け加えてみました。"
draft: false
---

このブログは [Hugo](https://gohugo.io/) で作っていて、テーマはもともとサイドバーがついていないものだったのですが、

サイドバーが欲しかったので付け加えてみました。
<!--more-->
<br>

## サイドバーの構造

そもそもサイドバーってどうやってメインのコンテンツと並立しているのかと。

ふつうに後ろに書くと後ろに続いてしまうか、変な回り込みを起こしてレイアウトが崩れてしまいます。

そこで調べていたところ、こちらのサイトが参考になりました。

→ [HTML+CSSによるウェブページ制作例](http://www.htmq.com/csskihon/401.shtml)

どうやら CSS の **`float` で浮かせてしまえばいい**ようです。

最終的にはこんな感じになればいいのかな。

{{< img src=blueprint ext=png alt=完成イメージ >}}

{{< relpos add-toc >}}

<br>

## コーディング

`layouts/partials/custom/sidebar.html`を作成。

とりあえずプロフィールだけ載せます。

```html:sidebar.html
<div class="sidebar">
    <div class="profile">
        <h4 class="sidebar-header">プロフィール</h4>
        <img class="avatar-image" src="/images/avatar.png" alt="みどりみち">
        <a href="{{ .Site.BaseURL }}about">
            <h4 class="to-profile">みどり　みち</h4>
        </a>
        <p>駆け出しソフトウェアエンジニア。</p>
        <p>デザインに凝りがち。</p>
        <p>歌うことが好きで、声オタク。</p>
    </div>
</div>
```

`{{ .Site.BaseURL }}`というのが、ドメインまでの URL で、最後の`/`も含みます。

この HTML ファイルを、`layouts/partials/post.html`の中で呼び出します。

```go-html-template {name="post.html", hl_lines=[5]}
<main class="main single" id="main">
    <div class="main-inner">
        ...
    </div>
    {{ partial "custom/sidebar.html" . }}
</main>
```

CSS のほうでは、機能的には`float`を指定するぐらいで大丈夫です。

```css {name="/assets/scss/_custom/custom.scss　または　/static/css/custom.css", hl_lines=[2, 8]}
.main-inner {
    float: left;
    padding-right: 3em;
    padding-bottom: 3em;
}
　
.sidebar {
    float: right;
}
```

`sidebar`は`float: left;`でもいいかなと思ったのですが、

`main-inner`の横幅によってがくがくと位置が変わるのが気に食わなかったので、`right`にしています。笑

そうすると拡大縮小のさいに変な回り込みをしたり離れすぎたりするという問題が発生しましたので、

レスポンシブデザインが必要になりました。

{{< relpos site-customize-hoho >}}

<br>

## レスポンシブデザイン

といっても意外とやることは簡単で、 CSS のほうに例えばこんなふうに書けば適用されます。

```css
@media (max-width: 1199px) {
    /* 画面の横幅が1199px以下の処理 */
}
　
@media (min-width: 1200px) {
    /* 画面の横幅が1200px以上の処理 */
}
```

HTML の`head`タグ内に

```html {linenos=false}
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes">
```

などと書く必要があるのですが、

このサイトの場合最初から記述のあるテーマでした。

それからはブラウザのデベロッパーツールで見ながらちまちまと CSS をいじれば大丈夫です！

他のサイトからデベロッパーツールを開いて、そのときの CSS を見ても

レスポンシブ対応であれば`@media ...`と書かれているところがあると思うので、

自分の真似したいサイトをそうやって参考にすることもできますね。

どういうときにサイドバーが下に移るんだろう、とか。

```css {name="custom.scss", id=4}
@media (max-width: 1199px) {
    #main {
        width: 90%;
    }
    .main {
        padding: 2em 0 15em
    }
    .container {
        width: 100% !important;
    }
    .main-inner {
        width: 100% !important;
        padding-right: 0;
    }
    .sidebar {
        float: left;
        width: 90%;
    }
}
　
@media (min-width: 1200px) {
    #main {
        width: 1100px
    }
}
```

{{< relpos blog-fukidashi >}}

---

サイドバーの実装と、レスポンシブ対応について書きましたが、

意外とひとつの記事にまとまるぐらいやること自体は簡単です。

書くのは簡単ですが、 CSS をああでもないこうでもないといじるのが一番時間がかかるんじゃないかな。笑

お読みいただきありがとうございました～

ではまた:wave: