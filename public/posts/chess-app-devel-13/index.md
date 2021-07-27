---
title: 'チェスアプリ開発(13) コードの整形'
date: 2020-05-11T12:00:00+09:00
lastmod: 2020-06-07T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 13 回です。

{{< pstlk 前回 chess-app-devel-12 >}}はチェスの特殊ルールのひとつ、キャスリングを実装しました。

これで通常のチェスは問題なくできるようになったので、今回はコードの整形をしていきます。

<!--more-->

<br>

## 駒クラスのコンストラクタの引数

<p>
現時点では、駒
{{% tooltip %}}インスタンス((クラスをもとに作られた分身のようなもの{{% /tooltip %}}
の生成時に色と名前を指定しています。
</p>

ところが、駒の名前（name）は駒の色の情報（color）と駒の省略表記（abbr）の組み合わせから成り立っています。

そのため、駒の名前を別個で定義する必要はありません。

```py {name="pieces.py", hl_lines=["2-4", 7, "13-15", 18], ins=[1, 3, 5, 7], del=[0, 2, 4, 6], inline_hl=[0:["6-7"], 4:["8-9"]]}
class Piece:
    def __init__(self, color, name):
    def __init__(self, color):
        self.name = name
        self.position = None
        self.color = color
        self.name = color + self.abbr
    ...
...

class Pawn(Piece):
    ...
    def __init__(self, color, name, direction):
    def __init__(self, color, direction):
        self.name = name
        self.color = color
        self.direction = direction
        self.name = color + self.abbr
    ...
```

これによって、駒インスタンス生成時の引数がひとつ減って、色だけになります。

<br>

## コードを圧縮

定義されてはいるものの明らかに使われていないコードがあるので削除します。

```py {name="pieces.py", hl_lines=["3-6", 8, 9, "14-17"], ins=[7], del=["0-6", "8-10"], inline_hl=[6:["10-13"]]}
class Piece:
    ...
    def is_valid(self, startpos, endpos, color, gameboard):
        if endpos in self.available_moves(startpos[0], startpos[1], gameboard, color=color):
            return True
        return False
    ...
    def available_moves(self, x, y, gameboard, color):
        print("ERROR: no movement for base class")
    ...
...

...
    def available_moves(self, x, y, gameboard, color=None):
    def available_moves(self, x, y, gameboard):
        if color is None:
            color = self.color
        ...
```

`available_moves()`は各駒のクラス内で定義されているので、親クラスの`Piece`内部で定義する必要はありません。

駒のクラス内で`available_moves()`を定義しなかった場合にこのコードが作動するのだと思いますが、それはすぐに気づくことだと思います。

あと、`available_moves()`の引数の`color`にはつねに`self.color`が使われているので、

引数にとる必要がないということで削除しています。

<br>

また、`is_valid()`は他には１箇所にしか使われていないので、`available_moves()`で代用してしまいます。

```py {name="main.py", hl_lines=[4, 5], ins=[1], del=[0]}
def can_see_king(self, kingpos, piecelist, gameboard):
    ...
    for piece, position in piecelist:
        if piece.is_valid(position, kingpos, piece.color, gameboard):
        if kingpos in piece.available_moves(*position, gameboard):
            return True
```

<br>

## 変数名・関数名の変更

変数名・関数名キャメルケースをスネークケースに変更し、一部はわかりやすい名前に変更します。

`knightList()`は`leaper()`にします。

（フェアリーチェスの世界では、ナイトのように駒を跳び越すことができる駒を leaper といいます。）

<br>

## 駒色の変数名

駒色はもともと、`WHITE = "W", BLACK = "B"`と変数として定義されていて、これが使われているのですが、

変数の名前は１文字にしてもよく、そのほうが簡単なので、これを変更します。

```py {name="pieces.py", hl_lines=["1-4", "10-13"], ins=[1, 3, 5, 7], del=[0, 2, 4, 6], inline_hl=[0:[0], 1:[0], 2:[0], 3:[0], 4:[6], 5:[6], 6:[6], 7:[6]]}
WHITE = "W"
W = "W"
BLACK = "B"
B = "B"
...
class Pawn(Piece):
    ...
    def available_moves(self, x, y, gameboard, color=None):
        ...
        if (((self.color == WHITE and y == 1)
        if (((self.color == W and y == 1)
            or (self.color == BLACK and y == 6))
            or (self.color == B and y == 6))
                and (x, y + 1*self.direction) not in gameboard
                and (x, y + 2*self.direction) not in gameboard):
            answers.append((x, y + 2*self.direction))
        ...
```

`main.py`でも変更を反映させます。

---

ちょっとしたことですが、開発のしやすさが変わってくると思います。

自分で０からやるなら、最初からある程度ルールをきめてコーディングをするといいのかもしれませんね。

{{< pstlk 次回 chess-app-devel-14 >}}はいよいよフェアリーチェスの実装に入っていきます！

お読みいただきありがとうございました。

ではまた:wave: