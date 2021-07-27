---
title: "チェスアプリ開発(5) チェックメイト・ステイルメイトの判定"
date: 2020-02-24T20:00:00+09:00
lastmod: 2020-04-21T21:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
summary: "Python プログラムで動かすフェアリーチェスアプリ開発、連載第5回です。

前回は自らチェックされに行くような動きができないようにしました。

今回はチェックメイトやステイルメイトを判定できるようにします。"
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 5 回です。

{{< pstlk 前回 chess-app-devel-4 >}}は自らチェックされに行くような動きができないようにしました。

今回は
{{% tooltip %}}チェックメイト((キングがチェックされていて、一手でチェックから逃れることができない状態{{% /tooltip %}}や
{{% tooltip %}}ステイルメイト((キングがチェックされていないが、打つ手がない状態{{% /tooltip %}}
を判定できるようにします。

<!--more-->

## 動かせる駒があるかどうかの判定

チェックメイトを判定できるようにしましょう。

チェックメイトとチェックは何が違うかというと、

**チェックは一手でチェックじゃなくできるけど、チェックメイトはどうあがいてもチェックを免れない**

という点です。

チェックというのがキングが敵駒に攻撃されている状態ですから、

チェックメイトはキングを相手の攻撃範囲外にすることが一手ではできないという状態ですね。

前回で自らチェックされに行くような動きは出来なくなりました。

つまりどう動いてもチェックされてしまうというときはどこにも動けません。

動かせる駒がないとき、チェックメイトまたはステイルメイトであると言えます。

どの駒も動かすことができないとき、`True`を返すような
{{% tooltip %}}メソッド((クラス内で定義される関数のようなもの{{% /tooltip %}}
を作りましょう。

```py:main.py
class Game:
    ...
    def cannotMove(self, color, gameboard):
        '''color側が駒を動かせないときTrueを返す'''
        for position, piece in gameboard.items():
            # 盤面上の駒の位置と駒について
            if color == piece.Color:
                # 駒色がcolorのとき
                for dest in piece.availableMoves(*position, gameboard, Color=color):
                    # 駒の移動先について
                    # 移動後にチェック回避できるならFalse
                    gameboardTmp = copy(gameboard)
                    gameboardTmp[dest] = gameboardTmp[position]
                    del gameboardTmp[position]
                    if not self.isCheck(color, gameboardTmp):
                        return False
        # colorのどの駒をどのように移動させてもチェック回避できなかったとき
        return True
```

13, 14 行目の形は今までも何度か出てきました。

この際この 2 行を表すメソッドを作ってしまいましょう。

```py:main.py
class Game:
    ...
    def renewGameboard(self, startpos, endpos, gameboard):
        '''盤面を更新する'''
        gameboard[endpos] = gameboard[startpos]
        del gameboard[startpos]
```

これで`main()`と`isValidMove()`と`cannotMove()`は次のようになります。

```py:main.py {hl_lines=[10, 18, 32]}
class Game:
    ...
    def main(self):
        while True:
            ...
            if target:
                ...
                if self.isValidMove(target, startpos, endpos, self.gameboard):
                    self.message = "that is a valid move"
                    self.renewGameboard(startpos, endpos, self.gameboard)
                    self.isCheck(target.Color, self.gameboard)
                    ...
    ...
    def isValidMove(self, piece, startpos, endpos, gameboard):
        '''pieceのstartpos -> endposの動きが可能であるときTrueを返す'''
        if endpos in piece.availableMoves(startpos[0], startpos[1], gameboard, Color=piece.Color):
            gameboardTmp = copy(gameboard)
            self.renewGameboard(startpos, endpos, gameboardTmp)
            if self.isCheck(piece.Color, gameboardTmp):
                return False
            else:
                return True
        else:
            return False
    ...
    def cannotMove(self, color, gameboard):
        '''color側が駒を動かせないときTrueを返す'''
        for position, piece in gameboard.items():
            if color == piece.Color:
                for dest in piece.availableMoves(*position, gameboard, Color=color):
                    gameboardTmp = copy(gameboard)
                    self.renewGameboard(position, dest, gameboardTmp)
                    if not self.isCheck(color, gameboardTmp):
                        return False
        return True
```

さて、これで`cannotMove() and isCheck()`ならチェックメイト、

`cannotMove() and not isCheck()`ならステイルメイトです。

<br>

## 判定してメッセージ表示

あとはこれを適切な位置においてメッセージも表示させれば OK です。

チェックと同じ場所に置きたいですね。

どこで判定してどこでメッセージ表示しているのでしょうか。

```py:main.py {hl_lines=[11, 22]}
class Game:
    ...
    def main(self):
        while True:
            ...
            if target:
                ...
                if self.isValidMove(target, startpos, endpos, self.gameboard):
                    self.message = "that is a valid move"
                    self.renewGameboard(startpos, endpos, self.gameboard)
                    self.isCheck(target.Color, self.gameboard)
                    ...
    ...
    def isCheck(self, color, gameboard):
        kingDict = {}
        pieceDict = {BLACK : [], WHITE : []}
        for position, piece in gameboard.items():
            if type(piece) == King:
                kingDict[piece.Color] = position
            pieceDict[piece.Color].append((piece, position))
        if self.canSeeKing(kingDict[color], pieceDict[opponent[color]], gameboard):
            self.message = f"{color} player is in check"
            return True
```

どうやらメッセージは`self.message`が請け負っているようです。

せっかく`isCheck()`に真偽判定をさせているので、こっちの書き方のほうがすっきりするかな。

```py:main.py {hl_lines=["11-13", 24], ins=[1, 2], del=[0, 3], inline_hl=[1:[0_12]]}
class Game:
    ...
    def main(self):
        while True:
            ...
            if target:
                ...
                if self.isValidMove(target, startpos, endpos, self.gameboard):
                    self.message = "that is a valid move"
                    self.renewGameboard(startpos, endpos, self.gameboard)
                    self.isCheck(target.Color, self.gameboard)
                    if self.isCheck(target.Color, self.gameboard):
                        self.message = f"{target.Color} player is in check"
                    ...
    ...
    def isCheck(self, color, gameboard):
        kingDict = {}
        pieceDict = {BLACK : [], WHITE : []}
        for position, piece in gameboard.items():
            if type(piece) == King:
                kingDict[piece.Color] = position
            pieceDict[piece.Color].append((piece, position))
        if self.canSeeKing(kingDict[color], pieceDict[opponent[color]], gameboard):
            self.message = f"{color} player is in check"
            return True
```

移してみました。

同じ要領で、チェックメイトやステイルメイトのメッセージも盛り込めますね。

あと、メイトになるとゲームは終了するので、プログラムを終了させるようにましょう。

```py:main.py {hl_lines=["13-19"]}
import sys
　
def main(self):
    while True:
        ...
        if target:
            ...
            if self.isValidMove(target, startpos, endpos, self.gameboard):
                self.message = "that is a valid move"
                self.renewGameboard(startpos, endpos, self.gameboard)
                if self.isCheck(target.Color, self.gameboard):
                    self.message = f"{target.Color} player is in check"
                if self.cannotMove(target.Color, self.gameboard):
                    if self.isCheck(target.Color, self.gameboard):
                        self.message = f"Checkmate! {opponent[target.Color]} player won!"
                        sys.exit()
                    else:
                        self.message = "Stalemate! It's draw."
                        sys.exit()
                ...
```

---

これまでの回で、当初指摘されていた問題点のほとんどは解決しました。

キャスリングやアンパッサンなどの実装もしたいのですが、

その前に見た目や遊び方をゲームっぽくしていきたいと思います。

次回は{{< pstlk こちら chess-app-devel-6 >}}

それではまた:wave:
