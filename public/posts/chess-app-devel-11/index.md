---
title: "チェスアプリ開発(11) プロモーションの実装"
date: 2020-05-06T12:00:00+09:00
lastmod: 2020-12-16T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, OpenGL, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第11回です。

{{< pstlk 前回 chess-app-devel-10 >}}はチェスの特殊ルールのひとつ、アンパッサンを実装しました。

今回はポーンが昇格して強くなるプロモーションを実装していきます。

<!--more-->

<br>

## プロモーションとは

promotion は英語で昇格という意味です。

ポーンが相手の陣地の最深部（白から見れば８ランク、黒から見れば１ランク）まで進むと、**ポーンとキングを除くいずれかの駒に変身します。**

どの駒になるかは選択可能ですので、

選択肢を表示して選んでもらう、ユーザとの双方向的なやりとりが必要となります。

<br>

動作のプロセスは次のようになります。

1. ポーンが最深部にたどり着く
1. どの駒にプロモーションするか選択肢を表示する
1. ユーザが駒を選択する
1. 選択された駒を認識する
1. ポーンが選択された駒に変化する

<br>

## プロモーションの条件を定義

まずはプロモーションの条件を定義します。

```py {name="main.py", hl_lines=[5, 19, "24-41"]}
class Game:
    def __init__(self):
        ...
        # プロモーションの条件を満たすか
        self.prom = False
        ...
    ...
　
    def main(self):
        ...
        if None not in startpos + endpos:
            try:
                target = self.gameboard[startpos]
            except:
                self.message = "could not find piece; index probably out of range"
                target = None
        ...
                        self.renew_gameboard(startpos, endpos, self.gameboard)
                        self.promotion(target, endpos)
                        if self.is_check(target.color, self.gameboard):
                            self.message = f"{target.color} player is in check"
    ...
　
    def promotion(self, piece, endpos):
        '''
        プロモーションできるとき，True

        Parameters
        ----------
        piece : obj
            駒．
        endpos : tuple > (int, int)
            終了位置．
        
        Returns
        -------
        bool
        '''
        if (piece.name == 'WP' and endpos[1] == 7
                or piece.name == 'BP' and endpos[1] == 0):
            self.prom = True
```

動くたびにプロモーションができる状態かどうかを判定し、その結果を変数に入れて管理します。

<br>

## 選択肢を表示する吹き出しを描画

プロモーションするポーンから吹き出しをのばして、その吹き出しの中に選択肢となる駒を描画することにします。

`glVertex()`で指定しているのはワールド座標であり、このプログラムでは縦横軸ともに -1.0 ～ 8.0 の値をとるように調整しています（{{< pstlk 第６回 "chess-app-devel-6/#四角形の描画" >}}）。

```py {name="utils.py"}
def draw_balloon(x, y):
    '''
    プロモーションのときの吹き出しを描画する
    
    Parameters
    ----------
    x, y : int
        駒の座標．
    '''
    glColor(0.5, 0.5, 0.5)  # 色の指定
    glBegin(GL_QUADS)       # 四角形を描画
    glVertex(1.0, 2.5)
    glVertex(1.0, 4.5)
    glVertex(6.0, 4.5)
    glVertex(6.0, 2.5)
    glEnd()
    glBegin(GL_TRIANGLES)   # 三角形を描画
    glVertex(3.0, 3.5)
    glVertex(4.0, 3.5)
    glVertex(x, y)
    glEnd()
```

プロモーションできる状態にある、すなわちさきほど設定した変数`self.prom`が`True`となるときに、この吹き出しを描画させます。

```py {name="main.py", hl_lines=["9-11"]}
def draw(self):
    ...
    # 可能な移動先の表示
    if self.select_dest and None not in self.startpos:
        piece = self.gameboard[self.startpos]
        draw_available_moves(
            self.valid_moves(piece, self.startpos, self.gameboard),
            opponent=self.playersturn != piece.color)
    # プロモーション
    if self.prom:
        draw_balloon(*self.endpos)
    glDisable(GL_BLEND)
    glutSwapBuffers()
```

ここでいったん動作を見てみましょう。

{{< img src=fukidashi ext=gif alt="プロモーション 吹き出し" width=300 >}}

選択肢として４つの駒をこの吹き出しの上に並べて乗せることになります。

駒の描画は`draw_img()`を使えばできます（定義は{{< pstlk 第７回 "chess-app-devel-7/#テクスチャの設定" >}}にて）。

```py {name="main.py", hl_lines=["6-12"]}
def draw(self):
    ...
    # プロモーション
    if self.prom:
        draw_balloon(*self.endpos)
        piece_color = self.gameboard[self.endpos].color
        glEnable(GL_TEXTURE_2D)
        draw_img(2.0, 3.5, piece_ID[piece_color + 'N'])
        draw_img(3.0, 3.5, piece_ID[piece_color + 'B'])
        draw_img(4.0, 3.5, piece_ID[piece_color + 'R'])
        draw_img(5.0, 3.5, piece_ID[piece_color + 'Q'])
        glDisable(GL_TEXTURE_2D)
    ...
```

ちなみに、`piece_color`はこの時点では`white`か`black`になってしまうので、エラーになってしまいます。

駒色の文字列を変更します。

```py {name="pieces.py", hl_lines=["1-4"], ins=[1, 3], del=[0, 2], inline_hl=[0:["3-5"], 1:["3-5"], 2:["3-5"], 3:["3-5"]]}
WHITE = "white"
WHITE = "W"
BLACK = "black"
BLACK = "B"
```


これで選択肢を表示することができました。

{{< img src=fukidashi_sentakushi alt="プロモーション 吹き出し 駒あり" width=300 >}}

<br>

## 選択された駒を認識

どれがクリックされたのかを認識させます。

特定の範囲内をクリックしたときに`True`となるような関数を作ります。

```py {name="utils.py"}
def on_square(x, y, left, right, bottom, top):
    '''
    left < x < right かつ bottom < y < top のとき，True
    
    Parameters
    ----------
    x, y : float
        測定する座標．
    left, right, bottom, top : float
        ボタンの左右下上端の座標．

    Returns
    -------
    bool
    '''
    if left < x < right and bottom < y < top:
        return True
```

これを使って、マウスでクリックした位置をもとに、どの駒が選択されたか認識し、

<p>
選択された駒の
{{% tooltip %}}インスタンス((クラスをもとに作られた分身のようなもの{{% /tooltip %}}
を生成してポーンと置き換えます。
</p>

```py {name="main.py", hl_lines=[7, "9-23"]}
def mouse(self, button, state, x, y):
    ...
    self.mousepos = window2world(x, y, WSIZE)
    ...
                 # 駒選択
                 elif (self.parse_mouse() in self.gameboard
                        and not self.prom):
    ...
        # プロモーション
        if self.prom:
            piece_color = self.gameboard[self.endpos].color
            if on_square(*self.mousepos, 1.5, 2.5, 3.0, 4.0):
                self.gameboard[self.endpos] = Knight(piece_color, piece_color + 'N')
                self.prom = False
            if on_square(*self.mousepos, 2.5, 3.5, 3.0, 4.0):
                self.gameboard[self.endpos] = Bishop(piece_color, piece_color + 'B')
                self.prom = False
            if on_square(*self.mousepos, 3.5, 4.5, 3.0, 4.0):
                self.gameboard[self.endpos] = Rook(piece_color, piece_color + 'R')
                self.prom = False
            if on_square(*self.mousepos, 4.5, 5.5, 3.0, 4.0):
                self.gameboard[self.endpos] = Queen(piece_color, piece_color + 'Q')
                self.prom = False
```

これでプロモーションが実装できました！

{{< img src=promotion ext=gif alt="プロモーション 完成" width=300 >}}

今回の変更も GitHub に置いておきます。

→ [Release codes after 11 articles · midorimici/chess-program-for-python-and-OpenGL](https://github.com/midorimici/chess-program-for-python-and-OpenGL/releases/tag/v.1.1)

---

{{< pstlk 次回 chess-app-devel-12 >}}はついに最後の特殊ルール、キャスリングを実装していきます。

お読みいただきありがとうございました。

ではまた:wave: