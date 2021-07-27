---
title: "ガイスターアプリ開発(5) 駒の移動・ターン交代"
date: 2020-12-31T12:00:00+09:00
lastmod: 2020-12-31T12:00:00+09:00
categories: [プログラミング, ガイスターアプリ開発]
tags: [プログラミング, Python, アプリ開発]
draft: false
---

Python でつくるガイスター、連載第 5 回です。

{{< pstlk 前回 geister-app-dev-4 >}}は初期盤面を生成して描画しました。

今回は駒の移動とターン交代の画面を用意します。

<!--more-->

ガイスターでは相手の駒が見えてはいけないので、

ターン交代のたびに引継ぎのための画面を表示します。

<br>

## 駒の移動

駒をクリックしたときに行先を表示し、それをクリックするとその場所に移動するようにします。

まずは行先を表す円を描画します。

```py {name="draw.py"}
...
def dest(screen, pos, board):
    '''
    駒の行先を円で表示する

    screen : pygame.display.set_mode
    pos : tuple <- (int, int)
        駒の位置
    board : dict <- {(int, int): Piece}
        駒の位置とオブジェクト
    '''
    for _pos in board[pos].covering_squares(pos):
        # 自分の駒を除外
        if not (tuple(_pos) in board and board[tuple(_pos)].side == board[pos].side):
            _coord = np.asarray(_pos)*SQUARE_SIZE + MARGIN + SQUARE_SIZE/2
            pygame.draw.circle(screen, LAWNGREEN, [int(c) for c in _coord], int(PIECE_SIZE/2))
...
```

`LAWNGREEN`は色の定数で、定数をまとめてある別モジュールに定義してあります。

`pygame.draw.circle`の引数には中心の座標と半径を指定します。

<br>

これを、駒をクリックしたときに表示します。

```py {name="main.py", hl_lines=["2-9", "15-18", "30-44"], inline_hl=[0:["5-8"], 8:[8]]}
...
def main(screen, font, font_small, orders, move_snd):
    # ボード描画に渡すパラメータ
    # 0 - 先攻, 1 - 後攻, 2 - 終了後
    _turn = 0
    # マウス選択中の駒の位置
    _selecting_pos = None
    # 動かし終わった
    _move_finished = False
    ...

    while True:
        screen.fill(IVORY)
        # 盤面
        draw.board(screen, _board, _turn)
        if _selecting_pos is not None:
            # 行先
            draw.dest(screen, _selecting_pos, _board)
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
                    if _move_finished: continue
                    if _square_pos in _board and _board[_square_pos].side == _turn:
                        # 駒を選択したとき
                        _selecting_pos = _square_pos
                    else:
                        # 行先を選択したとき
                        if (_selecting_pos in _board
                                and _square_pos in _board[_selecting_pos].covering_squares(_selecting_pos)):
                            # 駒の移動
                            move_snd.play()
                            _board[_square_pos] = _board[_selecting_pos]
                            del _board[_selecting_pos]
                            # 移動完了
                            _move_finished = True
                        _selecting_pos = None
            ...
```

{{< video src=move opt=1 >}}

<br>

## ターン交代

次にターン交代の画面を用意します。

まずは引継ぎ画面を描画する関数を定義します。

```py {name="draw.py"}
...
def confirmation(screen, font, font_small, turn):
    '''
    手番交代の確認画面を表示する

    screen : pygame.display.set_mode
    font, font_small : pygame.font.SysFont
        フォント
    turn : int <- 0 | 1
        0 - 次は先攻, 1 - 次は後攻
    '''
    assert turn == 0 or turn == 1, 'draw.confirmation の引数 turn は 0, 1 の値を取ります'
    screen.fill(WHITE, (*MARGIN, 6*SQUARE_SIZE, 6*SQUARE_SIZE))
    _str1 = ('先' if turn == 0 else '後') + '攻のターンだよ'
    _str2 = '画面をクリックしてね'
    _str3 = '動かし終わったらスペースキーを押してね'
    _text1 = font.render(_str1, True, BLACK)
    _text2 = font.render(_str2, True, BLACK)
    _text3 = font_small.render(_str3, True, BLACK)
    screen.blit(_text1, DISP_SIZE/2-(len(_str1)*32/2, 32))
    screen.blit(_text2, DISP_SIZE/2-(len(_str2)*32/2, -32))
    screen.blit(_text3, DISP_SIZE/2-(len(_str3)*16/2, -32*4))
...
```

盤面を白い矩形で覆い隠し、その上にテキストを描いています。

プレイヤーは駒を動かし終わったらスペースキーを押してこの画面を表示し、

もう一方のプレイヤーが画面をクリックするとそのプレイヤーに交代することになります。

```py {name="game.py", hl_lines=["6-8", "13-15", "27-30", "35-42"]}
...
def main(screen, font, font_small, orders, move_snd, chturn_snd):
    # ボード描画に渡すパラメータ
    # 0 - 先攻, 1 - 後攻, 2 - 終了後
    _turn = 0
    # 次の番を確認する画面を表示するときに渡すパラメータ
    # 0 - 先攻, 1 - 後攻, 2 - なし
    _next = 0
    ...

    while True:
        ...
        if _next == 0 or _next == 1:
            # 交代確認画面
            draw.confirmation(screen, font, font_small, _next)
        ...

        # イベントハンドリング
        for event in pygame.event.get():
            ...
            # マウスクリック
            if event.type == MOUSEBUTTONDOWN:
                # 左
                if event.button == 1:
                    _mouse_pos = event.pos
                    _square_pos = tuple(mouse.chcoord(_mouse_pos))
                    # 確認画面のクリック
                    if _next == 0 or _next == 1:
                        _next = 2
                        continue
                    ...
            # キー
            if event.type == KEYDOWN:
                ...
                # Space キー
                if event.key == K_SPACE:
                    if _move_finished:
                        # ターン交代
                        chturn_snd.play()
                        _turn = (_turn+1)%2
                        _next = _turn
                        _move_finished = False
                ...
```

ゲーム開始直後も確認画面を表示するために、`_next = 0`としています。

{{< video src=chturn opt=1 >}}

---

{{< pstlk 次回 geister-app-dev-6 >}}は勝利条件を判定して、勝者を表示するところまでやりたいと思います。

読んでくださってありがとうございました。

では:wave: