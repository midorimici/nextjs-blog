---
title: "【日本語・フランス語・ラテン語】英語以外でコーディングしてみた"
date: 2020-03-18T12:00:00+09:00
lastmod: 2020-07-02T12:00:00+09:00
categories: [プログラミング, プログラミング一般]
tags: [言語, プログラミング, Python]
draft: false
---

以前、こんな記事を読みました。

→ [「プログラミング＝英語」という状況は正しくない。多言語でコードを書ける世界が求められている｜WIRED.jp](https://wired.jp/2019/08/04/coding-is-for-everyoneas-long-as-you-speak-english/)

ということで、今回は英語以外で Python をコーディングして遊んでみたいと思います！

<!--more-->

<br>

## 翻訳元となる英語のコード

素因数分解をするプログラムを英語の Python で書いてみます。

```py
'This is a program which implements prime factorization.'
　
　
from math import ceil, sqrt
　
　
def is_prime(n):
    'judge if n is a prime'
    if n == 2: return True
    if n % 2 == 0: return False
    for i in range(3, ceil(sqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    return True
　
　
def primes(n, start):
    'primes from start to n'
    for i in range(start, n + 1):
        if is_prime(i):
            yield i
　
　
def prime_factorize(n, start):
    'implement prime factorization'
    while n % 2 == 0 and n != 2:
        print('2 *' , end=' ')
        n //= 2
    for i in primes(ceil(sqrt(n)), start):
        if n % i == 0:
            print(f'{i} *', end=' ')
            prime_factorize(int(n // i), i)
            break
    if is_prime(n):
        print(int(n))
　
　
while True:
    num = input('Input an integer larger than 1.\n')
    if num.isdigit() and int(num) > 1:
        break
    else:
        print('That is invalid input. Try again.')
　
　
print('=')
prime_factorize(int(num), 2)
```

自作のカッペリーニコードですがお気になさらず！

ちなみに出力はこんな感じです。

{{< img src=jikkou_gamen ext=png alt=実行画面 >}}

{{< relpos pcap-report >}}

<br>

## 各言語に翻訳

翻訳の精度は目をつむってください笑

### 日本語

私にとって一番馴染み深い日本語から。

```txt {lang="ja, 0"}
'これは素因数分解を実行するプログラムです。'
　
　
数学 から 天井関数, 平方根 を読み込む
　
　
関数 素数である(イ) を定義する。
    'イが素数かどうか判定する'
    もし イ == 2 ならば、 真 を返す
    もし イ % 2 == 0 ならば、 偽 を返す
    範囲(3, 天井関数(平方根(イ))) + 1, 2) の中にある それぞれの ロ について、
        もし イ % ロ == 0 ならば、
            偽 を返す
    真 を返す
　
　
関数 素数集(イ, 始め) を定義する。
    '始めからイまでの素数'
    範囲(始め, イ + 1) の中にある それぞれの ロ について、
        もし 素数である(ロ) ならば、
            ロ を生成する
　
　
関数 素因数分解する(イ, 始め) を定義する。
    '素因数分解を実行する'
    イ % 2 == 0 かつ イ != 2 である間、
        表示する('2 *' , 文末=' ')
        イ //= 2
    素数集(天井関数(平方根(イ)), 始め) の中にある それぞれの ロ について、
        もし イ % ロ == 0 ならば、
            表示する(f'{ロ} *', 文末=' ')
            素因数分解する(整数(イ // ロ), ロ)
            脱出する
    もし 素数である(イ) ならば、
        表示する(整数(イ))
　
　
真 である間、
    数 = 入力する('１より大きい整数を入力してください。\n')
    もし 数.数字である() かつ 整数(数) > 1 ならば、
        脱出する
    それ以外ならば、
        表示する('無効な入力です。もう一度試してください。')
　
　
表示する('=')
素因数分解する(整数(数), 2)
```

なるほど、日本語は後置修飾型の言語だということを再認識しました。

「関数」「もし」を省くと、一見するだけでは条件文なのか定義文なのか反復処理なのかわからないですね。

**可読性のためには語順が大切**なんですね。

ところでクラス内部だと「関数」は「メソッド」になるのでしょうか…

そう考えると、`定義する 素数である(イ):`みたいに倒置した形で書いていくほうがいいのかも。

あと、書くときは地味に**全角と半角の切り替えが辛い**ので、やるなら全角で統一したほうがいいですね。

ちなみに、日本語プログラミング言語には[なでしこ](https://nadesi.com/top/)や[プロデル](https://rdr.utopiat.net/)などがあります。

### フランス語

フランスの他にもアフリカ西北部やカナダの一部などで話され、多くの国際機関の公用語としても用いられているフランス語です。

文法とか間違ってたらごめんなさい:pray:

```txt {lang="fr, 1"}
« C'est un programme qui exécute factorisation en nombres premiers. »
　
　
de math importer plafond, rccr
　
　
déf être_premier(n):
    « juger si n est un nombre premier »
    si n == 2: retourner Vrai
    si n % 2 == 0: retourner Faux
    pour i dans portée(3, plafond(rccr(n)) + 1, 2):
        si n % i == 0:
            retourner Faux
    retourner Vrai
　
　
déf premiers(n, début):
    « premiers de début à n »
    pour i dans portée(début, n + 1):
        si être_premier(i):
            produire i
　
　
déf factoriser_en_premiers(n, début):
    « exécuter factorisation en nombres premiers »
    pendant n % 2 == 0 et n != 2:
        imprimer(«2 *» , fin=« »)
        n //= 2
    pour i en premiers(plafond(rccr(n)), début):
        si n % i == 0:
            imprimer(f«{i} *», fin=« »)
            factoriser_en_premiers(entier(n // i), i)
            sortir
    si être_premier(n):
        imprimer(entier(n))
　
　
pendant Vrai:
    nomb = introduire(«Introduisez un entier plus grand qu'un.\n»)
    si nomb.estchiffre() et entier(nomb) > 1:
        sortir
    sinon:
        imprimer(«C'est entrée non valide. Essayez encore.»)
　
　
imprimer(«=»)
factoriser_en_premiers(entier(nomb), 2)
```

`rccr`は racine carrée （平方根）、`déf`は définir を略したものです。

ここには出ていないのですが、`not`とか面白そう。

`si ne a < b et a*b > 2 pas:`みたいな。

ne と pas で挟まれた部分が否定されるので、括弧いらずです。

フランス語のプログラミング言語には[Linotte](http://langagelinotte.free.fr/)などがあるようです。

動詞は不定形としましたが、これ見た感じだと命令形がいいのかな…？

### ラテン語

何世紀にも渡って今日のヨーロッパ・北アフリカの大部分を支配下に置いた古代ローマ帝国の公用語で、

その後も学術用語として広く用いられてきたラテン語です。

```txt {lang="la, 2"}
'Hic programma quī execūtat factorizatiōnem numerum prīmum.'
　
　
dē mathēmatica importā tēctum, rdqd
　
　
dēf prīmus_est(n):
    'utrum n prīmus necne iūdicō'
    sī n == 2: redde Vērus
    sī n % 2 == 0: redde Falsus
    per i in spatium(3, tēctum(rdqd(n)) + 1, 2):
        sī n % i == 0:
            redde Falsus
    redde Vērus
　
　
dēf prīmī(n, initium):
    'prīmī ab initium ad n'
    per i in spatium(initium, n + 1):
        sī prīmus_est(i):
            dā i
　
　
dēf prīmum_factorit(n, initium):
    'factorizatiōnem numerum prīmum execūtō'
    dum n % 2 == 0 et n != 2:
        imprime('2 *' , finis=' ')
        n //= 2
    per i in prīmī(tēctum(rdqd(n)), initium):
        sī n % i == 0:
            imprime(f'{i} *', finis=' ')
            prīmum_factorit(int(n // i), i)
            trānsī
    sī prīmus_est(n):
        imprime(int(n))
　
　
dum Vērus:
    num = scrīptum('Scrībe numerum integerum maior quam I.\n')
    sī num.numerusest() et int(num) > 1:
        trānsī
    alius:
        imprime('Istud scrīptum invalidus est. Cōnāre iterum.')
　
　
imprime('=')
prīmum_factorit(int(num), 2)
```

格変化、合ってるかなあ…笑

`rdqd`は radix quadrata 、`dēf`は dēfīni の略。

せっかくなので、もうちょっとクラシックにしてみますか。

```txt {lang="LA, 3"}
'HIC PROGRAMMA QVI EXECVTAT FACTORIZATIONEM NVMERVM PRIMVM'
　
　
DE MATHEMATICA IMPORTA TECTVM, RDPD
　
　
DEF PRIMVS_EST(N):
    'VTRVM N PRIMVS NECNE IVDICO'
    SI N == II: REDDE VERVS
    SI N % II == NIHIL: REDDE FALSVS
    PER P IN SPATIVM(III, TECTVM(RDPD(N)) + I, II):
        SI N % P == NIHIL:
            REDDE FALSVS
    REDDE VERVS
　
　
DEF PRIMI(N, INITIVM):
    'PRIMI AB INITIVM AD N'
    PER P IN SPATIVM(INITIVM, N + I):
        SI PRIMVS_EST(P):
            DA P
　
　
DEF PRIMVM_FACTORIT(N, INITIVM):
    'FACTORIZATIONEM NUMERVM PRIMVM EXECVTO'
    DVM N % II == NIHIL ET N != II:
        IMPRIME('II *' , FINIS=' ')
        N //= II
    PER P IN PRIMI(TECTVM(RDPD(N)), INITIVM):
        SI N % P == NIHIL:
            IMPRIME(F'{P} *', FINIS=' ')
            PRIMVM_FACTORIT(INT(N // P), P)
            TRANSI
    SI PRIMVS_EST(N):
        IMPRIME(INT(N))
　
　
DVM VERVS:
    NVM = SCRIPTVM('SCRIBE NVMERVM INTEGERVM MAIOR QVAM I\N')
    SI NVM.NVMERVSEST() ET INT(NVM) > I:
        TRANSI
    ALIVS:
        IMPRIME('ISTVD SCRIPTVM INVALIDVS EST CONARE ITERVM')
　
　
IMPRIME('=')
PRIMVM_FACTORIT(INT(NVM), II)
```

もともとは単語の分かち書きもしないのですが、それだとプログラムが動かなくなりそうだし、すでに十分暗号です。笑

ちなみにラテン語のプログラミング言語には[Lingua::Romana::Perligata](https://metacpan.org/pod/Lingua::Romana::Perligata)という、Perl のラテン語版があるそうです。

<br>

## 言語の壁

個人開発なら面白そうですが、今のところはお仕事はやっぱり英語のほうが喜ばれるでしょう。

もちろんグローバルな作業環境では英語のプログラミング言語を使っていくのが共有しやすくていいんでしょうが、

ローカルの地元の人しかいなくて英語を全然使わないような環境なら、わざわざ英語でプログラミングする必要がないと思うんですよね。

あと、のちのち英語版を使うことになるとしても、他言語版は教育目的で使えると思います。

英語ができないからプログラミングができない！となってしまうのは非常にもったいないことだと思うので、

[BabylScript](http://www.babylscript.com/)みたいなのが増えてくると素敵だなと思います。

最後までありがとうございました！

それではまた:wave: