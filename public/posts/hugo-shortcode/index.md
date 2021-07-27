---
title: "【Hugo】ショートコードで複雑な HTML を簡潔に"
date: 2020-05-22T12:00:00+09:00
lastmod: 2020-05-23T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo, HTML]
draft: false
---

<p>
{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}ではショートコードという機能があり、

これを使うことで複雑な HTML 構造も簡潔な形でマークダウン（.md）ファイルの中に記述することができるようになります。
</p>

今回は、ショートコードの使い方について書いていきます。

<!--more-->

<br>

## ショートコードを設定する

`layouts/shortcodes`フォルダを作り（フォルダ名は任意ではない）、その中に HTML ファイルを作成します。

この HTML ファイル名が、ショートコードの名前になります。

HTML ファイル内には、ショートコードを使用したマークダウンファイル内で展開したい HTML を書きます。

ここでは例として、次のようなファイルを作成します。

```go-html-template {name="/layouts/shortcodes/greet.html"}
<p>おはようございます。</p>
<p>今日の天気は晴れです。</p>
```

<br>

## マークダウンファイルでショートコードを呼び出す

マークダウンファイルの中で、ショートコードの名前を使用して、次のように書くと、HTML が展開されます。

<div class="highlight" style="position: relative;"><pre class="chroma"><code class="language-html" data-lang="html"><span>{</span>{< greet >}}

-&gt;
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>おはようございます。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>今日の天気は晴れです。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
</code><button class="copy-button" type="button">Copy</button></pre></div>

ショートコードのファイルのほうにマークダウンの記法（**など）を使いたい場合は、`< >`は`% %`とします。

<br>

## 引数を使用する

ショートコードに引数を追加して、HTML の中で使うこともできます。

HTML ファイルの中では、引数は`{{ .Get 0 }}`のように、引数の位置を指定することで取得できます。

```go-html-template {name="/layouts/shortcodes/greet.html"}
{{- $name := .Get 0 -}}
{{- $weather := .Get 1 -}}
<p>おはようございます、{{ $name }}さん。</p>
<p>今日の天気は{{ $weather }}です。</p>
```

<div class="highlight" style="position: relative;"><pre class="chroma"><code class="language-html" data-lang="html"><span>{</span>{< greet "サトウ" "雨" >}}

-&gt;
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>おはようございます、サトウさん。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>今日の天気は雨です。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
</code><button class="copy-button" type="button">Copy</button></pre></div>

位置変数の他に、キーワード変数を指定することもできます。

ただし、位置変数とキーワード変数を同時に指定することはできません。

```go-html-template {name="/layouts/shortcodes/greet.html"}
{{- $name := .Get "name" -}}
{{- $weather := .Get "weather" -}}
<p>おはようございます、{{ $name }}さん。</p>
<p>今日の天気は{{ $weather }}です。</p>
```

<div class="highlight" style="position: relative;"><pre class="chroma"><code class="language-html" data-lang="html"><span>{</span>{< greet name="サイトウ" weather="曇り" >}}

-&gt;
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>おはようございます、サイトウさん。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>今日の天気は曇りです。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
</code><button class="copy-button" type="button">Copy</button></pre></div>

`default`関数を使って、引数のデフォルト値を指定することもできます。

```go-html-template {name="/layouts/shortcodes/greet.html"}
{{- $name := .Get "name" | default "タロウ" -}}
{{- $weather := .Get "weather" | default "晴れ" -}}
<p>おはようございます、{{ $name }}さん。</p>
<p>今日の天気は{{ $weather }}です。</p>
```

<div class="highlight" style="position: relative;"><pre class="chroma"><code class="language-html" data-lang="html"><span>{</span>{< greet >}}

-&gt;
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>おはようございます、タロウさん。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>今日の天気は晴れです。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
</code><button class="copy-button" type="button">Copy</button></pre></div>

{{< relpos hugo-scratch >}}

<br>

## タグで囲まれた範囲をショートコードとする

ショートコードの開始タグと終了タグで囲まれた範囲を取得することもできます。

内容は`{{ .Inner }}`で呼び出します。

```go-html-template {name="/layouts/shortcodes/greet.html"}
<p>おはようございます。</p>
{{ .Inner }}
<p>調子はどうですか。</p>
```

<div class="highlight" style="position: relative;"><pre class="chroma"><code class="language-html" data-lang="html"><span>{</span>{% greet %}}
本日はお日柄もよく、
**たいへん気持ちのいい朝**ですね。
<span>{</span>{% /greet %}}<br>
-&gt;
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>おはようございます。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>本日はお日柄もよく、
<span class="p">&lt;</span><span class="nt">strong</span><span class="p"></span><span class="p">&gt;</span>たいへん気持ちのいい朝<span class="p">&lt;</span><span class="p">/</span><span class="nt">strong</span><span class="p">&gt;</span>ですね。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>調子はどうですか。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
</code><button class="copy-button" type="button">Copy</button></pre></div>

こちらでも引数を指定することができます。

<br>

## ショートコードをネストする

開始タグと終了タグを指定するブロック型のショートコードの中に、

別のブロック型ショートコードやインライン型ショートコードを入れることもできます。

```go-html-template {name="/layouts/shortcodes/greet.html"}
おはようございます、
{{ .Inner }}
調子はどうですか。
```

```go-html-template {name="/layouts/shortcodes/name-weather.html"}
{{ .Get "name" }}さん。
今日の天気は{{ .Get "weather" }}です。
```

<div class="highlight" style="position: relative;"><pre class="chroma"><code class="language-html" data-lang="html"><span>{</span>{% greet %}}<br>
<span>{</span>{% name-weather name="ジロウ" weather="快晴" %}}<br>
<span>{</span>{% /greet %}}<br>
-&gt;
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>おはようございます、<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>ジロウさん。
今日の天気は快晴です。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>調子はどうですか。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
</code><button class="copy-button" type="button">Copy</button></pre></div>

`{{ .Parent }}`を使えば、親のショートコードから情報を取得することもできます。

```go-html-template {name="/layouts/shortcodes/name-weather.html", hl_lines=[2]}
{{ .Get "name" }}さん。
{{ .Parent.Get 0 }}
今日の天気は{{ .Get "weather" }}です。
```

<div class="highlight" style="position: relative;"><pre class="chroma"><code class="language-html" data-lang="html"><span class="hl"><span>{</span>{% greet <span class="mark">"今日は暑いですね。"</span> %}}</span>
<span>{</span>{% name-weather name="ジロウ" weather="快晴" %}}<br>
<span>{</span>{% /greet %}}<br>
-&gt;
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>おはようございます、<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>ジロウさん。
<span class="hl">今日は暑いですね。</span>今日の天気は快晴です。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">p</span><span class="p"></span><span class="p">&gt;</span>調子はどうですか。<span class="p">&lt;</span><span class="p">/</span><span class="nt">p</span><span class="p">&gt;</span>
</code><button class="copy-button" type="button">Copy</button></pre></div>

{{< relpos hugo-printf >}}

---

この記事がお役に立てれば幸いです。

それでは:wave: