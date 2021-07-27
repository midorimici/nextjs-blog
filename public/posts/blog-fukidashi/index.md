---
title: "【Hugo】ブログにマウスオーバーでふわっと表示する吹き出しを追加"
date: 2020-03-26T12:00:00+09:00
lastmod: 2020-05-23T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo, HTML]
draft: false
---

このブログでは、プログラミングの用語など、少し専門的な言葉が出てくることがよくあります。

そのときに、いちいち言葉の意味を解説すると、

書き手としても、その分野の用語をよく知っている読み手としても、くどくなってしまいます。

かといって解説を書かないのも初学者に不親切です。

そのため、その言葉の意味を知らない人はマウスオーバー（スマホやタブレットならタップ）で

<!--more-->

言葉の簡単な説明が見られるようにしています。

これはツールチップというそうです。

今回は、
{{% tooltip %}}こういうもの((やっほー<br>ここに説明を書くよ{{% /tooltip %}}
がどのように実装できるかお話していきます。

<br>

## コーディング

こちらを参考にさせていただきました。

→ [マウスオーバーで吹き出し表示](https://webparts.cman.jp/balloon/over/)

### HTML

文中にも書くため、`<span>`タグを使っています。

```html
<span class="tooltip" ontouchstart="">
    <span class="tooltip-base">（もとの文字列）</span>
    <span class="fukidashi">（吹き出しに表示される文字列）</span>
</span>
```

ontouchstart というのは、スマホなどのタッチデバイスで指が触れたときに発生するイベントです。

念のためつけています。

### CSS

SCSS で書いています。

```scss {hl_lines=[2, 17, 28, 31, "36-38", 44]}
.tooltip {
    position: relative;
    cursor: help;       // マウスカーソルを変更
    color: #f48b7b;     // 文字色
    a {
        color: #f48b7b;
    }
}
　
.fukidashi {
    transition: .5s;    // アニメーション秒数
    z-index: -1;        // 他と重なったときの上からの順番
    opacity: 0;         // 不透明度
    min-width: 10em;    // 最小の幅
　
    // 位置調整
    position: absolute;
    left: -1em;
    bottom: 100%;
    padding: 0.5em;
    margin-bottom: 1em;
　
    font-size: 0.6em;       // フォントサイズ
    border-radius: 0.6em;   // 角を丸く
    background: #fff0f0;    // 背景色
　
    &::after {
        content: "";    // 内容
　
        // 位置調整
        position: absolute;
        left: 25%;
        bottom: -1em;
　
        // 三角形の描画
        border-top: solid 1em #fff0f0;
        border-left: solid 0.5em transparent;
        border-right: solid 0.5em transparent;
    }
}
　
.tooltip:hover .fukidashi {
    z-index: 0;     // 他と重なったときの上からの順番
    opacity: .96;   // 不透明度
}
```

修飾が多いですが、最低限必要となるのは黄色でマークした部分だけです。

`after`疑似要素によって、`fukudashi`の要素直後に三角形を描いています。

最初は CSS で三角形だなんて何事だと思いました笑が、

こちらのサイトを読んでいたらなんとなくわかりました。

→ [CSSだけで三角形を作ろう！その1：borderプロパティの仕組みをマスター | 株式会社グランフェアズ](https://www.granfairs.com/blog/staff/make-triangle-with-css)

ちなみにこの状態では表示された吹き出しにマウスポインタを移動させても表示され続けますが、

42行目を`.tooltip-base:hover + .fukidashi`とすれば、

文字からマウスポインタを離すと吹き出しは消えてしまいます。

`.tooltip-base:hover + .fukidashi`は`.tooltip-base`にマウスオーバーしたときに`.fukudashi`に適用されるスタイルを指定します。

{{< relpos add-sidebar >}}

<br>

## Hugo ショートコードとあわせて

記事内で多用するので、ショートコードを作りました。

ショートコードを使うには、`/layouts`以下に`shortcodes`フォルダを作り、

ショートコード名と同名のファイルを作成します。

```go-html-template {name="/layouts/shortcodes/tooltip.html"}
{{- $inner := .Inner -}}
{{- $split := split $inner `((` -}}
{{- $tooltip_base := index $split 0 -}}
{{- $fukidashi := index $split 1 -}}
　
<span class="tooltip" ontouchstart="">
    <span class="tooltip-base">{{ $tooltip_base | markdownify }}</span>
    <span class="fukidashi">{{ $fukidashi | markdownify }}</span>
</span>
```

`.Inner`には

<code><span>{</span>{< shortcode_name >}}<span>{</span>{< /shortcode_name >}}</code>

で挟まれた部分が渡されます。

<br>

例えば<code><span>{</span>{< tooltip >}}やっほー((`**太字**`だよ<span>{</span>{< /tooltip >}}</code>と書けば、

`.Inner`に`やっほー((**太字**だよ`が変数`$inner`に渡されます。

[`split`](https://gohugo.io/functions/split/)は指定した分割記号で文字列を分離したリスト（スライス）を返します。

`((`の前の内容が`$tooltip_base`に、後の内容が`$fukidashi`に渡されます。

例えば`やっほー((**太字**だよ`は`やっほー`と`**太字**だよ`に分けられ、

後者は最終的には`<strong>太字</strong>だよ`となります。

`markdownify`はマークダウンとして処理をするということです。

今回は`((`で前後を分けていますが、より複雑な分け方をしたい場合は正規表現を使うとよいでしょう。

```go-html-template {name="tooltip.html"}
...
{{- $pattern := `^(.+)\\(\\((.+)$` -}}
{{- $tooltip_base := replaceRE $pattern `$1` $inner -}}
{{- $fukidashi := replaceRE $pattern `$2` $inner -}}
...
```

ところで、ここでは`{{}}`の中の`-`は必須です。

これがないとこの行が空行とみなされてしまいます。

ここはマークダウンファイルの中なので、その空行を見つけてマークダウン処理がなされ、

表示がおかしくなってしまいます。

{{< relpos hugo-shortcode >}}

---

吹き出しは難しそうに見えますが、表示させるだけなら比較的簡単に実装できます。

お役に立てたらうれしいです。

それでは:wave: