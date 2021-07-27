---
title: "【VS Code】超便利！<br>Snippets の使い方"
date: 2020-05-15T12:00:00+09:00
lastmod: 2020-05-15T12:00:00+09:00
categories: [プログラミング, プログラミング一般]
tags: [プログラミング, ツール]
draft: false
---

コードエディタ VS Code（Visual Studio Code）では、Snippets（スニペット）という機能があります。

何度も重複して出てくる同じようなコードを、呼び出すための合言葉やキーボードショートカットを使って簡単に入力できるようになります。

今回は、

- Snippets の基本的な使い方
- User Snippets を定義する方法
- User Snippets をキーボードショートカットで呼び出す方法

についてお話します。

<!--more-->

<br>

## Snippets の基本的な使い方

Snippets は、prefix（合言葉のようなもの）が入力されそうになったときにサジェストに出現し、

それを選択すると、定義しておいた Snippets が展開されます。

{{< img src=vscode-snippet ext=gif alt="VS Code Snippet" >}}

VS Code のマーケットプレイスの拡張機能（extensions）には、Snippets を使用したものがたくさんあります。

しかし、拡張子ごとに User Snippets として自分で好きなように定義することもできます。

{{< relpos engineer-typing-renshu >}}

<br>

## User Snippets を定義する方法

[最後の動画](#vscode-user-snippets-video)の前半で、User Snippets を設定する手順を示しています。

まず、File > Preferences > User Snippets または左下の歯車マークから User Snippets を選択します。

次に、どの拡張子ファイルで使用するかを選択します。

２回目以降は`ctrl+p`を押してから直接`html.json`などと打ち込んでもOK。

New Global Snippets file を選択すると、すべての拡張子ファイルで適用できる Snippets を定義できます。

Snippets ファイルは JSON 形式で書かれます。

次のコードは書き方の例です。（[公式サイト](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_create-your-own-snippets)より）

```json
{
  "For Loop": {
    "prefix": ["for", "for-const"],
    "body": ["for (const ${2:element} of ${1:array}) {", "\t$0", "}"],
    "description": "A for loop."
  }
}
```

`"For Loop"` の部分は、Snippet の名前です。

: <br>

: 後述のキーボードショートカットを指定するときに使います。

`"prefix"`は Snippet を呼び出すための合言葉です。

: <br>

: この例の場合"fc"と打っても表示されるようです。

`"body"`は展開されたときに実際に出力される部分です。

: <br>

: 配列で指定します。

**`"description"`はサジェストに説明文として表示される部分です。**

### プレースホルダ

上の例で、`${1:array}`や`$0`というのがありますが、これをプレースホルダといいます。

Snippet が展開された後、カーソルは`$1`が書かれた位置に現れます。

次に Tab キーを押すと`$2`の位置にカーソルが移ります。

このように順番にカーソルが移っていきます。

`$0`は最後のカーソル位置を指定します。

`${1:array}`のように、デフォルト値を指定したり、

`${1|one,two,three|}`のように選択形式にすることもできます。

{{< img src=snippet-placeholder ext=gif alt="VS Code Snippet プレースホルダ" >}}

ちなみに、プレースホルダに同じ数字を複数の箇所で指定すると、マルチカーソルになり、同時に編集できます。

`${1:a-${2:b}}`のようにネストさせることもできます。

### 変数

選択範囲やカーソルが乗っている単語や行、行数、開いているファイル名、クリップボードの値など、

さまざまな値を変数として使うことができます。

日付や時間に関する変数や、コメントのコードを出力する変数もあります。

使用できる変数は[公式サイトのページ](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_variables)にまとめられています。

### 正規表現による置換

プレースホルダや変数を JavaScript の正規表現を使って置換することもできます。

例えば、`${TM_SELECTED_TEXT/[\n ]//g}`は、

選択範囲にあるすべての改行と空白を削除します。

`/`が３つありますが、１つ目と２つ目の間に正規表現のパターン、

２つ目と３つ目の間にそのパターンに一致した部分の置換先（`$1`のようにグループの指定可）、

３つ目の後ろに修飾子を指定します。

２つ目に`${1:/upcase}`と書くと、１つ目のパターンのマッチ部分を大文字化しますし、

`${1:?yes:no}`のように書くと、１つ目のパターンのマッチがあるかないかで条件分岐もできます。

このへんも[公式サイトのページ](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_grammar)が詳しいです。

プレースホルダの部分は、タブで次のプレースホルダに移ったときに置換されます。

{{< relpos forestry-otameshi >}}

<br>

## User Snippets をキーボードショートカットで呼び出す方法

独自に定義したキーボードショートカットを使って Snippets を呼び出すこともできます。

まず、`keybindings.json`ファイルを開きます。

File > Preferences > Keyboard Shortcuts または左下の歯車マークから Keyboard Shortcuts を選択します。

次に右上のアイコン"Open Keyboard Shortcuts (JSON)"から`keybindings.json`ファイルを開きます。

２回目以降は`ctrl+p`を押してから直接`keybindings.json`と打ち込んでも大丈夫です。

次に、このファイル内に例えば次のように記述します。

```json
{
  "key": "ctrl+k 1",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus",
  "args": {
    "snippet": "console.log($0)"
  }
}
```

`"key"`の部分に割り当てたいキー操作を指定します。

: <br>

: ２回のキー操作の組み合わせを指定することもでき、例では`ctrl+k`を押した直後に`1`を押すということを表しています。

`"command"`には実行するコマンドを指定します。

: <br>

: Snippet の呼び出しなら`"editor.action.insertSnippet"`と書きます。

`"when"`は実行条件です。

: <br>

: `"editorTextFocus"`なら、エディタ内のテキストにフォーカスしている（カーソルが点滅している）状態になります。

: `"when"`に指定できる値に関して、詳しくは[こちら](https://code.visualstudio.com/docs/getstarted/keybindings#_contexts)。

`"args"`の中の`"snippet"`に展開する snippet を指定します。

: <br>

: 簡単な snippet ならこちらに登録してもいいかもしれません。

拡張子ごとのファイルの中で定義した snippet を呼び出すときは、`"args"`の中身を次のようにします。

```json {hl_lines=[6, 7]}
{
  "key": "ctrl+k 1",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus",
  "args": {
    "langId": "javascript",
    "name": "For Loop"
  }
}
```

**`"langId"`に snippet を定義した JSON ファイルの名前を、**

**`"name"`にそこで定義した snippet の名前を指定します。**

キーボードショートカットの設定例は下の動画の後半（1:00～）に示しています。

<video id="vscode-user-snippets-video" controls src="vscode-user-snippets.mp4"></video>

---

使いこなせるようになると開発効率がぐんと上がりますので、ぜひ試してみてください。

お役に立てたなら幸いです。

では:wave: