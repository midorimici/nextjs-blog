---
title: "【Hugo】.TableOfContents が使えないけど目次を追加したいときの対処法"
date: 2020-03-09T12:48:03+09:00
lastmod: 2020-04-24T12:48:03+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo, HTML]
draft: false
---

{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}
には、記事内の h タグから自動で目次を出力してくれる機能があり、

通常は`.TableOfContents`で呼び出すことができます。

しかし、テーマによっては何らかの事情で`.TableOfContents`が使えない可能性があるので、

今回は Hugo のテンプレート文だけでがんばって実装してみたいと思います。

<!--more-->

<br>

## `.TableOfContents`の構造

HTML を見てみると、`.TableOfContents`が呼び出された部分は次のようになっています。

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

この場合、記事のマークダウンファイルは、

```md
## 見出し1
　
...
　
### 見出し2
　
...
　
### 見出し3
　
...
　
## 見出し4
　
...
```

となり、

HTML では

```html
<h2 id="#見出し1">見出し1</h2>
<p>...</p>
...
<h3 id="#見出し2">見出し2</h3>
<p>...</p>
...
<h3 id="#見出し3">見出し3</h3>
<p>...</p>
...
<h2 id="#見出し4">見出し4</h2>
<p>...</p>
...
```

となります。

ところで、記事の HTML は`.Content`で参照できるので、

記事の中から h タグを探して、それらをもとに目次を作ることができます。

{{< relpos add-toc >}}

<br>

## テンプレートのコーディング

目次を作成するテンプレートファイルを作りましょう。

目次の項目は h2 から始まることにします。

### h タグを検索する

記事内容は`.Content`で参照できますが、テーマ独自で何か改変が加えられていることもあります。

最終的な出力内容は、例えば`layouts/partials/post.html`などを確認してください。

`$Content`のようになっていれば、直前に`{{ $Content := .Scratch.Get "Content" }}`などと書かれていると思います。

<details><summary>:question:<code>.Scratch</code>って？</summary>
<br>

Hugo では変数は`{{ $var := value }}`のように定義できますが、`$`がつく形の変数はローカルにしか参照できません。

別のファイルに持ち込んだり、`range`や`with`などの関数の外部から参照することができないので、

このような場合には[`.Scratch`](https://gohugo.io/functions/scratch/)を使います。

`{{ .Scratch.Set "name" $inner_var }}`とすると、外部からも`{{ $outer_var := .Scratch.Get "name" }}`とすることで同じ値を呼び出すことができるようになります。

{{< relpos hugo-scratch >}}

</details>

<br>

ここでは、ある程度の処理が加えられた後の`.Content`のデータが`.Scratch.Get "Content"`で呼び出すことができ、それが最終的に出力されているものとして進めていきます。

```go-html-template {name="layouts/partials/custom/toc.html"}
{{- /* Content を呼び出す */ -}}
{{- $Content := .Scratch.Get "Content" -}}
```

次に[`findRE`](https://gohugo.io/functions/findre/)を使って h タグを探します。

```go-html-template {name="toc.html", hl_lines=["3-6"]}
{{- /* Content を呼び出す */ -}}
{{- $Content := .Scratch.Get "Content" -}}
{{- /* 検索に使用する正規表現パターン */ -}}
{{- $pattern := `<h[2-9] id="(.+?)".*?>((?:.|\n)*?)</h[2-9]>` -}}
{{- /* 正規表現により h タグを検索 */ -}}
{{- $headers := findRE $pattern $Content -}}
```

正規表現の部分について簡単に説明しておくと、

`[2-9]`は「2-9のうちのどれか一文字」を表し、`*?`は「前の文字の任意の0回以上の繰り返しで最短のもの」を表しています。

`.`は「改行以外の任意の一文字」、`\n`は「改行」を表します。

つまりここでは、id 属性以外の
{{% tooltip %}}属性((要素に設定を付加するもの<br><code>class="classname"</code>など{{% /tooltip %}}
の有無を問わずレベル2から9の h タグがマッチします。

`()`で囲った部分はグループ化され、後から`$1`、`$2`、…という形で参照することができますが、

`(?:)`で囲った部分は無視されます。

### h タグの要素を取り出す

`$headers`にはパターンにマッチした要素がリストとして渡されています。

それぞれの要素を取り出していきますが、ここで[`range`](https://gohugo.io/functions/range/)を使います。

```go-html-template {name="toc.html", hl_lines=["7-12"]}
{{- /* Content を呼び出す */ -}}
{{- $Content := .Scratch.Get "Content" -}}
{{- /* 検索に使用する正規表現パターン */ -}}
{{- $pattern := `<h[2-9] id="(.+?)".*?>((?:.|\n)*?)</h[2-9]>` -}}
{{- /* 正規表現により h タグを検索 */ -}}
{{- $headers := findRE $pattern $Content -}}
{{- range $headers -}}
    {{- /* ヘッダーへのリンクアドレス */ -}}
    {{- $id := . | replaceRE $pattern `$1` -}}
    {{- /* ヘッダー名 */ -}}
    {{- $header := . | replaceRE $pattern `$2` | safeHTML -}}
{{- end -}}
```

9行目の`.`というのは`$headers`の要素のうちのひとつを表しています（ここでは扱いませんが[`with`](https://gohugo.io/functions/with/)関数でも同じような省略が起こります）。

9行目は、「`$headers`内の各要素について、`$pattern`にマッチする部分をパターンの第一グループに置き換える」という意味になります。

第一グループというのは`$pattern`で id 属性の後に書いた`(.+?)`のことです。

つまり、この一連の処理によって、例えば

`<h2 id="ミダシ">見出し</h2>` → `$id`:`ミダシ`, `$header`:`見出し`

となって、`$id`と`$header`に格納されるわけですね。

[`safeHTML`](https://gohugo.io/functions/safehtml/)というのは HTML 文がエスケープされないようにするということです。

ところで、このままでは h2 タグと h3 タグは区別できていないので、

階層構造のある目次にはなりません。

### 階層を区別する

h タグの数字の部分を取り出しましょう。

正規表現の部分に修正を加えます。

そして新たに`$depth`に階層の深さの情報を入れます。

```go-html-template {name="toc.html", hl_lines=[4, "8-13"], inline_hl=[0:[6]]}
{{- /* Content を呼び出す */ -}}
{{- $Content := .Scratch.Get "Content" -}}
{{- /* 検索に使用する正規表現パターン */ -}}
{{- $pattern := `<h([2-9]) id="(.+?)".*?>((?:.|\n)*?)</h[2-9]>` -}}
{{- /* 正規表現により h タグを検索 */ -}}
{{- $headers := findRE $pattern $Content -}}
{{- range $headers -}}
    {{- /* ヘッダーの深さ */ -}}
    {{- $depth := . | replaceRE $pattern `$1` -}}
    {{- /* ヘッダーへのリンクアドレス */ -}}
    {{- $id := . | replaceRE $pattern `$2` -}}
    {{- /* ヘッダー名 */ -}}
    {{- $header := . | replaceRE $pattern `$3` | safeHTML -}}
{{- end -}}
```

かっこを後ろにつけて`...</h([2-9])>`としても大丈夫です。

さて、これで`.TableOfContents`をつくる準備は整いました。

あとはこれをもとに HTML を組んでいけばOKです。

{{< relpos hugo-findre-replacere >}}

<br>

## HTML のコーディング

さきほど示した[`.TableOfContents`の構造](#tableofcontentsの構造)をまねて、 HTML を書いていきます。

ここはもうパズルです笑

```go-html-template {name="toc.html"}
...
{{- /* ループで直前に調べたものの階層の深さ */ -}}
{{- $scratch := newScratch -}}
{{- $scratch.Set "prev_depth" 0 -}}
<nav id="TableOfContents">
    <ul>
        {{- range $headers -}}
            ...
            {{- $prev_depth := $scratch.Get "prev_depth" -}}
            {{- /* h2 のとき */ -}}
            {{- if eq $depth `2` -}}
                {{- /* 直前の h タグが h2 のとき */ -}}
                {{- if eq $prev_depth `2` -}}
                    </li>
                {{- /* 直前の h タグが h3 のとき */ -}}
                {{- else if eq $prev_depth `3` -}}
                    </ul></li>
                {{- end -}}
                <li><a href="#{{ $id }}">{{ $header }}</a>
            {{- /* h3 のとき */ -}}
            {{- else if eq $depth `3` -}}
                {{- /* 直前の h タグが h2 のとき */ -}}
                {{- if eq $prev_depth `2` -}}
                    <ul>
                {{- end -}}
                <li><a href="#{{ $id }}">{{ $header }}</a></li>
            {{- end -}}
            {{- $scratch.Set "prev_depth" $depth -}}
        {{- end -}}
        {{- $prev_depth := $scratch.Get "prev_depth" -}}
        {{- /* 直前の h タグが h2 のとき */ -}}
        {{- if eq $prev_depth `2` -}}
            </li>
        {{- /* 直前の h タグが h3 のとき */ -}}
        {{- else if eq $prev_depth `3` -}}
            </ul></li>
        {{- end -}}
    </ul>
</nav>
```

3行目の`newScratch`というのはローカルなスクラッチだそうです。

`.Scratch`を使うと範囲が広すぎて他のものと名前衝突を起こし上書きされてしまう危険性があるので、転ばぬ先の杖です。

[`eq`](https://gohugo.io/functions/eq/)は等号で、`eq a b`で`a == b`の意味です。

注意しなくてはならないのは、取得した数字は文字列なので、文字列として扱わなければ`if`にひっかからないということです。

このコードはループで直前に調べたものの階層の深さとループ中のものの階層の深さを利用して、

どこで何のタグをどれくらい開いたり閉じたりするかを指定しています。

h2 と h3 しか使わないよという人なら、これで十分です（といっても全部あわせると五十文あります…）。

もっといえば、さきほどの正規表現の`[2-9]`も`[23]`に書き換えてしまってOKです。

目次なら二階層もあれば大丈夫だと思うんですが、もし h4 も使いたいなら、脳内シミュレーションしつつ同じようにコーディングしていけばいいと思います。

<details><summary>コード全文（h2 h3 しか使わない場合）</summary>

```go-html-template {name="toc.html"}
{{- /* Content を呼び出す */ -}}
{{- $Content := .Scratch.Get "Content" -}}
{{- /* 検索に使用する正規表現パターン */ -}}
{{- $pattern := `<h([23]) id="(.+?)".*?>((?:.|\n)*?)</h[23]>` -}}
{{- /* 正規表現により h タグを検索 */ -}}
{{- $headers := findRE $pattern $Content -}}
{{- /* ループで直前に調べたものの階層の深さ */ -}}
{{- $scratch := newScratch -}}
{{- $scratch.Set "prev_depth" 0 -}}
<nav id="TableOfContents">
    <ul>
        {{- range $headers -}}
            {{- /* ヘッダーの深さ */ -}}
            {{- $depth := . | replaceRE $pattern `$1` -}}
            {{- /* ヘッダーへのリンクアドレス */ -}}
            {{- $id := . | replaceRE $pattern `$2` -}}
            {{- /* ヘッダー名 */ -}}
            {{- $header := . | replaceRE $pattern `$3` | safeHTML -}}
            {{- $prev_depth := $scratch.Get "prev_depth" -}}
            {{- /* h2 のとき */ -}}
            {{- if eq $depth `2` -}}
                {{- /* 直前の h タグが h2 のとき */ -}}
                {{- if eq $prev_depth `2` -}}
                    </li>
                {{- /* 直前の h タグが h3 のとき */ -}}
                {{- else if eq $prev_depth `3` -}}
                    </ul></li>
                {{- end -}}
                <li><a href="#{{ $id }}">{{ $header }}</a>
            {{- /* h3 のとき */ -}}
            {{- else if eq $depth `3` -}}
                {{- /* 直前の h タグが h2 のとき */ -}}
                {{- if eq $prev_depth `2` -}}
                    <ul>
                {{- end -}}
                <li><a href="#{{ $id }}">{{ $header }}</a></li>
            {{- end -}}
            {{- $scratch.Set "prev_depth" $depth -}}
        {{- end -}}
        {{- $prev_depth := $scratch.Get "prev_depth" -}}
        {{- /* 直前の h タグが h2 のとき */ -}}
        {{- if eq $prev_depth `2` -}}
            </li>
        {{- /* 直前の h タグが h3 のとき */ -}}
        {{- else if eq $prev_depth `3` -}}
            </ul></li>
        {{- end -}}
    </ul>
</nav>
```

</details>

{{< relpos blog-fukidashi >}}

---

これだけ（これ以上）のことをたった一行`.TableOfContents`でやってくれるのはありがたいですね笑

読んでくださりありがとうございました！

それでは～:wave: