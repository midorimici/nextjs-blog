---
title: "チェスアプリ開発(19) キャスリングの拡張（曖昧性の排除と駒の再配置）"
date: 2020-10-06T12:00:00+09:00
lastmod: 2020-11-23T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, OpenGL, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 19 回です。

{{< pstlk 前回 chess-app-devel-18 >}}はキャスリングの条件判定のコードを編集しました。

今回は曖昧な場合にキャスリングするかどうかの確認をするようにして、キャスリング時の駒の再配置のコードの編集もしていきます。

<!--more-->

<br>

## キャスリングするかどうか確認

キングがルーク方向に１歩だけ動いたとき、

それがキャスリングを意図してのものか、はたまた単に動いただけなのかが曖昧です。

これをはっきりさせるために、「その動きはキャスリングを意図していますか？」とユーザに尋ねるダイアログを表示させます。

この表示には、{{< pstlk 第11回 "chess-app-devel-11/#選択肢を表示する吹き出しを描画" >}}で作成した吹き出しを利用します。

<br>

まず、確認が必要な場合とそうでない場合があるので、確認が必要かどうかを示す変数、

そして確認の結果キャスリングすることを選択したかを示す変数を設定します。

```py {name="main.py", hl_lines=["7-10"]}
class Game:
    def __init__(self):
        ...
        # キャスリング
        # キャスリングのポテンシャルが残っているか
        self.can_castling = {'W': [True, True], 'B': [True, True]}
        # キャスリングするかどうかをプレイヤーに確認するか
        self.confirm_castling = False
        # キャスリングできる状態にあるか
        self.do_castling = False
        ...
```

確認が必要な場合とは曖昧な場合、つまりキャスリング完了位置にキングがただ１歩動いた場合ですので、

このときの条件を記述していきます。

```py {name="main.py"}
class Game:
    ...
    def castle_or_not(self, piece, endpos):
        '''
        キャスリングするかしないかを確認するか

        Parameters
        ----------
        piece : obj
            駒．
        endpos : tuple > (int, int)
            終了位置．絶対座標．

        Notes
        -----
        if文の条件式について．

        キングの移動終了位置が，キャスリング終了位置としてありうる4つの位置のうちのいずれかにあてはまる
        and (クイーンサイドキャスリングの条件にあてはまる
            or キングサイドキャスリングの条件にあてはまる)
        and キングの初期位置とキャスリング終了位置のx座標の差 == 1
        and 移動先に駒がない（＝キングが敵駒を取ったのではない）
        '''
        if (endpos in [(2, 0), (self.kind.size - 2, 0), (2, self.kind.size - 1), (self.kind.size - 2, self.kind.size - 1)]
                and (self.castling_requirements(piece, endpos, 0, self.gameboard)
                    or self.castling_requirements(piece, endpos, 1, self.gameboard))
                and abs(self.kind.placers[1].index(King) - endpos[0]) == 1
                and endpos not in self.gameboard):
            self.confirm_castling = True
```

次に、この判定をマウスクリック時に行わせ、

```py {name="main.py"}
class Game:
    ...
    def mouse(self, button, state, x, y):
        ...
                    # 駒選択
                    elif (self.parse_mouse() in self.gameboard
                            and not self.prom and not self.confirm_castling):
            ...
            # キャスリングするかしないかの確認
            if self.kind.castling:
                if self.startpos in self.gameboard:
                    self.castle_or_not(
                        self.gameboard[self.startpos], self.endpos)
        ...
```

キャスリングを確認するときには、吹き出しとボタンで確認ダイアログを作成して表示します。

```py {name="utils.py"}
def draw_castling_confirmation(endpos):
    '''キャスリング確認ダイアログを表示する'''
    draw_balloon(*endpos)
    glColor(1.0, 1.0, 1.0)
    draw_str(2.0, 4.0, 'Castling?')
    draw_button(1.5, 3.0, 3.0, 3.5, 'Yes',
                (1.0, 1.0, 1.0), (0.0, 0.0, 0.0))
    draw_button(4.0, 5.5, 3.0, 3.5, 'No',
                (1.0, 1.0, 1.0), (0.0, 0.0, 0.0))
```

```py {name="main.py"}
class Game:
    ...
    def draw(self):
        ...
            if self.time == 1 and not self.confirm_castling:
                self.main()
        ...
            # キャスリングするかどうかの確認
            if self.confirm_castling:
                draw_castling_confirmation(self.endpos)
        ...
```

表示されたボタンをクリックすることで、キャスリングの意図があるかどうかが確認できます。

```py {name="main.py", hl_lines=["10-22"]}
class Game:
    ...
    def mouse(self, button, state, x, y):
        ...
            # キャスリングするかしないかの確認
            if self.kind.castling:
                if self.startpos in self.gameboard:
                    self.castle_or_not(
                        self.gameboard[self.startpos], self.endpos)
                if self.confirm_castling:
                    if on_square(*self.mousepos, 1.5, 3.0, 3.0, 4.0):
                        self.do_castling = True
                        self.confirm_castling = False
                        self.time = 0
                        self.moving = True
                        glutIdleFunc(self.idle_move)
                    if on_square(*self.mousepos, 4.0, 5.5, 3.0, 4.0):
                        self.do_castling = False
                        self.confirm_castling = False
                        self.time = 0
                        self.moving = True
                        glutIdleFunc(self.idle_move)
        ...
```

これで確認ができるようになりました。

{{< img src=castling_confirmation alt="キャスリング確認" >}}

<br>

## 駒の再配置

キャスリングした後には、ルークが特定の位置に移動します。

コードでは、もとの位置にあった駒（＝ルーク）を削除して特定の位置に再配置しています。

```py {name="main.py"}
def renew_gameboard(self, startpos, endpos, gameboard):
    '''
    盤面を更新する

    Parameters
    ----------
    startpos, endpos : tuple > (int, int)
        開始位置，終了位置．絶対座標．
    gameboard : dict > {(int, int): obj, ...}
        盤面．
    '''
    color = gameboard[startpos].color
    gameboard[endpos] = gameboard[startpos]
    del gameboard[startpos]
    ...
    # キャスリング
    if (gameboard[endpos].abbr == 'K'
            and abs(startpos[0] - endpos[0]) == 2):
        # クイーンサイド
        # 白
        if endpos == (2, 0):
            del gameboard[(0, 0)]
            gameboard[(3, 0)] = Rook('W')
        # 黒
        if endpos == (2, 7):
            del gameboard[(0, 7)]
            gameboard[(3, 7)] = Rook('B')
        # キングサイド
        # 白
        if endpos == (6, 0):
            del gameboard[(7, 0)]
            gameboard[(5, 0)] = Rook('W')
        # 黒
        if endpos == (6, 7):
            del gameboard[(7, 7)]
            gameboard[(5, 7)] = Rook('B')
```

まず駒の移動先に移動前の駒{{% tooltip %}}インスタンス((クラスをもとに作られた実体{{% /tooltip %}}を移してから、もとの位置を削除しています（キングの動き）。

キャスリングが起こるのはキングが２歩動いたときのみであることを利用して条件文を立て、

位置によってキャスリングが起こる箇所を判定し、ルークを消して別の位置に新たなルークを置いています（ルークの動き）。

<br>

キングの動きに関しては、キングが１歩も動かないこともありえるので、`startpos != endpos`のときのみ`del gameboard[startpos]`を実行するようにします。

そうしないとキングが消えてしまうからです。

ルークの動きのほうは、キャスリング発生の条件を主に`do_castling`によって判定し、

ルークの初期位置にある駒がルークであれば、その駒を消して新たなルークを置いています。

これをもとに拡張して書き換えると、以下のようになります。

```py {name="main.py"}
def renew_gameboard(self, startpos, endpos, gameboard):
    '''
    盤面を更新する

    Parameters
    ----------
    startpos, endpos : tuple > (int, int)
        開始位置，終了位置．絶対座標．
    gameboard : dict > {(int, int): obj, ...}
        盤面．
    '''
    color = gameboard[startpos].color
    gameboard[endpos] = gameboard[startpos]
    del gameboard[startpos]
    if startpos != endpos:
        del gameboard[startpos]
    ...
    # キャスリング
    # キャスリングできるゲームである
    # キャスリング確認中でない
    # キャスリングできる
    # 終了位置指定がある
    if (self.kind.castling
            and not self.confirm_castling
            and self.do_castling
            and None not in endpos):
        rook_init_pos = [pos for pos, piece in enumerate(self.kind.placers[1])
            if piece == Rook]
        size = self.kind.size
        piece = gameboard[endpos]
        # クイーンサイド
        rook_pos = rook_init_pos[0]
        # 白
        if (endpos == (2, 0)
                and piece.color == 'W'
                and (rook_pos, 0) in gameboard):
            if gameboard[(rook_pos, 0)].abbr == 'R':
                del gameboard[(rook_pos, 0)]
            gameboard[(3, 0)] = Rook('W')
        # 黒
        if (endpos == (2, size - 1)
                and piece.color == 'B'
                and (rook_pos, size - 1) in gameboard):
            if gameboard[(rook_pos, size - 1)].abbr == 'R':
                del gameboard[(rook_pos, size - 1)]
            gameboard[(3, size - 1)] = Rook('B')
        # キングサイド
        rook_pos = rook_init_pos[1]
        # 白
        if (endpos == (size - 2, 0)
                and piece.color == 'W'
                and (rook_pos, 0) in gameboard):
            if gameboard[(rook_pos, 0)].abbr == 'R':
                del gameboard[(rook_pos, 0)]
            gameboard[(size - 3, 0)] = Rook('W')
        # 黒
        if (endpos == (size - 2, size - 1)
                and piece.color == 'B'
                and (rook_pos, size - 1) in gameboard):
            if gameboard[(rook_pos, size - 1)].abbr == 'R':
                del gameboard[(rook_pos, size - 1)]
            gameboard[(size - 3, size - 1)] = Rook('B')
```

これでキャスリングの曖昧性の排除、そして駒の再配置ができるようになりました。

{{< video src=castling1 opt=1 >}}

{{< video src=castling2 opt=1 >}}

<br>

ここ数回分の変更は [GitHub](https://github.com/midorimici/chess-program-for-python-and-OpenGL/commit/06886ba60cbe2856db1e7cc52bc9fba67693c328#diff-6707418c2a43eec365d78e30985aafe1) で見ることができます。

---

フェアリーチェスが作れるようになって、

ゲームによって出現する駒が変わるので、

{{< pstlk 次回 chess-app-devel-20 >}}はプロモーションの拡張について書きたいと思います。

お読みいただきありがとうございました～

ではまた:wave: