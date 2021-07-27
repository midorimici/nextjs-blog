---
title: "チェスアプリ開発(3) ポーンの最初の動きを追加"
date: 2020-02-15T21:07:50+09:00
lastmod: 2020-04-24T12:07:50+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
summary: "Python プログラムで動かすフェアリーチェスアプリ開発、連載第3回です。

前回は、先手の駒色と駒の初期配置を修正しました。

今回は、ポーンの最初の動きを付け加えてみましょう。

本来ポーンは、最初の動きだけは2歩まで進むことができます。"
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第3回です。

{{< pstlk 前回 chess-app-devel-2 >}}は、先手の駒色と駒の初期配置を修正しました。

今回は、ポーンの最初の動きを付け加えてみましょう。

本来ポーンは、最初の動きだけは2歩まで進むことができます。
<!--more-->
<br>

## 駒に関するクラス

まず、`Pawn`{{% tooltip %}}クラス((オブジェクトの型、設計図のようなもの{{% /tooltip %}}
を見ると、`class Pawn(Piece):`とあります。

これは`Piece`クラスを継承していることがわかります。

クラスを定義するとき、()内に書かれたものが基底クラス（親クラス）になります。

継承をすると、基底クラスで定義された
{{% tooltip %}}プロパティ((オブジェクトが参照できるデータ{{% /tooltip %}}や
{{% tooltip %}}メソッド((オブジェクトが参照できる処理{{% /tooltip %}}
を子クラスでも使うことができます。

あと、子クラスから生成された
{{% tooltip %}}インスタンス((クラスをもとに作られた分身のようなもの{{% /tooltip %}}
から基底クラスの属性やメソッドにアクセスできるようになります。

---

それでは、`Pawn`の中身を見ていきましょう。（下は原文ママ）

```py:pieces.py
class Pawn(Piece):
    def __init__(self,color,name,direction):
        self.name = name
        self.Color = color
        #of course, the smallest piece is the hardest to code. direction should be either 1 or -1, should be -1 if the pawn is traveling "backwards"
        self.direction = direction
    def availableMoves(self,x,y,gameboard, Color = None):
        if Color is None : Color = self.Color
        answers = []
        if (x+1,y+self.direction) in gameboard and self.noConflict(gameboard, Color, x+1, y+self.direction) : answers.append((x+1,y+self.direction))
        if (x-1,y+self.direction) in gameboard and self.noConflict(gameboard, Color, x-1, y+self.direction) : answers.append((x-1,y+self.direction))
        if (x,y+self.direction) not in gameboard and Color == self.Color : answers.append((x,y+self.direction))# the condition after the and is to make sure the non-capturing movement (the only fucking one in the game) is not used in the calculation of checkmate
        return answers
```

<br>

## `__init__()` がある

他の駒にはないのに`Pawn`にだけ
{{% tooltip %}}コンストラクタ((インスタンス生成時に自動的に実行される初期化メソッド{{% /tooltip %}}
`__init__()`があります。

これは`Pawn`にだけ`direction`というプロパティをつける必要があったからでしょう。

他の駒は前後対称な動きをするけど、ポーンだけは前後が決まっています。

`direction`には`1`を指定すれば白から見て前方向、`-1`を指定すれば後方向ですね。

<br>

## ポーンの特殊な動きを再現

ポーンはちょっと特殊な動きをします。

動き始めだけは2歩まで進めるということの他にも、

<strong>進むときは前に１歩しか動けないが、敵駒を取るときにのみ斜め前に１歩進める（斜め前の駒を取れる）</strong>のです。

次の`availableMoves()`は盤面上の`(x, y)`の位置にいる駒の動けるマスを出力します。

<details>
<summary>:question:なぜわかる？</summary>
<br>
これは例えば、

> その駒が本来動けない場所への移動を指定したときに`invalid move`とプリントされる<br>
> → `Game`クラスの`main()`の中の`if target.isValid(startpos,endpos,target.Color,self.gameboard):`にかからなかった<br>
> → `target.isValid(startpos,endpos,target.Color,self.gameboard)`は`False`<br>
> → `Piece`クラスの`isValid(self,startpos,endpos,Color,gameboard)`が`endpos in self.availableMoves(startpos[0],startpos[1],gameboard, Color = Color)`ならば`True`を返す<br>
> → `availableMoves()`は移動可能なマスの位置を表している

というふうにしてわかります。

</details>

<br>

以下のコードは原文を少し整形しています。

```py:pieces.py
def availableMoves(self, x, y, gameboard, Color=None):
    if Color is None:
        Color = self.Color
    answers = []
    if ((x + 1, y + self.direction) in gameboard
            and self.noConflict(gameboard, Color, x + 1, y + self.direction)):
        answers.append((x + 1, y + self.direction))
    if ((x - 1, y + self.direction) in gameboard
            and self.noConflict(gameboard, Color, x - 1, y + self.direction)):
        answers.append((x - 1, y + self.direction))
    if (x, y + self.direction) not in gameboard and Color == self.Color:
        answers.append((x, y + self.direction))
    return answers
```

### `if Color is None:`

最初のこのif文は、`Color`が特に指定されなかったときのための受け皿みたいなものなので、ここではあまり重要ではありません。

### `answers`

`answers`に移動可能なマスを二要素
{{% tooltip %}}タプル((多数のデータを格納する、要素が変更不可能な構造{{% /tooltip %}}
として格納し、リストを作っています。

最終的には`[(int, int), ...]`という形になります。（`int`は整数という意味）

### `if ... in gameboard and self.noConflict ...`

ここの3つのif文がこの部分の勘所です。

最初の2文は、ポーンの攻撃を表しています。

ポーンは敵駒を取るときにのみ斜め前に１歩進めます。

もし自分の斜め前に駒があり（`... in gameboard`）、その駒が自分と異なる色である（`self.noConflict(...)`）とき、そのマスに移動可能になりますよ～ということです。

`noConflict()`は`Piece`クラスで定義されていて、中身はこんな感じです。

```py:pieces.py
def noConflict(self, gameboard, initialColor, x, y):
    if (self.isInBounds(x, y)
            and ((x, y) not in gameboard
                or gameboard[(x, y)].Color != initialColor)):
        return True
    return False
```

`isInBounds()`は`(x, y)`が盤面の範囲内にあるとき`True`を返すものなので、

`noConflict()`は`(x, y)`が盤面の範囲内にあって味方の駒がない（駒がないもしくは敵の駒がある）マスであるときに`True`となります。

そこには駒が進出可能ということですね。

### `if (x, y + self.direction) not in gameboard and Color == self.Color:`

目の前に駒がなければ（`if (x, y + self.direction) not in gameboard`）、１歩前に移動できますよ～ということです。

`Color == self.Color`の部分ですが、

コメントでは、駒を取らない動きがチェックメイトの計算に使われないことを保証するため、と書かれています。

たぶん、キングが相手のポーンの目の前に移動すると、そのマスにポーンが移動できるためチェックと判定されるのを防ごうとしているのかなと思いますが、

すでに`(x, y + self.direction) not in gameboard`を通っているので、この部分はなくていいんじゃないかなと思います。

そもそも、コード内で`Color != self.Color`になることがないので…

<br>

## 最初の動きを追加

さて、駒の動きの仕組みを理解したところで、最初の動きだけは２歩まで動けるという動きを追加していきます。

**最初だけは**というのがちょっと難しいかもしれないです。

まずは、駒がないマスならば前２歩まで進めることを表現してみましょう。

```py:pieces.py {hl_lines=["13-15"]}
def availableMoves(self, x, y, gameboard, Color=None):
    if Color is None:
        Color = self.Color
    answers = []
    if ((x + 1, y + self.direction) in gameboard
            and self.noConflict(gameboard, Color, x + 1, y + self.direction)):
        answers.append((x + 1, y + self.direction))
    if ((x - 1, y + self.direction) in gameboard
            and self.noConflict(gameboard, Color, x - 1, y + self.direction)):
        answers.append((x - 1, y + self.direction))
    if (x, y + self.direction) not in gameboard:
        answers.append((x, y + self.direction))
    if ((x, y + self.direction) not in gameboard
            and (x, y + 2*self.direction) not in gameboard):
        answers.append((x, y + 2*self.direction))
    return answers
```

ポイントは**2マス先に駒がなくても1マス先に駒があれば通れない**ということです。

さて、最初の動きだけ、という条件をつけていくのですが、

それぞれのポーンにとって最初の動きに特有の環境というものがあります。

初期位置です。

{{< img src=img1 alt=初期配置 width=300 >}}

通常のチェスの場合、白ポーンは初めて動くとき**必ず2ランクにいて**、

2ランクにいるのは**いつでもまだ動いていないとき**です。

この位置情報を条件として付与すればよさそうです。

```py:pieces.py {hl_lines=["13-14"]}
def availableMoves(self, x, y, gameboard, Color=None):
    if Color is None:
        Color = self.Color
    answers = []
    if ((x + 1, y + self.direction) in gameboard
            and self.noConflict(gameboard, Color, x + 1, y + self.direction)):
        answers.append((x + 1, y + self.direction))
    if ((x - 1, y + self.direction) in gameboard
            and self.noConflict(gameboard, Color, x - 1, y + self.direction)):
        answers.append((x - 1, y + self.direction))
    if (x, y + self.direction) not in gameboard:
        answers.append((x, y + self.direction))
    if (((self.Color == WHITE and y == 1)
                or (self.Color == BLACK and y == 6))
            and (x, y + self.direction) not in gameboard
            and (x, y + 2*self.direction) not in gameboard):
        answers.append((x, y + 2*self.direction))
    return answers
```

`(x, y)`の形では`0`からのスタートになるので、

2ランクは`y == 1`となります。

{{< img src=img2 alt=コマンドライン >}}

ちゃんと2歩動きました！

{{< img src=img3 alt=コマンドライン >}}

最初だけ！

ただ、このやり方は通常のチェスであったから通用しただけであって、

今後フェアリーチェスへの拡張を考えると、もっと柔軟な対応が必要になるのですが、

そのへんはまた今度にしましょう。

---

今回は駒に動きを追加しました。

{{< pstlk 次回 chess-app-devel-4 >}}はチェックまわりについて見ていきたいと思います。

長くなってしまいましたが、お読みいただきありがとうございました！

それではまた👋