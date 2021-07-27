---
title: 'チェスアプリ開発(9) 駒の動きをアニメーションにする'
date: 2020-04-22T12:00:00+09:00
lastmod: 2020-09-21T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, OpenGL, アプリ開発, チェス]
katex: true
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 9 回です。

{{< pstlk 前回 chess-app-devel-8 >}}はマウス操作で駒を動かせるようにしました。

しかし、その駒の移動がカクカクしているので、

今回は駒の移動にアニメーションを追加してスムーズに動いているように表示させます。

<!--more-->

<br>

## 完成イメージ

{{< img src=../chess-app-devel-8/goal ext=gif alt=完成図 width=300 >}}

もともといたマスからクリックしたマスまでスムーズに移動しています。

<br>

## GLUT でアニメーションさせる

GLUT でアニメーションを実現するには、一定時間後に指定した関数を実行する`glutTimerFunc()`を使う方法と、

プログラムが待ち時間にあるときに指定した関数を実行する`glutIdleFunc()`を使う方法があります。

今回は後者を使っています。

マウスが移動先のマスをクリックしたときにアニメーションが始まり、

その時点からの経過時間によって駒の位置が変化します。

アニメーション中であることを示す変数`self.moving`と、経過時間を表す変数`self.time`を追加します。

```py:main.py {hl_lines=[2, 8, 9, 10, "14-22", 28, "33-38", "53-56"]}
...
from time import sleep
...
　
class Game:
    def __init__(self):
        ...
        # アニメーション
        self.moving = False
        self.time = 1
        ...
    ...
　
    def idle_move(self):
        '''駒が動く時のアニメーション'''
        sleep(1.0 / 100)
        self.time += 1
        if self.time >= 10:
            self.moving = False
            glutIdleFunc(None)          # アニメーションの無効化
            glutMouseFunc(self.mouse)   # マウス操作の有効化
        glutPostRedisplay()
　
...
　
    def draw(self):
        ...
        if self.time == 1:
            self.main()
　
        ...
　
        if self.moving:
            # 動き中の駒を描画する
            if self.endpos in self.gameboard:
                glEnable(GL_TEXTURE_2D)
                draw_img(..., piece_ID[self.gameboard[self.startpos if self.time == 0 else self.endpos].name])
                glDisable(GL_TEXTURE_2D)
        ...
　
    def mouse(self, button, state, x, y):
        ...
        # 左クリック
        if (button == GLUT_LEFT_BUTTON
                and state == GLUT_DOWN):
            try:
                # 行先選択
                if (self.select_dest
                        and self.parse_mouse() in self.valid_moves(
                            self.gameboard[self.startpos], self.startpos, self.gameboard)):
                    self.select_dest = False
                    self.endpos = self.parse_mouse()
                    self.time = 0
                    self.moving = True
                    glutIdleFunc(self.idle_move)    # アニメーションの有効化
                    glutMouseFunc(None)             # マウス操作の無効化
                # 駒選択
                elif ...
```

`sleep`というのは、指定時間プログラムを待機させるための関数です。

これを指定しないと目にも止まらぬ速さで変化してしまうため、アニメーションの意味がありません（マシンのスペックにもよりますが…）。

そもそもアニメーションというのは、パラパラ漫画のように時間差で違う画像を表示させることで動いているように見せているだけです。

`idle_move()`では、1/100 秒（マシンのスペックによって変化する）ごとに１コマ進めていき（`self.time += 1`）、

それが 10 回行われたらアニメーションを終了させます。

26 行目の`if self.time == 1:`は必須ではありませんが、パフォーマンスの向上のためにつけています。

`idle_move()`が`glutPostRedisplay()`を毎回のアニメーションで 10 回も呼び出す（つまり`draw()`も 10 回呼び出される）のですが、

`main()`は１回だけ通れば十分です。

これの関係で、`self.time == 0`のときのみ動く駒の存在するとされる位置は`self.startpos`に、

それ以外のときは`self.endpos`に入っています。

<br>

## 駒の時間-位置関数を指定する

さきほどのコードの 37 行目の`draw_img()`の第一、第二引数にはそれぞれ、画像を描画する位置の x 座標と y 座標が入ります。

ここにどんな関数を入れるかによって、動き方が変わってきます。

とりあえず、直線的な動きをさせてみます。

{{< img src=linear-interpolation ext=png alt=直線による補間 >}}

ちょっと数学の話です。

縦軸を $p$、横軸を $t$ としたとき、この赤のグラフは

$$ p = \frac{{\sf self.endpos} - {\sf self.startpos}}{10} t + {\sf self.startpos} $$

と表すことができます。

よって、

```py
draw_img(self.startpos[0] + (self.endpos[0] - self.startpos[0]) * self.time / 10,
    self.startpos[1] + (self.endpos[1] - self.startpos[1]) * self.time / 10,
    piece_ID[self.gameboard[self.startpos if self.time == 0 else self.endpos].name])
```

となります。

<details>
<summary>もっとなめらかな動きにしたいなら？</summary>

<br>

直線的な補間の場合、動き始めから終わりまでつねに同じ速さです。

正弦曲線（サインカーブ）を用いて、動き始めと終わりは減速させるようなもっとなめらかな動きをさせることができます。

{{< img src=sin-curve-interpolation ext=png alt=正弦曲線による補間 >}}

コードを導くには、しっかりとした（高校レベルぐらいの）数学の計算をやらなければならなりません。

（でも決してこの計算ができなければいけないわけではありません！）

正弦曲線 $ y = \sin x $ のグラフを拡大縮小・平行移動して、この赤いグラフに重なるようにします。

$ y = \sin x $ のグラフは２点 $ \left(-\frac{\pi}{2}, -1 \right), \left(\frac{\pi}{2}, 1 \right) $ を通ります。

この２点が変形後に $ (0, {\sf self.startpos}), (10, {\sf self.endpos}) $ に重なるようにします。

<br>

まず、拡大縮小操作をして幅と高さを合わせます。

幅が $ \frac{\pi}{2} - \left(-\frac{\pi}{2} \right) = \pi $ だったのを $10$ にするので、$x$ 軸方向に $ \frac{10}{\pi} $ 倍に拡大して

$$ y = \sin \left(\frac{\pi}{10} x \right) $$

高さが $ 1 - (-1) = 2 $ だったのを $ {\sf self.endpos} - {\sf self.startpos} $ にするので、

$y$ 軸方向に $ \frac{{\sf self.endpos} - {\sf self.startpos}}{2} $ 倍に拡大して

$$ y = \frac{{\sf self.endpos} - {\sf self.startpos}}{2} \sin \left(\frac{\pi}{10} x \right) $$

あとは平行移動をします。

今の変形で点 $ \left(-\frac{\pi}{2}, -1 \right) $ が

点 $ \left(-5, -\frac{{\sf self.endpos} - {\sf self.startpos}}{2} \right) $ に移ったので、

これが点 $ (0, {\sf self.startpos}) $ に来るようにします。

$x$ 軸方向に $ 5, y$ 軸方向に

$ {\sf self.startpos} + \frac{{\sf self.endpos} - {\sf self.startpos}}{2} $ だけ平行移動して

$$
\begin{aligned}
    y &= \frac{{\sf self.endpos} - {\sf self.startpos}}{2} \sin \left(\frac{\pi}{10} (x - 5) \right) \\\\ 
    &\ \ \ \ + {\sf self.startpos} + \frac{{\sf self.endpos} - {\sf self.startpos}}{2} \\\\ 
    &= {\sf self.startpos} + \frac{{\sf self.endpos} - {\sf self.startpos}}{2} \left(\sin \left(\frac{\pi}{10} (x - 5) \right) + 1 \right)
\end{aligned}
$$

これで式は出来上がりました。

これをコードに書くと

```py
draw_img(self.startpos[0] + ((self.endpos[0] - self.startpos[0]) / 2)
        * (sin(pi*(self.time - 5) / 10) + 1),
    self.startpos[1] + ((self.endpos[1] - self.startpos[1]) / 2)
        * (sin(pi*(self.time - 5) / 10) + 1),
    piece_ID[self.gameboard[self.startpos if self.time == 0 else self.endpos].name])
```

この場合`from math import pi, sin`が必要になります。

同様に計算ができれば他の曲線によって補間することもできます。

</details>

<br>

さて、ここで一度動作を見てみましょう。

{{< img src=before-masking ext=gif alt=駒ダブル width=300 >}}

おっと、移動中は移動先に表示される駒を隠さないといけませんね。

<br>

## 行先に表示される駒を隠す

これは{{< pstlk 第６回 chess-app-devel-6 >}}で用意した`dark_squares_list`を使えば簡単にできます。

```py:main.py {hl_lines=["4-9"]}
def draw(self):
    ...
    if self.moving:
        # 行先の駒を隠す
        if self.endpos in dark_squares_list:
            glColor(0.82, 0.55, 0.28)
        else:
            glColor(1.00, 0.81, 0.62)
        square(*self.endpos)
        # 動き中の駒を描画する
        if self.endpos in self.gameboard:
            glEnable(GL_TEXTURE_2D)
            draw_img(self.startpos[0] + ((self.endpos[0] - self.startpos[0]) / 2)
                * (sin(pi*(self.time - 5) / 10) + 1),
            self.startpos[1] + ((self.endpos[1] - self.startpos[1]) / 2)
                * (sin(pi*(self.time - 5) / 10) + 1),
            piece_ID[self.gameboard[self.startpos if self.time == 0 else self.endpos].name])
            glDisable(GL_TEXTURE_2D)
```

{{< img src=after-masking ext=gif alt=マスク後 width=300 >}}

いい感じですね。

ついでですが、開始位置がわかりやすいようにマスに色付けをします。

```py:main.py {hl_lines=["4-7"]}
def draw(self):
    ...
    draw_squares()
    # 移動開始位置のマスの色を変える
    if None not in self.startpos:
        glColor(0.0, 1.0, 0.0, 0.2)
        square(*self.startpos)
    ...
```

これで[完成イメージ](#完成イメージ)と同じような動作ができるようになりました。

---

アニメーションが追加されて、より迫力のある遊び心地になりました。

{{< pstlk 次回 chess-app-devel-10 >}}はチェスの特殊ルールのひとつであるアンパッサンを実装したいと思います。

読んでくれてありがとうございました。

では:wave: