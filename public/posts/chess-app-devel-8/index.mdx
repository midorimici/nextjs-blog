---
title: 'チェスアプリ開発(8) マウス操作で駒を動かす'
date: 2020-04-02T18:00:00+09:00
lastmod: 2020-12-16T18:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, OpenGL, アプリ開発, チェス]
katex: true
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第８回です。

{{< pstlk 前回 chess-app-devel-7 >}}は
{{% tooltip %}}Pillow((Python の画像処理ライブラリ{{% /tooltip %}}
で画像を読み込み、盤面上に駒を表示しました。

今回はマウス操作で駒を動かせるようにしていきます。

<!--more-->

<br>

## 完成イメージ

{{< img src=goal ext=gif alt=完成図 width=300 >}}

駒をクリックすると移動可能なマスが表示され、移動先をクリックするとそこに移動するようにします。

<br>

## 丸の描画

駒をクリックしたら丸を表示するので、丸を描画する関数を定義します。

```py:utils.py
from math import pi, sin, cos
　
...
　
def circle(x, y, opponent, r=0.25):
    '''
    円を描画する

    Parameters
    ----------
    x, y : float
        中心の座標．
    opponent : bool
        True のとき，赤色で描画する．
    r : float, default 0.25
        半径．
    '''
    glPushMatrix()          # 変形範囲の開始
    glTranslate(x, y, 0)    # 平行移動

    # 色の指定
    if opponent:
        glColor(1.0, 0.5, 0.5, 0.7)     # 赤
    else:
        glColor(0.5, 0.5, 1.0, 0.7)     # 青

    # 円の描画
    glBegin(GL_POLYGON)     # 多角形の描画
    for k in range(12):
        xr = r * cos(2 * pi * k / 12)
        yr = r * sin(2 * pi * k / 12)
        glVertex(xr, yr, 0)
    glEnd()
    　
    glPopMatrix()           # 変形範囲の終了
```

円の描画としていますが、実は正十二角形を描画しているだけです。

数学の話になりますが、三角関数の引数は
{{% tooltip %}}弧度法((度数法に 180 で割って円周率をかけたもの{{% /tooltip %}}
で表されるので、

360 度は円周率の 2 倍の値（$2\pi$）になります。

角度と座標の関係は次の図のようになるので、

30-31 行目のような式が出来上がります。

{{< img src=sin-cos ext=png alt=角度と座標 width=300 >}}

<br>

## マウスポインタ座標の取得

OpenGL では、`glutMouseFunc()` にユーザ定義の関数を登録しておけば、

**マウスのどのボタンが押され離されたか、そのときのマウスポインタの位置はどこかなどの情報を取得できます。**

マウスで動作を制御できるようになるので、キーボードからコマンドを入力するための関数や、

盤面が画面に表示されるので、コマンドラインに盤面を表示する関数は消してしまいます。

（赤は削除行です。可読性のため、キャメルケース CamelCase からスネークケース snake_case に変更するなど、表記を変えた部分があります。）

```py:main.py {hl_lines=["4-9", 13, "16-20", "22-52", "56-93", 99], ins=["0-5", "9-11", "34-84"], del=["6-8", "12-33"], inline_hl=[7:["4-7"], 9: ["4-10"]]}
class Game:
    def __init__(self):
        ...
        # マウスポインタの位置
        self.mousepos = [-1.0, -1.0]
        # 行先の指定
        self.select_dest = False
        # 始点・終点
        self.startpos, self.endpos = (None, None), (None, None)
        ...
    ...
    def main(self):
        self.printBoard()
        print(self.message)
        self.message = ""
        startpos, endpos = self.parseInput()
        ...
        startpos, endpos = self.startpos, self.endpos
        if None not in startpos + endpos:
            ...
	...
    def parseInput(self):
        try:
            a,b = input().split()
            a = ((ord(a[0])-97), int(a[1])-1)
            b = (ord(b[0])-97, int(b[1])-1)
            print(a,b)
            return (a,b)
        except:
            print("error decoding input. please try again")
            return((-1,-1),(-1,-1))
　
    def printBoard(self):
        print("  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |")
        for i in range(0,8):
            print("-"*32)
            print(chr(i+97),end="|")
            for j in range(0,8):
                item = self.gameboard.get((i,j)," ")
                print(str(item)+' |', end = " ")
            print()
        print("-"*32)
　
    def parse_mouse(self):
        '''マウスポインタの位置から指定したマス目を出力'''
        a, b = self.mousepos
        file_, rank = None, None
        for i in range(8):
            if abs(a - i) < 0.5: file_ = i
        for i in range(8):
            if abs(b - i) < 0.5: rank = i
        return (file_, rank)
　
	...
　
    def mouse(self, button, state, x, y):
        '''
        マウス入力コールバック

        Parameters
        ----------
        button : GLUT_LEFT_BUTTON, GLUT_MIDDLE_BUTTON, GLUT_RIGHT_BUTTON or int > 0, 1, 2
            マウスボタン．
            GLUT_LEFT_BUTTON, 0 -- 左
            GLUT_MIDDLE_BUTTON, 1 -- 中
            GLUT_RIGHT_BUTTON, 2 -- 右
        state : GLUT_DOWN, GLUT_UP or int > 0, 1
            ボタンの状態．
            GLUT_DOWN, 0 -- 押された
            GLUT_UP, 1 -- 離された
        x, y : int
            ウィンドウ座標．
        '''
        # ウィンドウ座標をワールド座標に変換する
        self.mousepos = window2world(x, y, WSIZE)
        # 左クリック
        if (button == GLUT_LEFT_BUTTON
                and state == GLUT_DOWN):
            try:
                # 行先選択
                if (self.select_dest
                        and self.is_valid_move(self.gameboard[self.startpos],
                            self.startpos, self.parse_mouse(), self.gameboard)):
                    self.select_dest = False
                    self.endpos = self.parse_mouse()
                # 駒選択
                elif self.parse_mouse() in self.gameboard:
                    self.startpos, self.endpos = (None, None), (None, None)
                    self.select_dest = True
                    self.startpos = self.parse_mouse()
            except KeyError: pass
　　
            glutPostRedisplay()     # 再描画
　
    ...
　
    def glmain(self):
        ...
        glutMouseFunc(self.mouse) 	# マウス入力コールバック
        ...
```

クリック操作をするたびに`mouse()`メソッドが呼び出されて処理をします。

`parse_mouse()`で、クリック時のマウスポインタの位置をもとに盤面上のどのマスが指定されたかを出力し、

駒やその移動先を指定することができます。

予期せぬ場所がクリックされたときのために、`try-except`で例外処理をしています。

[`glutPostRedisplay()`](http://wisdom.sakura.ne.jp/system/opengl/gl10.html)は画面の再描画を行う関数で、`draw()`メソッドを呼び出します。

19 行目の`if None not in startpos + endpos:`は、開始位置と終了位置の両方が指定されていることを保証するものです。

### ウィンドウ座標をワールド座標に変換

`mouse()`メソッドの引数として渡される`x, y`は**ウィンドウ座標**です。

ウィンドウ座標は、表示されているウィンドウの左上を(0, 0)とし、ピクセルを単位とする座標系です。

つまり、ウィンドウのサイズを 600x400 だとすると、右下の座標は(600, 400)となります。

これに対して、実際に描画に使用されているのは**ワールド座標**です。

ワールド座標はユーザが定義できます。

{{< pstlk 第6回 "chess-app-devel-6#四角形の描画" >}}で`glOrtho()`を使って指定しているのもワールド座標です。

さて、実際にマウスポインタの位置を情報として使用するにあたっては、

**ワールド座標に変換したほうが何かと便利**です。

そこで、ウィンドウ座標をワールド座標に変換する関数を作ります。

```py:utils.py
def window2world(x, y, wsize):
    '''
    ウィンドウ座標を世界座標に変換する

    Parameters
    ----------
    x, y : int
        変換するもとの座標．
    wsize : int
        画面の大きさ．

    Returns
    -------
    list > [float, float]
        変換先の座標．
    '''
    return [9*x / wsize - 1, 7 - (9*y / wsize - 1)]
```

この変換によって、左下端をクリックしたときには(-1, -1)という座標が、右上端をクリックしたときには(8, 8)という座標が取得できることになります。

{{< img src=world_coord ext=png alt=ワールド座標 width=300 >}}

<br>

## 移動可能なマスに丸を表示

さきほど定義した丸を描画する関数を使って、駒を指定したときにその駒が移動可能なマスに丸を表示するようにします。

まずは、指定された位置すべてに丸を描画する関数を定義します。

```py:utils.py
def draw_available_moves(poslist, opponent=None):
    '''動かせる位置を描画する

    Parameters
    ----------
    poslist : list > [(int, int), ...]
        移動先の座標のリスト．
    opponent : bool or None, default None
        True のとき，赤色で描画する．
    '''
    for pos in poslist:
        circle(*pos, opponent)
```

`*pos`はアンパックというもので、`pos`に格納されているデータのそれぞれをそのまま関数の引数に渡すために使っています。

これで、移動可能なマスの座標のリストを渡せばそこに丸を書いてくれるようになります。

```py:main.py {hl_lines=["4-10"]}
def draw(self):
    ...
    draw_pieces(self.gameboard, piece_ID)
    # 可能な移動先の表示
    if self.select_dest and None not in self.startpos:
        piece = self.gameboard[self.startpos]
        draw_available_moves(
            [move for move in piece.available_moves(*self.startpos, self.gameboard, color=piece.color)
                if self.is_valid_move(piece, self.startpos, move, self.gameboard)],
            opponent=self.playersturn != piece.color)
    ...
```

条件文は、行先選択中であり、開始位置が指定されているということ。

それで、`draw_available_moves()`の`opponent`では、自分の手番ではないときに相手の駒を触ったときに`True`となるような条件式を与えています。

ただ、8-9 行目の内包表記が面倒くさいです。

`available_moves()`は移動先のリストを返しますが、**チェック回避を考慮していないので、そのままでは使えません。**

そのため、{{< pstlk 第4回 "chess-app-devel-4#盤面を仮定する" >}}でチェック回避を考慮した`is_valid_move()`を作ったのですが、

こちらは移動可能かどうかを判定するだけで、**移動先の座標のリストを返すわけではありません。**

なんでこうしたんだろう、とちょっと後悔。

このままにしておいても面倒なので、移動先の座標のリストを返すように`is_valid_move()`を書き換えます。

```py:main.py {hl_lines=["1-39"], ins=["13-38"], del=["0-12"], id=5}
def is_valid_move(self, piece, startpos, endpos, gameboard):
    if endpos in piece.availableMoves(*startpos, gameboard, color=piece.color):
        # 盤面の複製
        gameboardTmp = copy(gameboard)
        # 複製した盤面の更新
        self.renew_gameboard(startpos, endpos, gameboardTmp)
        # チェック判定
        if self.is_check(piece.color, gameboardTmp):
            return False
        else:
            return True
    else:
        return False
def valid_moves(self, piece, startpos, gameboard):
    '''
    動ける位置を出力．味方駒上には移動不可．

    Parameters
    ----------
    piece : obj
        駒．
    startpos : tuple > (int, int)
        開始位置．絶対座標．
    gameboard : dict > {(int, int): obj, ...}
        盤面．

    Returns
    -------
    result : list > [(int, int), ...]
    '''
    result = piece.available_moves(*startpos, gameboard, color=piece.color)
    # チェック回避のため動き縛り
    result_tmp = copy(result)
    for endpos in result_tmp:
        gameboard_tmp = copy(gameboard)
        self.renew_gameboard(startpos, endpos, gameboard_tmp)
        if self.is_check(piece.color, gameboard_tmp):
            result.remove(endpos)
    return result
```

それに伴って関係各所の調整をします。

ところで、マウス操作では移動可能な場所をクリックしないと動作しないようにしているので、

`main()`内部の条件式は省いても構いません。

```py:main.py {hl_lines=["3-13", "21-23", "36-39"], ins=["7-10", 13, 16, 17], del=["0-6", 11, 12, 14, 15], id=6}
def main(self):
    ...
        if target:
            print("found "+str(target))
            if target.color != self.playersturn:
                self.message = "you aren't allowed to move that piece this turn"
            if self.is_valid_move(target, startpos, endpos, self.gameboard):
                self.message = "that is a valid move"
                ...
        if target and target.color == self.playersturn:
            print("found "+str(target))
            self.message = "that is a valid move"
            ...
...
　
def draw(self):
    ...
    if self.select_dest and None not in self.startpos:
        piece = self.gameboard[self.startpos]
        draw_available_moves(
            [move for move in piece.available_moves(*self.startpos, self.gameboard, color=piece.color)
                if self.is_valid_move(piece, self.startpos, move, self.gameboard)],
            self.valid_moves(piece, self.startpos, self.gameboard),
            opponent=self.playersturn != piece.color)
        ...
...
　
def mouse(self, button, state, x, y):
    ...
    # 左クリック
    if (button == GLUT_LEFT_BUTTON
            and state == GLUT_DOWN):
        try:
            # 行先選択
            if (self.select_dest
                    and self.is_valid_move(self.gameboard[self.startpos],
                        self.startpos, self.parse_mouse(), self.gameboard)):
                    and self.parse_mouse() in self.valid_moves(
                        self.gameboard[self.startpos], self.startpos, self.gameboard)):
                ...
```

これでマウス操作で駒を動かせるようになりました！

{{< img src=mouse-action-result ext=gif alt=結果 width=300 >}}

---

これで結構ゲームっぽくなってきましたね。

ただ、駒の動きがカクカクしています。

{{< pstlk 次回 chess-app-devel-9 >}} はおまけ的な感じで、駒の動きをスムーズにしてみたいと思います。

参考になったらうれしいです。

では:wave:
