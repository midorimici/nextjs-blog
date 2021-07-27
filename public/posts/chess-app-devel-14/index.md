---
title: 'チェスアプリ開発(14) フェアリー駒の作成'
date: 2020-06-07T12:00:00+09:00
lastmod: 2020-06-07T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 14 回です。

{{< pstlk 前々回 chess-app-devel-12 >}}までで通常のチェスが問題なくプレイできるようになり、

{{< pstlk 前回 chess-app-devel-13 >}}はコードを整形しました。

今回は、いよいよフェアリーチェスの幕開けです！

<br>

ところで、フェアリーチェスってなんでしたっけ？

<!--more-->

フェアリーチェスは、広く言えば**通常のチェスとは異なるルールのもとでプレイされるチェス**のことです。

つまり、**なんでもあり**なんです。

盤面が小さくても大きくても丸くても、駒の動きが弱くても強くても、なんでもありです。

とはいっても、盤面の大きさや駒の動きを変えることがほとんどです。

<br>

今回は手始めに、駒の動きを変えてしまいましょう。

<br>

## 駒の動きの定義

各駒の動きは、`pieces.py`にて定義されています。

例えば、ナイトとルークはこのようになっています。

```py {name="pieces.py"}
class Knight(Piece):
    abbr = 'N'

    def available_moves(self, x, y, gameboard):
        return [(xx, yy) for xx, yy in leaper(x, y, 2, 1) if self.no_conflict(gameboard, self.color, xx, yy)]


class Rook(Piece):
    abbr = 'R'

    def available_moves(self, x, y, gameboard):
        return self.rider(x, y, gameboard, self.color, chess_cardinals)
```

`available_moves`{{% tltp メソッド %}}オブジェクトに対して使用される処理のまとまり{{% /tltp %}}で駒の動きを定義しています。

返り値は２要素{{% tltp タプル %}}多数のデータを格納する、要素が変更不可能な構造{{% /tltp %}}のリストです。

<br>

これを少しいじってみましょう。

```py {name="pieces.py", hl_lines=[5, 12], inline_hl=[0:[19], 1:["15-27"]]}
class Knight(Piece):
    abbr = 'N'

    def available_moves(self, x, y, gameboard):
        return [(xx, yy) for xx, yy in leaper(x, y, 2, 3) if self.no_conflict(gameboard, self.color, xx, yy)]


class Rook(Piece):
    abbr = 'R'

    def available_moves(self, x, y, gameboard):
        return self.rider(x, y, gameboard, self.color, [(1, 2), (2, 1)])
```

すると、このような動きになりました。

{{< video src=change-moves opt=1 >}}

おわかりいただけただろうか…？笑

<br>

ナイトのほうは、横に２マス、縦に３マスいったところ（(2, 3)方向）に動けるようになりました。

もともとは横に２マス、縦に１マス（(2, 1)方向）でしたね。

１を３に変更したので、このような動きになりました。

`leaper`という関数によって、一方向を指定しただけでも８方向に広げてくれます。

<br>

ルークのほうは、(1, 2)方向と(2, 1)方向に直線的に走るようになりました。

こちらは`leaper`がないため、指定した２方向にしか動けず、

動画で動かしたもの以外の３つのルークは一歩も動けません。

しかし`rider`メソッドによって、ナイトとは違って走ることができます。

もともとは`chess_cardinals`で、これは`[(1, 0), (0, 1), (-1, 0), (0, -1)]`のことで、

この方向は十字方向です。

<br>

他の駒の動きも、この要領で変えていくことができるし、

自分で新しい駒を定義することもできます。

<br>

## 新しい駒の作成

試しに「ユニコーン」という駒を作成してみましょう。

この駒は、ナイトが走るように、つまりナイト方向に一直線に動きます。

他の駒{{% tltp クラス %}}オブジェクトの型、設計図のようなもの{{% /tltp %}}定義にならって、ユニコーンクラスを定義します。

```py {name="pieces.py"}
class Unicorn(Piece):
    abbr = 'Un'

    def available_moves(self, x, y, gameboard):
        return self.rider(x, y, gameboard, self.color, leaper(0, 0, 1, 2))
```

`rider`メソッドと`leaper`関数を組み合わせています。

ところで、それぞれの中身は次のようになっています。

```py {name="pieces.py"}
class Piece:
    ...
    def rider(self, x, y, gameboard, color, intervals):
        '''
        Parameters
        ----------
        x, y : int
            駒の絶対座標．
        gameboard : dict > {(int, int): obj, ...}
            盤面．
        color : str > 'W', 'B'
            駒色．
        intervals : list > [(int, int), ...]
            移動の方向．相対座標．

        Returns
        -------
        answers : list > [(int, int), ...]
            駒の可能な移動先．
        '''
        answers = []
        for xint, yint in intervals:
            # intervals 中の (xint, yint) 方向について
            # (xtemp, ytemp) : 盤面上の現在位置絶対座標 (x, y) から
            #   (xint, yint) 方向に動いたときの絶対座標
            xtemp, ytemp = x + xint, y + yint
            while self.is_in_bounds(xtemp, ytemp):
                # 盤面上に収まるとき
                # target : 盤面上の (xtemp, ytemp) の位置に駒があればその駒(obj).
                #   なければ None.
                target = gameboard.get((xtemp, ytemp), None)
                if target is None:
                    # 駒がないのでそのマスには動ける
                    answers.append((xtemp, ytemp))
                elif target.color != color:
                    # 相手の駒があるので取れる
                    answers.append((xtemp, ytemp))
                    # 駒にぶつかったので，これ以上進めない
                    break
                else:
                    # 自分の駒にぶつかったので，これ以上進めない
                    break

                # (xtemp, ytemp) から (xint, yint) 方向に一回動く
                xtemp, ytemp = xtemp + xint, ytemp + yint
        return answers
...
def leaper(x, y, int1, int2):
    '''
    Parameters
    ----------
    x, y : int
        駒の位置．
    int1, int2 : int
        駒の移動方向 (int1, int2).

    Returns
    -------
    list > [(int, int), ...]
        駒の可能な移動先．
    '''
    return [(x+int1, y+int2), (x-int1, y+int2), (x+int1, y-int2), (x-int1, y-int2),
        (x+int2, y+int1), (x-int2, y+int1), (x+int2, y-int1), (x-int2, y-int1)]
```

`leaper`の最初の２つの引数を`0`にしたのは、`rider`メソッドに渡すのは方向（相対座標）であって位置（絶対座標）ではないからです。

### 盤上に配置

さて、駒は作れたわけですが、このままではまだユニコーンが盤上に登場しません。

盤面に駒を置いているのは、`main.py`の`place_pieces`メソッドです。

```py {name="main.py"}
class Game:
    ...
    def place_pieces(self):
        for i in range(0, 8):
            self.gameboard[(i, 1)] = Pawn(W, 1)
            self.gameboard[(i, 6)] = Pawn(B, -1)

        placers = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]

        for i in range(0, 8):
            self.gameboard[(i, 0)] = placers[i](W)
            self.gameboard[(i, 7)] = placers[i](B)
```

この部分の詳細な説明は{{< pstlk 第２回 "chess-app-devel-2/#黒のクイーンとキングの位置" >}}でしましたが、

ざっくり言うと`gameboard`の特定の位置に特定の駒オブジェクトを配置しています。

とりあえず、次の行を追加します。

```py {name="main.py", hl_lines=[14]}
class Game:
    ...
    def place_pieces(self):
        for i in range(0, 8):
            self.gameboard[(i, 1)] = Pawn(W, 1)
            self.gameboard[(i, 6)] = Pawn(B, -1)

        placers = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]

        for i in range(0, 8):
            self.gameboard[(i, 0)] = placers[i](W)
            self.gameboard[(i, 7)] = placers[i](B)

        self.gameboard[(0, 2)] = Unicorn(W)
```

これで、a3 の位置に白のユニコーンが配置されるはずです。

<br>

あと、駒を表示するための画像も用意しなければなりません。

`/img/W/WUn.png`と`/img/B/BUn.png`を作成します。

画像は [Alfaerie Variant Chess Graphics](https://www.chessvariants.com/graphics.dir/alfaerie/index.html) をもとに作成しています。

<br>

それと、画像と ID の紐づけもしておきます。

```py {name="pieces.py", hl_lines=[1], inline_hl=[0:["14-15"]]}
piece_names = [Knight, Rook, Bishop, Queen, King, Pawn, Unicorn]

# 画像IDの割り当て
piece_ID = {}
for i, piece in enumerate(piece_names):
    piece_ID['W' + piece.abbr] = i + 1
    piece_ID['B' + piece.abbr] = -(i + 1)
```

これで動かしてみると、このようになりました。

{{< video src=unicorn opt=1 >}}

思った通りの動きになりました！

<br>

実際にはこんなところに駒を置くわけにもいかないので、

ナイトの代わりに置いたりするのですが、

その場合は次のように書きます。

```py {name="main.py", hl_lines=[8], inline_hl=[0:[15]]}
class Game:
    ...
    def place_pieces(self):
        for i in range(0, 8):
            self.gameboard[(i, 1)] = Pawn(W, 1)
            self.gameboard[(i, 6)] = Pawn(B, -1)

        placers = [Rook, Knight, Bishop, Queen, King, Bishop, Unicorn, Rook]

        for i in range(0, 8):
            self.gameboard[(i, 0)] = placers[i](W)
            self.gameboard[(i, 7)] = placers[i](B)
```

これで黒白双方のキングサイドのナイトがユニコーンに変わります。

{{< img src=unicorn-chess alt="ユニコーンチェス" >}}

これも一種のフェアリーチェスですね！

---

今回はフェアリー駒の導入をしました。

しかし、このままだと一種類のチェスしかできないので、

{{< pstlk 次回 chess-app-devel-15 >}}はさまざまな種類のゲームを切り替えられるようにします。

お読みいただきありがとうございました。

ではまた:wave: