---
title: "【初心者向け】サイトのカスタマイズ方法"
date: 2020-05-05T12:00:00+09:00
lastmod: 2020-05-05T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, HTML]
draft: false
---

ある程度完成した状態のウェブサイトを、自分好みにカスタマイズしたいと感じることは少なくありません。

しかし、どこにどんなコードを書けば思った通りに反映されるのか、具体的な方法がわからない方もいると思います。

今回は、サイトをカスタマイズする方法についてお話します。

<!--more-->

<br>

## おおまかな手順

すべての場合においてやるべきことは共通しています。

1. カスタマイズしたい部分のコードを**見つけて**
1. 希望を実現するためのコードを**入れる**

以下では記事一覧のタイトルの上に画像を挿入する場合を例にして解説していきます。

<br>

## カスタマイズしたい部分のコードを見つける

カスタマイズしたい部分の近くにマウスポインタをもってきてから、右クリックしてデベロッパーツールを開きます。

そうするとその部分の HTML の構造が見られるようになります。

例えば、記事一覧のページにあるひとつの記事のタイトルを右クリックしてデベロッパーツールを開くと、HTML は次のようになっていたとします。

```html {hl_lines=[4]}
<ul class="post-list">
    <li class="list-item">…</li>
    <li class="list-item">
        <h2 class="title"><a href="/posts/example-page2">Title 2</a></h2>
        <summary class="summary">…</summary>
    </li>
    <li class="list-item">…</li>
    <li class="list-item">…</li>
</ul>
```

タイトルの直前に画像を挿入したいなら、３行目と４行目の間にコードを入れればいいとわかります。

そこで、HTML を表すファイルの中からこの部分を表現している部分を探すことになります。

### 検索のかけ方

ファイル名だけでなく**ファイルの内容も含めて検索する**必要があります。

Visual Studio Code を使っているなら、File > Open Folder または Open Workspace からフォルダを開いた状態で検索をかけると、

そのフォルダ以下にあるすべてのファイルの内容も含めて検索してくれます。

<br>

検索をするときに使用するキーワードにも注意が必要です。

**動的な情報を含まないように**しましょう。

例えば記事一覧における各記事のタイトルや要約文、カテゴリやタグなどは、記事によって変化するので、

HTML ではループ処理など特殊な構文を使って記述されている可能性が高く、検索にかかりません。

特定には id 属性や class 属性が便利です。

今回の例では、`<li class="list-item">`で検索をかけるとよいでしょう。

ただし、これらの属性も動的に操作されている可能性があり、

（例えばclass 属性に post が追加されていて、デベロッパーツールでは`class="list-item post"`になっているなど）

必ずしももとの HTML で書かれているものと一致するとは限りません。

その場合、検索キーワードの範囲を変えてみましょう。

### 検索結果に複数の候補ファイルが表示された場合

まずはファイル名からだいたいあたりをつけます。

とはいえ、ファイルを開いて間違い探しをするのが一番確実です。

<br>

## 希望を実現するためのコードを入れる

該当の箇所を見つけたら、実際にコードを入れていきます。

今回の例では、該当部分は次のようになっていたとします。（Hugo の例です。）

```go-html-template {hl_lines=[3]}
<ul class="post-list">
    {{ range .Site.RegularPosts }}
        <li class="list-item">
            <h2 class="title"><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
            <summary class="summary">{{ .Summary }}</summary>
        </li>
    {{ end }}
</ul>
```

さて、タイトルを表すのは４行目なので、その直前に画像（img タグ）を挿入すれば OK です。

```go-html-template {hl_lines=[4]}
<ul class="post-list">
    {{ range .Site.RegularPosts }}
        <li class="list-item">
            <img src="/images/{{ .File.ContentBaseName }}.jpg" alt="{{ .Title }}">
            <h2 class="title"><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
            <summary class="summary">{{ .Summary }}</summary>
        </li>
    {{ end }}
</ul>
```

あとは実際のサイトを見ながら微調整をしていけばいいでしょう。

{{< relpos programming-kiso >}}

---

お役に立てたなら幸いです。

それではまた:wave: