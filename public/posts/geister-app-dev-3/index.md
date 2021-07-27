---
title: "ガイスターアプリ開発(3) 駒を配置する画面（マウス操作）"
date: 2020-12-13T12:00:00+09:00
lastmod: 2020-12-18T12:00:00+09:00
categories: [プログラミング, ガイスターアプリ開発]
tags: [プログラミング, Python, アプリ開発]
draft: false
---
Python でつくるガイスター、連載第 3 回です。

{{< pstlk 前回 geister-app-dev-2 >}}はグリッドやボタンを描画しました。

今回はマウス操作でグリッドに駒を置いたり、ボタンを押したりできるようにします。

<!--more-->

<br>

## クリックで駒を置く

pygame では`pygame.event.get()`からイベントを取得し、`event.type`でイベントの種類（マウス、キーボードなど）を取得します。

マウスクリックなら`event.type == MOUSEBUTTONDOWN`で、

左クリックならさらに`event.button == 1`、右クリックでなら`event.button == 3`という条件がつきます。

マウスカーソルの位置は`event.pos`から読み込めます。

クリックの種類とマウスカーソルの位置を表示するコードは次のようになります。

```py {name="main.py"}
...
def main():
    ...
    while True:
        ...
        for event in pygame.event.get():
            # マウスクリック
            if event.type == MOUSEBUTTONDOWN:
                # 左
                if event.button == 1:
                    print('left:', event.pos)
                # 右
                elif event.button == 3:
                    print('right:', event.pos)
```

これで取得できる座標はウィンドウ座標ですが、扱いやすいようにゲーム内の座標に変換します。

### 座標変換

マウスで特定の位置をクリックしたとき、そのマス目の座標（(1, 2) など）を返すようにします。

この関数はマウス関連の処理をまとめるモジュールに定義します。

```py {name="mouse.py"}
from config import *

def chcoord(pos):
    '''
    座標 pos がどのマス上にあるかその位置を返す
    -> tuple <- (int, int)
    (0, 0)│...│(5, 0)
    ───┼──┼───
           ...
    ───┼──┼───
    (5, 0)│...│(5, 5)

    pos : tuple <- (int, int)
        対象の座標
    '''
    return (pos-MARGIN)//SQUARE_SIZE
```

これでゲーム内の座標が取得できるので、クリックした位置がどこかを判定して、

そのマスの中に駒を置いていきます。

### 駒を置く

駒がどのように配置されているかを表す変数を用意して、クリックしたときにその変数を変更します。

```py {name="main.py", hl_lines=["6-11", 15, "24-29", "32-37"]}
...
import draw, mouse

def main():
    ...
    # 配置を決定する側
    # 0 - 先攻, 1 - 後攻
    _state = 0
    # 決定された初期配置と色
    # [{(int, int): str}]
    _order = [{}, {}]
    ...
    while True:
        screen.fill(IVORY)
        draw.setup(screen, font, _state)
        pygame.display.update()
        # イベントハンドリング
        for event in pygame.event.get():
            ...
            # マウスクリック
            if event.type == MOUSEBUTTONDOWN:
                # 左
                if event.button == 1:
                    _mouse_pos = event.pos
                    _square_pos = tuple(mouse.chcoord(_mouse_pos))
                    for i in range(1, 5):
                        for j in range(2, 4):
                            if _square_pos == (i, j):
                                _order[_state][(i, j)] = 'R'
                # 右
                elif event.button == 3:
                    _mouse_pos = event.pos
                    _square_pos = tuple(mouse.chcoord(_mouse_pos))
                    for i in range(1, 5):
                        for j in range(2, 4):
                            if _square_pos == (i, j):
                                _order[_state][(i, j)] = 'B'
            ...
```

その変数にしたがって駒を描画するようにします。

```py {name="draw.py", hl_lines=["2-3", "10-11"], ins=["1-3"], del=[0], inline_hl=[1:["8-9"]]}
...
def setup(screen, font, turn):
def setup(screen, font, turn, posdict):
    '''
    ...
    posdict : dict <- {(int, int): str}
        どの位置にどの色の駒が置かれているかを表す辞書
    '''
    ...
    for (x, y), s in posdict.items():
        _piece(screen, RED if s == 'R' else BLUE, (x, y))
    ...
```

```py {name="main.py", hl_lines=[6], inline_hl=[0:["9-13"]]}
...
def main():
    ...
    while True:
        screen.fill(IVORY)
        draw.setup(screen, font, _state, _order[_state])
        ...
```

{{< video src=set_piece opt=1 >}}

<br>

## ボタンを押す

ボタン上にマウスカーソルがあるときに左クリックすると何らかのアクションを起こすようにします。

駒は赤と青 4 個ずつでなければならないので、その条件を満たさないとボタンが押せないようにします。

<br>

条件を満たしているか判定する関数を定義します。

```py {name="main.py"}
...
def _check_color(colors):
    '''
    駒がすべて配置済みで赤と青が半分ずつあるか
    -> bool

    colors : list <- [str]
        色のリスト
    '''
    return (len(colors) == 8
        and len([s for s in colors if s == 'R'])
            == len([s for s in colors if s == 'B']))
...
```

マウスの座標がボタンにのっているか調べるため、別の関数も定義します。

（左上のほうが座標が小さいことに注意）

```py {name="mouse.py"}
...
def on_area(x, y, left, top, w, h):
    '''
    座標 x, y が範囲内にあるか
    -> bool

    x, y : int
        対象の座標
    left, top : int
        範囲の左・上端の座標
    w, h : int
        範囲の横・縦幅
    '''
    return left <= x <= left+w and top <= y <= top+h
...
```

<br>

そして、条件を満たしているときかつボタンがクリックされたときにのみ次の画面に進むことができます。

```py {name="main.py", hl_lines=[5, "10-12"]}
...
def main():
    ...
    while True:
        satisfied = _check_color(list(_order[_state].values()))
        ...
                # 左
                if event.button == 1:
                    ...
                    if mouse.on_area(*_mouse_pos, 500, 530, 80, 50):
                        if satisfied:
                            _state += 1
                ...
```

さらに、ボタンが押せるときと押せないときでボタンの色を変えます。

```py {name="draw.py", hl_lines=["2-3", "10-11"], ins=[1, 3], del=[0, 2], inline_hl=[1:["10-11"], 3:["17-18"]]}
...
def setup(screen, font, turn, posdict):
def setup(screen, font, turn, posdict, disabled):
    '''
    ...
    disabled : bool
        ボタンを押せない
    '''
    ...
    _button(screen, font, (500, 530), (80, 50), 'OK')
    _button(screen, font, (500, 530), (80, 50), 'OK', disabled)
...
```

```py {name="main.py", hl_lines=[6], inline_hl=[0:["14-15"]]}
...
def main():
    ...
    while True:
        ...
        draw.setup(screen, font, _state, _order[_state], not satisfied)
        ...
```

これで、駒が適切に配置されたときにのみボタンが押せるようになります。

{{< video src=button opt=1 >}}

右下のボタンの色が変わっていることがわかると思います。

<br>

## 効果音をつける

おまけですが、駒を置いたときやボタンを押したときに効果音をつけてみます。

```py {name="main.py", hl_lines=["4-8", 20, 25, 28]}
...
def main():
    pygame.init()
    # 音声の設定
    snd = pygame.mixer.Sound
    select_snd = snd('./sounds/select.wav')
    decide_snd = snd('./sounds/decide.wav')
    forbid_snd = snd('./sounds/forbid.wav')
    ...
    while True:
        ...
                # 左
                if event.button == 1:
                    _mouse_pos = event.pos
                    _square_pos = tuple(mouse.chcoord(_mouse_pos))

                    for i in range(1, 5):
                        for j in range(2, 4):
                            if _square_pos == (i, j):
                                select_snd.play()
                                _order[_state][(i, j)] = 'R'
                    
                    if mouse.on_area(*_mouse_pos, 500, 530, 80, 50):
                        if satisfied:
                            decide_snd.play()
                            _state += 1
                        else:
                            forbid_snd.play()
        ...
```

初期化して、パスを指定して音を取り込んで、該当部分で再生するだけです。

{{< relpos chess-app-devel-16 >}}

---

これで駒の初期配置を選択できるようになりました。

{{< pstlk 次回 geister-app-dev-4 >}}はここで決定した配置をゲーム本番での初期配置に反映していきます。

お読みいただきありがとうございました。

では:wave: