---
title: "【Hugo】ブログの記事ページのサイドバーに固定目次を追加"
date: 2020-03-03T16:44:52+09:00
lastmod: 2020-04-24T12:44:52+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo, HTML]
draft: false
---

{{< pstlk こちら add-sidebar >}}の記事で、ブログにサイドバーを追加しました。

今回はこのサイドバーに目次を追加していきます。

<br>

## 完成イメージ

機能的には、

- クリックしたらリンクしてその項目に飛ぶ
- スクロールしてもついてきてくれる
- 必要ない時には隠れる

ぐらいが欲しい。
<!--more-->
デザインは、既にあるサイドバーの項目（プロフィール）のものを踏襲する形にします。

{{< img src=blueprint ext=png alt=完成イメージ >}}

<br>

## 記事ページの目次

{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}
では、 h タグから自動的に目次を生成してくれる機能が備わっているので、

とりあえずそれを利用してみます。

```go-html-template {name="sidebar.html", hl_lines=["6-14"]}
<div class="sidebar">
    <div class="profile">
        <h4 class="sidebar-header">プロフィール</h4>
        ...
    </div>
    {{- if .IsPage -}}
        {{ $enableTOC := .Params.toc | default .Site.Params.enableTOC -}}
        {{- if $enableTOC -}}
            <div class="sidebar-toc">
                <h4 class="sidebar-header">目次</h4>
                {{- .TableOfContents -}}
            </div>
        {{- end -}}
    {{- end -}}
</div>
```

記事以外のページには目次は必要ないということで、

記事ページにのみ表示という意味で6行目。

enableTOC は config.toml やマークダウンファイルの
{{% tooltip %}}フロントマター((マークダウンファイルの先頭の、その記事に関する情報を書く部分{{% /tooltip %}}
で指定されるもので、

目次を表示するかしないかの設定です。

11行目が Hugo の目次を呼び出しています。

これで一応サイドバーに目次を設置することはできました。

「クリックしたらリンクしてその項目に飛ぶ」も最初からついています。

<details><summary>ちなみに Hugo の作った目次の構造は…</summary>

ちなみに Hugo の作った目次の構造は次のようになっています。

```html
<nav id="TableOfContents">
    <ul>
        <li>
            <a href="#見出し1">見出し1</a>
            <ul>
                <li>
                    <a href="#見出し2">見出し2</a>
                </li>
                <li>
                    <a href="#見出し3">見出し3</a>
                </li>
            </ul>
        </li>
        <li>
            <a href="#見出し4">見出し4</a>
        </li>
    </ul>
</nav>
```

このとき目次欄には

- 見出し1
    - 見出し2
    - 見出し3
- 見出し4

のように表示されます。

</details>

<br>

あとの2つの要件「スクロールしてもついてきてくれる」「必要ない時には隠れる」は

CSS と JavaScript で対処します。

### スクロールしてもついてきてくれる

CSS で`position: fixed;`とすれば、スクロールしても動かなくなります。

その後、`top`や`left`で位置を調整します。

```scss:custom.scss
.sidebar-toc {
    position: fixed;
    top: 0;
}
```

しかし、これではスクロール量が少ないときに、ヘッダやサイドバーの他の項目と重なってしまいます。

### 必要ない時には隠れる

スクロール量を取得して、一定の値より小さければ非表示にします。

```js:custom.js
// sidebar-toc というクラス名の要素のリストを取得し、その最初の要素を取得
var toc = document.getElementsByClassName('sidebar-toc')[0];
　
if (toc) {
    // スクロールが起きたときに関数を実行
    window.addEventListener('scroll', function () {
        // スクロール量が一定値より大きいとき
        // sidebar-toc のクラスに show を追加
        window.scrollY > 1000 ? toc.classList.add('show') : toc.classList.remove('show');
    });
}
```

クラスを追加することによって、これを CSS で表示・非表示を切り替えることができるようになりました。

```scss:custom.scss {hl_lines=["4-9"]}
.sidebar-toc {
    position: fixed;
    top: 0;
    opacity: 0;             // 透過度を0にして非表示
    pointer-events: none;   // リンクを無効に
    transition: opacity 0.5s ease-in-out;
    &.show {
        opacity: 1;             // 透過度を1にして表示
        pointer-events: auto;   // リンクを有効に
    }
}
```

`display: none;`だとアニメーションできず瞬間で消えたり現れたりするので、

フェードイン・フェードアウトするように`opacity`を使っています。

`pointer-events`は、マウスポインタをあてたときに反応する領域を指定するもので、

`none`に設定することでリンクを無効にできます。

{{< relpos blog-fukidashi >}}

---

以上で記事ページに目次を設置することができました。

しかし、これと同じ方法では`.TableOfContents`が使えない場合に目次を設置することはできません。

長くなってしまったので、そのへんのお話はこちらをどうぞ。

{{< relpos no-hugo-tableofcontents >}}

最後まで読んでくださってありがとうございました:wave: