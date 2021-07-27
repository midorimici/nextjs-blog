---
title: "PCAP – Certified Associate in Python Programming を受験した"
date: 2020-04-18T12:00:00+09:00
lastmod: 2020-04-18T12:00:00+09:00
categories: [プログラミング, プログラミング一般]
tags: [Python]
draft: false
---

この度 PCAP – Certified Associate in Python Programming という Python の資格試験に合格しました。

当時、日本でこの試験を受けたというレポートがほとんどなかったので、

今回は PCAP についてお話したいと思います。

<br>

## 日本における Python の資格試験

2020年4月現在、日本の Python の資格試験としては、

<!--more-->

一般社団法人Pythonエンジニア育成推進協会による[Python 3 エンジニア認定基礎試験](https://www.pythonic-exam.com/exam/basic)と[Python 3 エンジニア認定データ分析試験](https://www.pythonic-exam.com/exam/analyist)とがあります。

前者は「文法基礎を問う試験」であり、後者は「Pythonを使ったデータ分析の基礎や方法を問う試験」です。

しかし、日本では [Python Institute](https://pythoninstitute.org/) が実施している [Python Certifications](https://pythoninstitute.org/certification/) も国内から受験することができます。

<br>

## Python Certifications とは

Python Certifications には3段階のレベルがあり、

Python でのプログラミングにおける必要不可欠なコーディングスキルを測る [**PCEP**](https://pythoninstitute.org/certification/pcep-certification-entry-level/)、

オブジェクト指向プログラミングに必要となる基本的な概念や技術を測る [**PCAP**](https://pythoninstitute.org/certification/pcap-certification-associate/)、

ライブラリの選択やネットワークプログラミングなどのより発展的な技能を測る [**PCPP**](https://pythoninstitute.org/certification/pcpp-certification-professional/)（さらに2つに分かれる）があります。

{{< img src=python-certifications ext=png alt="Python Certifications 3 levels" >}}

PCEP を受験せずとも PCAP を受験することはできますが、

PCPP を受験するには PCAP に合格している必要があります。

（さらに、PCPP-32-2 を受験するには PCPP-32-1 が必要です。）

なお、不合格だった場合でももう1度無料で[再受験](https://pythoninstitute.org/pvue-testing-policies/)できます。

今回私が受けたのは PCAP です。

{{< relpos eigo-igai-coding >}}

<br>

## 申し込み方法

試験の予約は[Pearson VUE](https://home.pearsonvue.com/PythonInstitute)で行います。

こちらを参考に予約しました。

→ [試験の予約・予約変更・キャンセル方法 :: ピアソンVUE](https://www.pearsonvue.co.jp/test-taker/Tutorial/WebNG-Schedule.aspx)

受験できる試験会場も少なくなく、試験開始時間も15分ごとに指定できるので、スケジューリングがしやすかった印象です。

予約が完了すると、試験開始15分前には会場に到着していること、身分証明書を2種類用意することなどを求める旨のメールが届きます。

身分証明書は学生証とクレジットカードで大丈夫でした。

<br>

## 勉強方法

[**シラバス**](https://pythoninstitute.org/certification/pcap-certification-associate/pcap-exam-syllabus/)が用意されているので、

こちらを上から順番にさらいながら、わからないものがあればインターネットで調べて記事を読んで理解しました。

すでに[チェスアプリ開発](/categories/%E3%83%81%E3%82%A7%E3%82%B9%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/)である程度の知識は蓄わっていたのですが、

`yield`とか`hasattr()`とかはここではじめて知りました。

その後は、[公式サイト](https://pythoninstitute.org/certification/pcap-certification-associate/)から**サンプルテスト**のダウンロードができるので、そちらを3回ほど解きました。

40問中28問正解すれば合格なのですが、1回目は28問正解というギリギリ状態…！（そのときは予想以上に解けていたし合格ラインを超えるとは思っていなかったのですが笑）

しかし、テストの最後の部分に、「このサンプルテストは試験的に作成してみたもので、本番ではもっと簡単だよ」みたいなことが書かれていたので、じゃあ合格できるなと思いました。

2回目以降は安定的に30問以上解けるようになりました（まあ同じ問題なんですけどね）。

[公式推奨のレッスン](https://pythoninstitute.org/free-python-courses/)もあるようで、これを修了してからだと半額で受験できるみたいですよ。

<br>

## 試験当日

試験会場に到着すると、受験する試験の確認と本人確認、同意事項への署名の後、

荷物をロッカーに入れ、写真撮影をしてから試験室に入室しました。

試験はコンピュータに回答を入力していく形式です。

試験時間は60分間なのですが、ゆっくりめの見直しを含めても半分ぐらいで終わってしまったので、早めに退室しました。

メモ用紙も渡されましたがほとんど使いませんでした。

回答を提出するとデータが送られ、その場で採点結果が印刷されて渡されました。

その紙や、受験後に送られるメールには Certification Code が書かれており、

それを用いて指定されたページからアクセスすると証明書がダウンロードできます。

{{< img src=certificate alt=証明書 >}}

<br>

## 英語力は必要？

メインはやはりプログラムのコードですので、**試験自体はそこまで英語の読解力が求められるわけではありません。**

ただ、プログラミング関連の用語などは覚えておいたほうが解きやすいでしょう。

試験よりも、予約後に送られる重要事項を説明したメールの読解のほうが本格的な英語読解になります…。

[勉強方法](#勉強方法)でも紹介したシラバスやサンプルテストを見てみて、わからない単語の意味を把握しておけば大丈夫だと思います。

---

国際的に通用するし、英語力の証明にもなるかなーと思って受験してみたのですが、

PCAP を通して勉強になったこともありました。

資格の取得を考えている人は、ぜひ海外の資格試験も視野に入れてみてください。

参考になったらうれしいです。

ではまた:wave: