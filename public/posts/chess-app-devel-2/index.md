---
title: "チェスアプリ開発(2) コードの修正"
date: 2020-02-13T20:33:42+09:00
lastmod: 2020-04-24T12:33:42+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
summary: "Python プログラムで動かすフェアリーチェスアプリ開発、連載第2回です。
今回は実際にコードを修正しつつ、細かい動作についてみていきたいと思います！
なお、このシリーズでは、あまりプログラミングに詳しくない人、はじめたばかりの人にも気軽に読んでもらいたいので、できるだけ初歩的なところから解説していきたいと思っています。"
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第2回です。

{{< pstlk 前回 chess-app-devel-1 >}}は、既存のチェスのプログラムがどのように動いているか大枠を見てみました。

[こちらのプログラム](https://gist.github.com/rsheldiii/2993225)です。

今回は実際にコードを修正しつつ、細かい動作についてみていきたいと思います！

なお、このシリーズでは、あまりプログラミングに詳しくない人、はじめたばかりの人にも気軽に読んでもらいたいので、
<!--more-->
できるだけ初歩的なところから解説していきたいと思っています。

ただ、基礎理論などは書かれているサイトがたくさんあるので、ここでは応用的な面を重視して書いていきます。

<br>

## その前に

まず編集しやすくするために、コードを2つの{{% tooltip %}}モジュール((import によって呼び出すことができるプログラムファイル{{% /tooltip %}}に分けます。


```py:main.py
from pieces import *
　
uniDict = ...
　
class Game:
    ...
　
Game()
```


```py:pieces.py
WHITE = "white"
BLACK = "black"
　
class Piece:
    ...
```

ところで、このコード中にある`class`とか`def`は
{{% tooltip %}}クラス((オブジェクトの型、設計図のようなもの{{% /tooltip %}}や
{{% tooltip %}}メソッド((クラス内で定義される関数のようなもの{{% /tooltip %}}や
{{% tooltip %}}関数((処理のまとまり{{% /tooltip %}}を定義しているだけで、実際に動作を起こすわけではありません。

例えば、次のコードを走らせても見た目上は何も起きません。

```python
def f():
    print('abc')
```

しかし、これのあとに`f()`と書けば、コマンドラインに`abc`とプリントされます。

では、このチェスのコードにおいて一番最初に動き出すのはどこかというと、

一番最後の行の`Game()`です。

これによって`Game`のインスタンス（クラスをもとに作られた分身のようなもの）が生成され、

その際にコンストラクタ`__init__()`が呼び出されます。

コンストラクタは初期化メソッドで、インスタンス生成時に自動で実行されます。

```python:main.py
class Game:
    def __init__(self):
        self.playersturn = BLACK
        self.message = "this is where prompts will go"
        self.gameboard = {}
        self.placePieces()
        print("chess program. enter moves in algebraic notation separated by space")
        self.main()
　
    ...
```

次に、コンストラクタの中で`main()`が呼びだされます。

（`self`がついてたりついてなかったりするのは、初期の段階ではあまり気にしなくて大丈夫です！おまじないみたいなものだと思ってください）

```python:main.py
    ...
　
    def main(self):
　
        while True:
            self.printBoard()
            print(self.message)
            self.message = ""
            startpos,endpos = self.parseInput()
            ...
```

この`main()`の中で、盤面やメッセージを表示したり、ユーザ入力を受け付けたりしているわけです。

そしてこのメソッド内で使うためにいろいろなメソッドが他の場所で定義されています。

それでは、ここからは実際にコードを修正していきましょう。

<br>

## 黒先→白先

チェスでは白が先手です。まずはこちらを修正したいと思います。

`Game`中の`self.playersturn`がにおいますね。

```python:main.py {hl_lines=[5]}
...
　
class Game:
    def __init__(self):
        self.playersturn = BLACK
        self.message = "this is where prompts will go"
        self.gameboard = {}
        self.placePieces()
        print("chess program. enter moves in algebraic notation separated by space")
        self.main()
    ...
```

ここの`self.playersturn = BLACK`を`self.playersturn = WHITE`に変えればよさそうです。

{{< img src=img1 alt=コマンドライン >}}

できた！

<br>

## 黒のクイーンとキングの位置

本来初期配置では d8 にクイーン、 e8 にキングが来るはずです。

駒の配置に問題があるので、名前だけ見ると`placePieces()`が怪しいですね。

```python:main.py {hl_lines=["6-8"]}
class Game:
    ...
　
    def placePieces(self):
　
        for i in range(0,8):
            self.gameboard[(i,1)] = Pawn(WHITE,uniDict[WHITE][Pawn],1)
            self.gameboard[(i,6)] = Pawn(BLACK,uniDict[BLACK][Pawn],-1)
　
        placers = [Rook,Knight,Bishop,Queen,King,Bishop,Knight,Rook]
　
        for i in range(0,8):
            self.gameboard[(i,0)] = placers[i](WHITE,uniDict[WHITE][placers[i]])
            self.gameboard[((7-i),7)] = placers[i](BLACK,uniDict[BLACK][placers[i]])
        placers.reverse()
...
　
uniDict = {WHITE : {Pawn : "♙", Rook : "♖", Knight : "♘", Bishop : "♗", King : "♔", Queen : "♕" },
    BLACK : {Pawn : "♟", Rook : "♜", Knight : "♞", Bishop : "♝", King : "♚", Queen : "♛" }}
```

なんだか難しそうですが、ちょっとずつ見ていきましょう。

`gameboard`は、コンストラクタで`self.gameboard = {}`とされているので、
{{% tooltip %}}辞書（ディクショナリ）((キーと値が1対1に対応する形でまとめられた構造{{% /tooltip %}}
です。

`self.gameboard = {}`は、空のディクショナリをつくる文です。

6～8行目を見ると、`gameboard`は二要素
{{% tooltip %}}タプル((多数のデータを格納する、要素が変更不可能な構造{{% /tooltip %}}を
{{% tooltip %}}キーkey((呼び出すほう{{% /tooltip %}}、
駒オブジェクトを
{{% tooltip %}}値value((呼び出されるほう{{% /tooltip %}}
とするディクショナリだとわかります。

`Pawn(WHITE,uniDict[WHITE][Pawn],1)`は、`Pawn`の
{{% tooltip %}}インスタンス((クラスをもとに作られた分身のようなもの{{% /tooltip %}}
を生成しています。

確か、コードの下の方に`Pawn`クラスがありましたね。

```python:pieces.py
class Pawn(Piece):
    def __init__(self,color,name,direction):
        self.name = name
        self.Color = color
        #of course, the smallest piece is the hardest to code. direction should be either 1 or -1, should be -1 if the pawn is traveling "backwards"
        self.direction = direction
```

`color`は駒の色。

`name`は名前ですが、`uniDict`で絵文字が指定されることになります。

`direction`はポーンが進む方向ですね。（コメントは原文ママ。）

要は、7行目は「盤面のこの位置には白のポーンを置きますよ」と言っているだけです。

8行目も同様。

ということで、6～8行目は、「2ランクに白ポーン、7ランクに黒ポーンを配置」という意味になります。

さて、以降はこれを拡張しただけです。

```python:main.py
placers = [Rook,Knight,Bishop,Queen,King,Bishop,Knight,Rook]
　
for i in range(0,8):
    self.gameboard[(i,0)] = placers[i](WHITE,uniDict[WHITE][placers[i]])
    self.gameboard[((7-i),7)] = placers[i](BLACK,uniDict[BLACK][placers[i]])
```

（行数を改めます。）

4行目では、例えば`i`が`0`のとき、

`(0, 0)`（a1）の位置に`placers[0]`すなわち`Rook`が置かれます。

`uniDict[WHITE][placers[0]]`は`♖`になりますね。

さて、問題は5行目です。

例えば`i`が`0`のとき、

`(7, 7)`の位置に駒が置かれます。

これでは黒の駒と白の駒が盤面の中心に関して点対称に配置されていくのがわかりますでしょうか？

`i`が`3`のとき、`placers[3]`は`Queen`ですが、

白クイーンは`(3, 0)`に置かれ、黒クイーンは`(4, 7)`に置かれますね。

本当は`(3, 7)`に置きたい。

点対称ではなく、線対称に配置したいのです。

ということで、5行目の`((7-i),7)`を、`(i, 7)`に変えてしまいましょう！

{{< img src=img2 alt=コマンドライン >}}

やったね！

（ところで、メソッドの最後にあった`placers.reverse()`は何がしたいのかよくわかりません。）

---

今回は比較的簡単に直せるところを直してみました。

他にもいろいろと追加すべき機能はありますが、ひとつずつ取り上げていこうと思います！

次回は{{< pstlk こちら chess-app-devel-3 >}}

ご覧いただきありがとうございました。

それではまた:wave: