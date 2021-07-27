---
title: "チェスアプリ開発(12) キャスリングの実装"
date: 2020-05-09T12:00:00+09:00
lastmod: 2021-02-16T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第11回です。

{{< pstlk 前回 chess-app-devel-11 >}}はチェスの特殊ルールのひとつ、プロモーションを実装しました。

今回はキャスリングという特殊ルールを実装していきます。

<!--more-->

<br>

## キャスリングとは

castling と書き、キングの入城という意味です。

キングとルークを一手で同時に動かすことができますが、動き方や条件が決まっています。

キャスリングの条件は次の通りです。

1. キングが**一歩も動いたことがない**
1. キャスリングに関わるルークが**一歩も動いたことがない**
1. キャスリングに関わるルークとキングの**間に駒がひとつもない**
1. キング・キングが通るマス・キングの移動先のマスが**敵の駒に攻撃されていない**

キャスリングの動きは、キングサイドキャスリングとクイーンサイドキャスリングの２通りがあります。

いずれの場合でも、キングがルーク側に２歩動き、ルークがキングの反対側の隣のマスに回り込むという動きをします。

{{< img src=castling-kansei ext=gif alt="キャスリング 完成イメージ" width=300 >}}

<br>

## キャスリングの条件を定義

キャスリングの条件を満たさなければキャスリングはできません。

まずはキャスリングの条件を定義します。

キングとキャスリングに関わるルークが一度でも動くと、その方向へのキャスリングはできなくなります。

各方向へのキャスリングが可能かどうかを表す変数を定義します。

```py {name="main.py", hl_lines=["4-6", "14-37"]}
class Game:
    def __init__(self):
        ...
        # キャスリング
        # キャスリングのポテンシャルが残っているか
        self.can_castling = {'W': [True, True], 'B': [True, True]}
        ...
    ...
　
    def main(self):
        ...
            if target and target.color == self.playersturn:
                ...
                # キングが動いた
                # 白
                if target.name == 'WK':
                    self.can_castling['W'] = [False, False]
                # 黒
                if target.name == 'BK':
                    self.can_castling['B'] = [False, False]
                # ルークが動いた
                # 白
                if target.name == 'WR':
                    # クイーンサイド
                    if startpos[0] == 0:
                        self.can_castling['W'][0] = False
                    # キングサイド
                    if startpos[0] == 7:
                        self.can_castling['W'][1] = False
                # 黒
                if target.name == 'BR':
                    # クイーンサイド
                    if startpos[0] == 0:
                        self.can_castling['B'][0] = False
                    # キングサイド
                    if startpos[0] == 7:
                        self.can_castling['B'][1] = False
                ...
```

この変数を使うことで、特定の方向へのキャスリングが可能かどうかが判定できますね。

<p>
次は、キャスリングの条件を定義した
{{% tooltip %}}メソッド((クラス内で定義される関数のようなもの{{% /tooltip %}}
を作ります。
</p>

```py {name="main.py"}
class Game:
    ...
    def castling_requirements(self, piece, endpos, side, gameboard):
        '''
        キャスリングの条件を満たすとき，True
        side == 0 -> aファイル側
        side == 1 -> hファイル側

        Parameters
        ----------
        piece : obj
            駒．キングでなければ return は False．
        endpos : tuple > (int, int)
            終了位置．絶対座標．
        side : int > 0, 1
            0 -- クイーンサイド
            1 -- キングサイド
        gameboard : dict > {(int, int): obj, ...}
            盤面．

        Returns
        -------
        bool
        '''
        common_req = (self.can_castling[piece.color][side]  # キャスリングに関与する駒が一度も動いていない
            and not self.is_check(piece.color, gameboard))  # キングがチェックされていない
        # 白のキャスリング
        if piece.color == 'W':
            piece_req = (piece.name == 'WK'
                and (7*side, 0) in gameboard
                and gameboard[(7*side, 0)].name == 'WR')
            # クイーンサイド
            if side == 0:
                special_req = (endpos == (2, 0)
                    # キングとルークの間に駒がない
                    and (1, 0) not in self.gameboard
                    and (2, 0) not in self.gameboard
                    and (3, 0) not in self.gameboard
                    # and キングが通過するマスが敵に攻撃されていない
                    )
            # キングサイド
            if side == 1:
                special_req = (endpos == (6, 0)
                    # キングとルークの通過するマスに駒がない
                    and (6, 0) not in self.gameboard
                    and (5, 0) not in self.gameboard
                    # and キングが通過するマスが敵に攻撃されていない
                    )
        # 黒のキャスリング
        if piece.color == 'B':
            piece_req = (piece.name == 'BK'
                and (7*side, 7) in gameboard
                and gameboard[(7*side, 7)].name == 'BR')
            # クイーンサイド
            if side == 0:
                special_req = (endpos == (2, 7)
                    # キングとルークの通過するマスに駒がない
                    and (1, 7) not in self.gameboard
                    and (2, 7) not in self.gameboard
                    and (3, 7) not in self.gameboard
                    # and キングが通過するマスが敵に攻撃されていない
                    )
            # キングサイド
            if side == 1:
                special_req = (endpos == (6, 7)
                    # キングとルークの通過するマスに駒がない
                    and (6, 7) not in self.gameboard
                    and (5, 7) not in self.gameboard
                    # and キングが通過するマスが敵に攻撃されていない
                    )
　
        return common_req and piece_req and special_req
```

さて、まだ「キングが通るマス・キングの移動先のマスが敵の駒に攻撃されていない」という条件を表現しなければなりません。

### キングの通過するマスが敵に攻撃されていない

キャスリングで通るマスにキングを仮に動かして、その状態でチェック状態になるかどうか確認し、

どの場合でもチェックにならなければ True となるような関数を作り、これを利用します。

`castling_requirements()`メソッドの内部でしか使わないので、内部で関数を定義しています。

```py {name="main.py", hl_lines=["3-45", 60, 61, 69, 70, 84, 85, 93, 94]}
def castling_requirements(self, piece, endpos, side, gameboard):
    ...
    def create_tmp_board(startpos_y, endpos):
        '''
        キングの通過するマスが攻撃されていないことを確認するために，
        キングがそのマスに動いたときに攻撃されるかを見るための
        仮の盤面を出力する
        
        Parameters
        ----------
        startpos_y : int
            開始位置y座標．
        endpos : tuple > (int, int)
            終了位置．絶対座標．

        Returns
        -------
        gameboard_tmp : dict > {(int, int): obj, ...}
        '''
        gameboard_tmp = copy(gameboard)
        if (4, startpos_y) in gameboard_tmp:
            gameboard_tmp[endpos] = gameboard_tmp[(4, startpos_y)]
            del gameboard_tmp[(4, startpos_y)]
        return gameboard_tmp
    
    def path_is_not_attacked(startpos_y, king_route):
        '''
        キングが通るマスのどれかが相手の駒に攻撃されていれば False を返す

        Parameters
        ----------
        startpos_y : int
            開始位置y座標．
        king_route : list > [int, ...]
            キングが通る位置x座標のリスト．

        Returns
        -------
        bool
        '''
        for pos in king_route:
            if self.is_check(piece.color, create_tmp_board(startpos_y, (pos, startpos_y))):
                return False
        return True
    
    common_req = (self.can_castling[piece.color][side]  # キャスリングに関与する駒が一度も動いていない
            and not self.is_check(piece.color, gameboard))  # キングがチェックされていない
        # 白のキャスリング
        if piece.color == 'W':
            piece_req = (piece.name == 'WK'
                and (7*side, 0) in gameboard
                and gameboard[(7*side, 0)].name == 'WR')
            # クイーンサイド
            if side == 0:
                special_req = (endpos == (2, 0)
                    # キングとルークの間に駒がない
                    and (1, 0) not in self.gameboard
                    and (2, 0) not in self.gameboard
                    and (3, 0) not in self.gameboard
                    # キングが通過するマスが敵に攻撃されていない
                    and path_is_not_attacked(0, [2, 3])
                    )
            # キングサイド
            if side == 1:
                special_req = (endpos == (6, 0)
                    # キングとルークの通過するマスに駒がない
                    and (6, 0) not in self.gameboard
                    and (5, 0) not in self.gameboard
                    # キングが通過するマスが敵に攻撃されていない
                    and path_is_not_attacked(0, [6, 5])
                    )
        # 黒のキャスリング
        if piece.color == 'B':
            piece_req = (piece.name == 'BK'
                and (7*side, 7) in gameboard
                and gameboard[(7*side, 7)].name == 'BR')
            # クイーンサイド
            if side == 0:
                special_req = (endpos == (2, 7)
                    # キングとルークの通過するマスに駒がない
                    and (1, 7) not in self.gameboard
                    and (2, 7) not in self.gameboard
                    and (3, 7) not in self.gameboard
                    # キングが通過するマスが敵に攻撃されていない
                    and path_is_not_attacked(7, [2, 3])
                    )
            # キングサイド
            if side == 1:
                special_req = (endpos == (6, 7)
                    # キングとルークの通過するマスに駒がない
                    and (6, 7) not in self.gameboard
                    and (5, 7) not in self.gameboard
                    # キングが通過するマスが敵に攻撃されていない
                    and path_is_not_attacked(7, [6, 5])
                    )
　
        return common_req and piece_req and special_req
```

これで、`castling_requirements()`はキャスリングの条件を満たすときのみ True を返すメソッドとなりました。

<br>

## キャスリング可能なとき、キングの動けるマスを追加

動ける位置を出力している`valid_moves()`メソッドを書き換えます。

```py {name="main.py"}
def valid_moves(self, piece, startpos, gameboard):
    ...
    # キャスリング
    for endpos in [(2, 0), (6, 0), (2, 7), (6, 7)]:
        if self.castling_requirements(piece, endpos, 0, gameboard):
            result += [endpos]
        if self.castling_requirements(piece, endpos, 1, gameboard):
            result += [endpos]
    ...
```

これでキャスリングの条件を満たすときにのみ、キングの移動先にキャスリングの移動先が追加されました。

{{< img src=castling-king-dake ext=gif alt="キャスリング キングだけ動く" >}}

この時点では、まだルークが動きませんので、ルークの動きを追加していきます。

<br>

## ルークを動かす

キングは正常に動いているので、盤面を更新するときにルークの位置を適切に処理すれば大丈夫です。 

盤面の更新の処理が定義されている`renew_gameboard()`メソッドを書き換えます。

```py {name="main.py"}
def renew_gameboard(self, startpos, endpos, gameboard):
    ...
    # キャスリング
    if (gameboard[endpos].abbr == 'K'
            and abs(startpos[0] - endpos[0]) == 2):
        # クイーンサイド
        # 白
        if endpos == (2, 0):
            del gameboard[(0, 0)]
            gameboard[(3, 0)] = Rook('W', 'WR')
        # 黒
        if endpos == (2, 7):
            del gameboard[(0, 7)]
            gameboard[(3, 7)] = Rook('B', 'BR')
        # キングサイド
        # 白
        if endpos == (6, 0):
            del gameboard[(7, 0)]
            gameboard[(5, 0)] = Rook('W', 'WR')
        # 黒
        if endpos == (6, 7):
            del gameboard[(7, 7)]
            gameboard[(5, 7)] = Rook('B', 'BR')
```

キャスリングが起こるのはキングが２歩動いたときのみであることを利用しています。

位置によってキャスリングが起こる箇所を判定し、ルークを消して別の位置に新たなルークを置いています。

これでキャスリングの実装が完成しました！

今回の変更も [GitHub](https://github.com/midorimici/chess-program-for-python-and-OpenGL/releases/tag/v.1.2) に上げておきます。

---

これでようやく、普通のチェスができるようになりました！

いったんきりがついたので、{{< pstlk 次回 chess-app-devel-13 >}}はちょっとプログラムを整形したいと思います。

お読みいただきありがとうございました。

ではまた:wave: