---
title: 'チェスアプリ開発(4) チェックされに行く動きの禁止'
date: 2020-02-19T21:26:18+09:00
lastmod: 2020-04-24T12:26:18+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第４回です。

{{< pstlk 前回 chess-app-devel-3 >}}は、ポーンについてその動きの仕組みを見たうえで、

最初の２歩の動きを追加してみました。

今回からはチェックやチェックメイトを判定できるようにしましょう！

<!--more-->

ゲーム構造の核心に近い部分に触れていきますよ。

<br>

## すでに`isCheck()`はあるが…

チェックを判定する
{{% tooltip %}}メソッド((クラス内で定義される関数のようなもの{{% /tooltip %}}
はすでに用意されています。

```py:main.py
def isCheck(self):
    #ascertain where the kings are, check all pieces of opposing color against those kings, then if either get hit, check if its checkmate
    king = King
    kingDict = {}
    pieceDict = {BLACK : [], WHITE : []}
    for position,piece in self.gameboard.items():
        if type(piece) == King:
            kingDict[piece.Color] = position
        print(piece)
        pieceDict[piece.Color].append((piece,position))
    #white
    if self.canSeeKing(kingDict[WHITE],pieceDict[BLACK]):
        self.message = "White player is in check"
    if self.canSeeKing(kingDict[BLACK],pieceDict[WHITE]):
        self.message = "Black player is in check"
　
def canSeeKing(self,kingpos,piecelist):
    #checks if any pieces in piece list (which is an array of (piece,position) tuples) can see the king in kingpos
    for piece,position in piecelist:
        if piece.isValid(position,kingpos,piece.Color,self.gameboard):
            return True
```

とはいえ、これだけでは十分ではありません。

- チェックメイトの判定
- ステイルメイトの判定
- 自らチェックされに行くような手の禁止

この 3 つを追加していきたいと思います。

<br>

## どれを先にやる？

チェックメイト・ステイルメイトは、動けないという状態を共有しているので、

つながりが深く、同じような書き方ができると考えられます。

これらの判定には、**誰がどこに動けるかの情報**が使われます。

自らチェックされに行くような手を先に禁止しておくことで、駒がどこに移動可能かという情報が整理されるので、

先にこちらに取り掛かりたいと思います。

<br>

## 自らチェックされに行くような手の禁止

駒の移動先の可能性を制御しているのは、`isValid()`メソッドです。

```py:pieces.py
def isValid(self,startpos,endpos,Color,gameboard):
    if endpos in self.availableMoves(startpos[0],startpos[1],gameboard, Color = Color):
        return True
    return False
```

今からこれをチェックと関連づけたいのに、これは`Piece`
{{% tooltip %}}クラス((オブジェクトの型、設計図のようなもの{{% /tooltip %}}
内のメソッドですね。

`Game`クラスにある`isCheck()`などをこちらに取り込むことができません。

ということで、このメソッドに`Game`クラス内にお引っ越ししていただきましょう。

（紛らわしいので`isValidMove()`と改名します。）

ただし、住所が変わりますので、`self`の意味が変わります。

`self`が何かについては、解説してくれているサイトが多くあるのですが、かいつまんで言うと、

クラス内のメソッドが`self`といったとき、それはその所属するクラスをもとに生成された
{{% tooltip %}}インスタンス（オブジェクト）((クラスをもとに作られた分身のようなもの{{% /tooltip %}}
を指します。

`Piece`クラス内にいたとき、`self`はポーンやナイトなど駒のことを指すわけです。

メソッド内で`self`を使っているので、`Game`クラス内に移動した後は新たに駒を示す引数を追加する必要があります。

```py:main.py {hl_lines=[3, 5], inline_hl=[0:["4-5"], 1:[3]]}
class Game:
    ...
    def isValidMove(self, piece, startpos, endpos, Color, gameboard):
        '''pieceのstartpos -> endposの動きが可能であるときTrueを返す'''
        if endpos in piece.availableMoves(startpos[0], startpos[1], gameboard, Color = Color):
            return True
        return False
```

ここで引数について、`piece`は動く駒、`startpos`と`endpos`は開始位置と終了位置、`Color`は駒色、`gameboard`は盤面のことです。

さて、「自らチェックされに行くような手を禁止する」というのは、

`piece`がキングで、キングの`endpos`が敵の攻撃範囲になければいいということでしょうか？

いえ、実は動く駒はキングとは限りません。

キングの盾になっていた駒が動くことでキングを攻撃にさらすこともあります。

だから、駒の種類を限らず「**その駒が仮にその動きをしたとすると、その場合チェック状態になるか**」を見ればいいのです。

### チェック状態にあるかどうかを判定させる

ところで、さきほどの`isCheck()`は返り値を取りません。

駒色を引数にとり、その色側がチェックされているときに`True`を返すようにしましょう。

```py:main.py {hl_lines=[1, 2, "10-12", "14-17", 19], ins=[1, "3-5", "7-9"], del=[0, 2, 6], inline_hl=[1:["4-5"], 3:["0-4"], 7:["0-4"]]}
def isCheck(self):
def isCheck(self, color):
    king = King
    kingDict = {}
    pieceDict = {BLACK : [], WHITE : []}
    for position, piece in self.gameboard.items():
        if type(piece) == King:
            kingDict[piece.Color] = position
        pieceDict[piece.Color].append((piece, position))
    if self.canSeeKing(kingDict[WHITE], pieceDict[BLACK]):
    if color == WHITE:
        if self.canSeeKing(kingDict[WHITE], pieceDict[BLACK]):
            self.message = "White player is in check"
            return True
    if self.canSeeKing(kingDict[BLACK], pieceDict[WHITE]):
    elif color == BLACK:
        if self.canSeeKing(kingDict[BLACK], pieceDict[WHITE]):
            self.message = "Black player is in check"
            return True
```

うーん、工夫すればもうちょっと簡潔に書けますね。

コードの頭に一文追加します。

```py:main.py {hl_lines=[1, "12-14"], inline_hl=[1:[7_"11-13"], 2:[4]]}
opponent = {WHITE: BLACK, BLACK: WHITE}
　
class Game:
    ...
    def isCheck(self, color):
        kingDict = {}
        pieceDict = {BLACK : [], WHITE : []}
        for position, piece in self.gameboard.items():
            if type(piece) == King:
                kingDict[piece.Color] = position
            pieceDict[piece.Color].append((piece, position))
        if self.canSeeKing(kingDict[color], pieceDict[opponent[color]]):
            self.message = f"{color} player is in check"
            return True
```

これで`isCheck()`はチェック判定用に使えるようになりました。

「白はチェックされてる？」と聞けば「白はね、されてるよ」とか「白はね、されてるとはいえないみたいだよ」とか答えてくれます。

<br>

ところで、動いた後の盤面を仮定して、その盤面上でチェック判定をするんでした。

ところが`isCheck()`（と`canSeeKing()`）で使われている盤面は`self.gameboard`です。

これは**現在の本当の**盤面なので、仮定された盤面は使えません。

```py:main.py {hl_lines=[1, 2, 5, 6, 10, 11, 15, 16, 18, 19], ins=[1, 3, 5, 7, 9], del=[0, 2, 4, 6, 8], inline_hl=[1:["6-7"], 2:["5-6"], 5:["17-18"], 7:["8-9"], 8:["13-14"]]}
def isCheck(self, color):
def isCheck(self, color, gameboard):
    kingDict = {}
    pieceDict = {BLACK : [], WHITE : []}
    for position, piece in self.gameboard.items():
    for position, piece in gameboard.items():
        if type(piece) == King:
            kingDict[piece.Color] = position
        pieceDict[piece.Color].append((piece, position))
    if self.canSeeKing(kingDict[color], pieceDict[opponent[color]]):
    if self.canSeeKing(kingDict[color], pieceDict[opponent[color]], gameboard):
        self.message = f"{color} player is in check"
        return True
　
def canSeeKing(self, kingpos, piecelist):
def canSeeKing(self, kingpos, piecelist, gameboard):
    for piece, position in piecelist:
        if piece.isValid(position, kingpos, piece.Color, self.gameboard):
        if piece.isValid(position, kingpos, piece.Color, gameboard):
            return True
```

引数を追加しました。

もし`self.gameboard`を使いたくなったらこの引数に指定してしまえば大丈夫です。（`gameboard=self.gameboard`）

### 盤面の更新

駒の動きを指定した後、盤面は更新されますが、それはどの部分で実行されているのでしょうか。

`gameboard`を頼りに探すと、`main()`内にあります。

```py:main.py
self.gameboard[endpos] = self.gameboard[startpos]
del self.gameboard[startpos]
```

終了位置に開始位置の駒を移し、開始位置の駒を消すという処理が盤面の更新になります。

### 盤面を仮定する

盤面を仮定するには、新たな変数を作ってそれに`self.gameboard`をコピーし、

新たな盤面に対して盤面を更新すればいいでしょう。

その後`isCheck()`にかけ、`True`になればその手は禁止します。

```py:main.py {hl_lines=["8-15"]}
from copy import copy
...
class Game:
    ...
    def isValidMove(self, piece, startpos, endpos, Color, gameboard):
        '''pieceのstartpos -> endposの動きが可能であるときTrueを返す'''
        if endpos in piece.availableMoves(startpos[0], startpos[1], gameboard, Color = Color):
            # 盤面の複製
            gameboardTmp = copy(gameboard)
            # 複製した盤面の更新
            gameboardTmp[endpos] = gameboardTmp[startpos]
            del gameboardTmp[startpos]
            # チェック判定
            if self.isCheck(piece.Color, gameboardTmp):
                return False
            else:
                return True
        else:
            return False
```

引数`Color`と`piece.Color`は同じ意味なので統一しても構わないでしょう。

```py:main.py {hl_lines=[1, 2, 4, 5], ins=[1, 3], del=[0, 2], inline_hl=[0:["10-11"], 3:["19-20"]]}
def isValidMove(self, piece, startpos, endpos, Color, gameboard):
def isValidMove(self, piece, startpos, endpos, gameboard):
    '''pieceのstartpos -> endposの動きが可能であるときTrueを返す'''
    if endpos in piece.availableMoves(startpos[0], startpos[1], gameboard, Color = Color):
    if endpos in piece.availableMoves(startpos[0], startpos[1], gameboard, Color=piece.Color):
        ...
```

ところで、`copy()`は組み込み関数ではないので、`import`が必要となります。

<details>
<summary>:question:なぜ直接代入しない？</summary>
<div>
<br>

`copy()`を使用しないと、盤面の更新をした際にもとの盤面も一緒に書き換えられてしまいます。

これは
{{% tooltip %}}ディクショナリ((キーと値が 1 対 1 に対応する形でまとめられた構造{{% /tooltip %}}
がミュータブル（変更可能）であることから起こります。

リストでも同様のことは起こります。

```py {linenos=false}
>>> a = [1, 2, 3]
>>> b = a
>>> b.append(4)
>>> a
[1, 2, 3, 4]
```

</div>
</details>

<br>

今までの編集で`isCheck()`や`isValidMove()`の引数が変わっているので、

それらのメソッドを使っている関係各所の引数も調整しておきましょう。

例えば、`main()`はこのようになります。

```py:main.py {hl_lines=[19, 23]}
def main(self):
　
    while True:
        self.printBoard()
        print(self.message)
        self.message = ""
        startpos, endpos = self.parseInput()
        try:
            target = self.gameboard[startpos]
        except:
            self.message = "could not find piece; index probably out of range"
            target = None
　
        if target:
            print("found "+str(target))
            if target.Color != self.playersturn:
                self.message = "you aren't allowed to move that piece this turn"
                continue
            if self.isValidMove(target, startpos, endpos, self.gameboard):
                self.message = "that is a valid move"
                self.gameboard[endpos] = self.gameboard[startpos]
                del self.gameboard[startpos]
                self.isCheck(target.Color, self.gameboard)
                ...
```

---

長くなってしまったので、今回はこのへんで区切りたいと思います。

{{< pstlk 次回 chess-app-devel-5 >}}はチェックメイトの判定についてです。

ではまた:wave: