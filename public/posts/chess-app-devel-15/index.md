---
title: "チェスアプリ開発(15) ゲームの切り替え"
date: 2020-09-04T12:00:00+09:00
lastmod: 2020-09-26T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 15 回です。

{{< pstlk 前回 chess-app-devel-14 >}}はフェアリー駒を作成しました。

今回はさまざまな種類のフェアリーチェスを切り替えられるようにしていきます。

<!--more-->

現在の状態では、スクリプトを起動するとすぐに盤面が表示されて遊べる状態になりますが、

この前にいったんゲーム種類を選択する画面を入れます。

<br>

選択画面では５行２列、１ページで10種類のゲームを並べることにします。

画面で特定のボタンを押すと、対応するゲームの盤面がセットされてゲームがスタートするようにします。

そのためには、押したボタンによってセットする盤面や駒を変化させることになります。

<br>

## ゲームを定義する

ゲームによって変化するのは、盤面のサイズ、キャスリングの有無、ポーンのプロモーション先、

どの駒がどこに置かれているのかや、画像IDと駒の対応の情報です。

<br>

これらを定義したクラスをゲーム種類ごとに作成します。

これらのクラスの定義をまとめたモジュール`games.py`を作成します。

```py {name="games.py"}
'''ゲームの種類によって変わる駒の配置や名前、画像IDを記録したモジュール'''

from pieces import *


class Normal:
    '''通常のチェス'''
    # 盤面のサイズ
    size = 8
    # キャスリングの有無
    castling = True
    # プロモーション先
    promote2 = [Knight, Bishop, Rook, Queen]
    # 駒の配置
    placers = {1: [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook],
        2: [Pawn] * size}
    # 画像IDの割り当て
    ID = {}
    for rk in placers:
        for fl in range(size):
            if placers[rk][fl] is not None:
                ID['W' + placers[rk][fl].abbr] = size * rk + fl
                ID['B' + placers[rk][fl].abbr] = -(size * rk + fl)


class withUnicorn:
    '''キングサイドのナイトがユニコーンになったチェス'''
    # 盤面のサイズ
    size = 8
    # キャスリングの有無
    castling = True
    # プロモーション先
    promote2 = [Knight, Bishop, Rook, Queen, Unicorn]
    # 駒の配置
    placers = {1: [Rook, Knight, Bishop, Queen, King, Bishop, Unicorn, Rook],
        2: [Pawn] * size}
    # 画像IDの割り当て
    ID = {}
    for rk in placers:
        for fl in range(size):
            if placers[rk][fl] is not None:
                ID['W' + placers[rk][fl].abbr] = size * rk + fl
                ID['B' + placers[rk][fl].abbr] = -(size * rk + fl)
```

クラス名は駒クラス名と異なることに注意します。

画像IDには、各種各色の駒に一意的に整数が割り当てられます。

<br>

これらのクラスをもとにしてインスタンスを作成し、その属性を元に盤面や駒を設置します。

インスタンス作成のタイミングは、ゲームの種類が決まったとき＝特定のボタンが押されたときですが、

ひとまずインスタンスを代入する変数の宣言をしておきます。

```py {name="main.py", hl_lines=["5-7", "10-16", "19-35"], ins=["1-9", "19-26"], del=[0, "10-18"]}
class Game:
    def __init__(self):
        self.playersturn = W
        self.gameboard = {}
        self.place_pieces()
        # ゲームの種類
        self.kind = None
        ...

    def after_deciding_kind(self):
        '''ゲーム種類決定後の処理'''
        # 駒の配置
        self.place_pieces() 
        # 画像の設定
        for name, num in self.kind.ID.items():
            set_img(name, name[0], num)

    def place_pieces(self):
        for i in range(0, 8):
            self.gameboard[(i, 1)] = Pawn(W, 1)
            self.gameboard[(i, 6)] = Pawn(B, -1)
　
        placers = [Rook, Knight, Bishop, Queen, King, Bishop, Unicorn, Rook]
　
        for i in range(0, 8):
            self.gameboard[(i, 0)] = placers[i](W)
            self.gameboard[(i, 7)] = placers[i](B)
        for fl in range(self.kind.size):
            for rk in self.kind.placers:
                # None を指定すれば駒が置かれることはなく次のマスへ進む
                if self.kind.placers[rk][fl] is not None:
                    # 白の駒
                    self.gameboard[(fl, rk - 1)] = self.kind.placers[rk][fl]('W')
                    # 黒の駒
                    self.gameboard[(fl, self.kind.size - rk)] = self.kind.placers[rk][fl]('B')
...
```

`after_deciding_kind`メソッドで、インスタンスの属性をもとに駒の配置と画像IDの設定をしています。

<br>

`Pawn`クラスでは独自にコンストラクタを設定していましたが、

色によって進む方向は明白なので特別に定義する必要はありません。

```py {name="pieces.py", hl_lines=["6-11", 13], ins=[6], del=["0-5"]}
...

class Pawn(Piece):
    abbr = 'P'

    def __init__(self, color, direction):
        self.color = color
        # of course, the smallest piece is the hardest to code. direction should be either 1 or -1, should be -1 if the pawn is traveling "backwards"
        self.direction = direction
        self.name = color + self.abbr
　
    def available_moves(self, x, y, gameboard):
        self.direction = 1 if self.color == 'W' else -1
        ...
```


<br>

## ゲームボタンを表示する

５行２列にボタンを並べる関数を定義します。

```py {name="utils.py"}
...
def draw_button(left, right, bottom, top,
        letter, back_color=(1.00, 0.81, 0.62), font_color=(0.82, 0.55, 0.28)):
    '''ボタンを描画する

    Parameters
    ----------
    left, right, bottom, top : float
        ボタンの左右下上端の座標．
    letter : str
        ボタン上に描画する文字．
    back_color : tuple or list, default (1.00, 0.81, 0.62)
        ボタンの色．
    font_color : tuple or list, default (0.82, 0.55, 0.28)
        文字の色．
    '''
    glColor(*back_color)
    glBegin(GL_QUADS)
    glVertex(left, bottom)
    glVertex(left, top)
    glVertex(right, top)
    glVertex(right, bottom)
    glEnd()
    glColor(*font_color)
    draw_str((left + right) / 2 - 0.1 * len(letter), (bottom + top) / 2, letter, gap=0.2)


# ゲーム選択画面に表示するゲーム名
game_name_dict = {0: ('Normal Chess', 'Unicorn', 'A', 'B', 'C'),
    1: ('D', 'E', 'F')}


def draw_game_menu():
    '''ゲーム選択メニューを描画する'''
    for i in range(2):
        for j in range(5):
            if i in game_name_dict and j < len(game_name_dict[i]):
                draw_button(4.5*i - 0.5, 4.5*i + 3.0, 6.5 - 1.5*j, 7.5 - 1.5*j,
                    game_name_dict[i][j])
...
```

25行目の`0.1`や `0.2`という数値は見え方によって調整します。

これを描画イベント内部で使用します。

```py {name="main.py", hl_lines=["8-10"]}
from utils import *
...

class Game:
    ...
    def draw(self):
        ...
        if self.kind == None:
            draw_game_menu()
        else:
            if self.time == 1:
                self.main()
            ...
        ...
```

これでボタンが表示されました。

{{< img src=game_buttons width=360 alt="ゲームボタン" >}}

<br>

## ボタンクリックに対応する

ボタンをクリックしたときに、指定のゲーム種類を内部で登録するようにします。

まず、表示位置に対応するゲームクラスを格納するディクショナリを定義します。

```py {name="games.py"}
...
# ゲーム選択画面に表示するゲーム
game_dict = {0: (Normal, withUnicorn)}
```

表示用に使った`A B C ...`はクラスを作っていないので省いています。

<br>

これを使ってマウスイベントの処理を書きます。

```py {name="main.py", hl_lines=[2, "13-21"]}
...
from games import *
...

class Game:
    ...
    def mouse(self, button, state, x, y):
        ...
        # 左クリック
        if (button == GLUT_LEFT_BUTTON
                and state == GLUT_DOWN):
            try:
                # ゲーム種類選択
                if self.kind == None:
                    for i in range(2):
                        for j in range(5):
                            if i in game_dict and j < len(game_dict[i]):
                                if on_square(*self.mousepos, 4.5*i - 0.5, 4.5*i + 3.0, 6.5 - 1.5*j, 7.5 - 1.5*j):
                                    self.kind = game_dict[i][j]()
                                    self.after_deciding_kind()
                else:
                    ...
    ...
```

これでゲームの選択を実現できました。

ボタンを選択すると盤面と駒が表示されます。

<br>

今回の変更は [GitHub](https://github.com/midorimici/chess-program-for-python-and-OpenGL/releases/tag/v.1.5) にて公開しています。

---

基本的にこれまで解説してきたことを使えば、フェアリー駒の作成やゲーム種類の拡張をすることができるようになります。

あとは特殊な挙動の駒をどう実装するか、などといった細かい話になってきます。

お読みいただきありがとうございました。

ではまた:wave: