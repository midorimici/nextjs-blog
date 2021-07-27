---
title: "ウェブサイトに WebP を導入する方法"
date: 2020-05-13T12:00:00+09:00
lastmod: 2020-05-21T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo, HTML]
draft: false
---

次世代画像フォーマット WebP は、JPEG や PNG と比べると、画像の品質の割にはかなりファイルサイズを小さくできます。

しかし、ブラウザによっては対応していない場合もあるので、対応していない場合の処理の記述も必要となってきます。

今回は、

- ウェブページ内で WebP を使う方法
- Hugo での画像ショートコード例

についてお話します。

<!--more-->

<br>

## ウェブページ内で WebP を使う

ブラウザが対応していれば、

```html {linenos=false}
<img src="example.webp">
```

と普通に`img`タグを使っても正しく表示されます。

しかし、ブラウザが対応していない場合は表示されません。

（ブラウザの対応状況は[こちら](https://caniuse.com/#feat=webp)で確認することができます。）

これに対処するために、`picture`タグと`source`タグを使って、次のようにします。

```html
<picture>
    <source type="image/webp" srcset="example.png.webp">
    <img src="example.png">
</picture>
```

`picture`は中にある`source`の`srcset`で指定された URL の中から、ブラウザがそれに対応していれば選択し、

対応していなければ`img`の`src`で指定された URL を選択します。

この`img`タグは、普通の`img`タグと同様に属性を付加できます。

```html {hl_lines=[3], inline_hl=[1:["2-4"_"8-13"]]}
<picture>
    <source type="image/webp" srcset="example.png.webp">
    <img class="example-img" src="example.png" alt="example" title="これは例です">
</picture>
```

こちらにスタイルを適用すれば、WebP で表示されている場合でもスタイルは適用されます。

{{< relpos gazo-saitekika >}}

<br>

## 【Hugo】WebP に対応した画像ショートコードを作る

ここからは
{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}
の話になります。

さきほどのコードを画像の埋め込みのたびに書くというのは、重複部分が多すぎるため得策ではありません。

そこで Hugo のショートコードを利用します。

例えば、コードは次のようになります。

```go-html-template {name="img.html", id=2}
{{ $name := .Get "src" }}
{{ $extention := .Get "ext" | default "jpg" }}
{{ $alt := .Get "alt" }}
{{ $width := .Get "width" | default "auto" }}
{{ $minipath := printf "/posts/%s/%s.%s" .Page.File.ContentBaseName $name $extention }}
{{ $path := printf "content%s.webp" $minipath }}
{{- if (fileExists $path) -}}
    <picture>
        <source type="image/webp" srcset="{{ $minipath }}.webp">
        <img src="{{ $minipath }}" width={{ $width }} 
        alt={{ $alt }} title={{ $alt }}/>
    </picture>
{{- else -}}
    <img src="{{ $minipath }}" width={{ $width }}
    alt={{ $alt }} title={{ $alt }}/>
{{- end -}}
```

`fileExists`は`$path`が存在するかどうかを返す関数です。

これで、`/posts`以下のマークダウンファイル内で書かれたショートコードに、このコードが展開されます。

例えば、`/posts/example/index.md`内で

<div class="highlight" style="position: relative;"><pre class="chroma"><code class="language-go-html-template" data-lang="go-html-template"><span>{</span>{<span class="p">&lt;</span> <span class="nt">img</span> <span class="na">src</span><span class="o">=</span><span class="s">example</span> <span class="na">ext</span><span class="o">=</span><span class="s">png</span> <span class="na">alt</span><span class="o">=</span><span class="s">例</span> <span class="na">width</span><span class="o">=</span><span class="s">300</span> <span class="p"></span><span class="p">&gt;</span>}}
</code><button class="copy-button" type="button">Copy</button></pre></div>

と書けば、

`/posts/example/example.png.webp`が存在し、ブラウザが対応していればこの画像が表示され、

ブラウザが対応していない、もしくはファイルが存在しなければ`/posts/example/example.png`が表示されるようになります。

---

この記事がお役に立てたなら幸いです。

それでは:wave: