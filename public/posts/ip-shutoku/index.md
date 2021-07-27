---
title: "JavaScript だけで無料で IP アドレスを取得する方法"
date: 2020-05-24T12:00:00+09:00
lastmod: 2020-05-24T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [HTML, ツール]
draft: false
---

[Google Adsense](https://www.google.com/adsense/start) のアドセンス狩りなどの被害から自分のウェブサイトを守るために、

容疑者の IP アドレスを特定することが必要になります。

しかし、サーバがないに等しい静的サイトではサーバサイドの言語である PHP を使用することができません。

今回は、

- PHP を使わずに JavaScript と外部 API を用いて、無料で IP アドレスを取得する方法
- 取得した IP アドレスを Google Analytics 画面に表示させる方法

をご紹介します。

<!--more-->

{{< relpos adsense-chui >}}

<br>

## IP アドレスを取得する

[ipinfo.io](https://ipinfo.io/) というサービスを利用します。

`script`タグを JavaScript で動的に生成して、`src`属性に`https://ipinfo.io?callback=callback`を指定します。

この`script`タグを、`head`タグの末尾に追加すると、API から JSONP 形式のデータが`callback`関数を通して取得できます。

```html
<script>
    var script = document.createElement('script');
    script.src='https://ipinfo.io?callback=callback'
    document.head.appendChild(script);

    function callback(data) {
        console.log(data.ip);
    };
    // またはアロー関数を使って
    // callback = data => console.log(data.ip);
</script>
```

これでコンソールに IP アドレスが表示されるようになります。

<details>
<summary>アロー関数について</summary>
<br>

{{< img src=arrow-func alt="アロー関数" >}}

</details>

<br>

## コールバック関数外部から参照する

`data.ip`という値は`callback`関数の外部から参照できないので、次のように書くことはできません。

```html {hl_lines=[7, 10]}
<script>
    var script = document.createElement('script');
    script.src='https://ipinfo.io?callback=callback'
    document.head.appendChild(script);

    function callback(data) {
        const ip_adress = data.ip;
    };
    
    console.log(ip_adress);
</script>
```

```html {linenos=false}
-> ip_adress is not defined
```

これを解消するために、`WeakMap`を使用します。

`WeakMap`は連想配列の強化版で、{{% pstlk "Hugo の`.Scratch`" hugo-scratch %}}のようなものです。

これを使えば、関数の外部からも関数内の値を参照できるようになります。

```html {hl_lines=["2-4", 10]}
<script>
    var wm = new WeakMap;
    var obj = {};
    callback = data => wm.set(obj, data.ip);

    var script = document.createElement('script');
    script.src='https://ipinfo.io?callback=callback'
    document.head.appendChild(script);

    console.log(wm.get(obj));
</script>
```

<br>

ところが、これだけではまだコンソールに表示されません。

これは、行動フローとしてこの`script`タグの処理（`console.log(wm.get(obj));`まで）がすべて終わった後に、

新たに生成された`script`タグが IP アドレスを取得しているからです。

つまり、

1. IP アドレスを取得するための`script`タグを生成
1. `console.log()`
1. 新たに生成された`script`タグが IP アドレスを取得

という流れになってしまっています。

`window.onload`を使って、HTML の読み込みが完了してから`console.log()`を実行させます。

```html {hl_lines=[10], inline_hl=[0:["0-6"]]}
<script>
    var wm = new WeakMap;
    var obj = {};
    callback = data => wm.set(obj, data.ip);

    var script = document.createElement('script');
    script.src='https://ipinfo.io?callback=callback'
    document.head.appendChild(script);

    window.onload = () => console.log(wm.get(obj));
</script>
```

<br>

## Google Analytics と連携させる

[Google Analytics](https://analytics.google.com/)の画面から、

管理 > カスタム定義 > カスタムディメンションを選択します。

{{< img src=ga-custom-dim alt="Google Analytics カスタムディメンション" >}}

「新しいカスタムディメンション」をクリックし、内容を入力します。

「名前」は任意で、「範囲」を「ヒット」、「アクティブ」はチェックをします。

保存を押したあと、サンプルコードが出てきて、`'dimension1'`などと書かれた部分があるのですが、

その数字は後ほど使います。

<br>

さて、コードを編集します。

Google Analytics のトラッキングコードに gtag.js を使っているなら、

次のようなコードが`head`タグの間に挿入されていると思います。

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-000000000-0"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-000000000-0');
</script>
```

カスタムディメンションを使用するために、次のように編集します。

```html {hl_lines=["8-13"]}
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-000000000-0"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-000000000-0', {
        'custom_map': {
            'dimension1': 'ip'
        },
        'ip': wm.get(obj)
    });
</script>
```

これをさきほどのコードとあわせます。

```html {hl_lines=["4-12"]}
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-000000000-0"></script>
<script>
    var wm = new WeakMap;
    var obj = {};
    callback = data => wm.set(obj, data.ip);

    var script = document.createElement('script');
    script.src='https://ipinfo.io?callback=callback'
    document.head.appendChild(script);

    window.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-000000000-0', {
            'custom_map': {
                'dimension1': 'ip'
            },
            'ip': wm.get(obj)
        });
    };
</script>
```

これで取得した IP アドレスが Google Analytics に認識されるようになります。

<br>

## Google Analytics から確認できるようにする

Google Analytics の画面から、

カスタム > カスタムレポート > 新しいカスタムレポート を選択します。

ディメンションの詳細 > ディメンションの追加 から、さきほど設定したカスタムディメンションを選択します。

例えば、IP という名前にしていれば、IP と検索すれば出てきます。

他の項目を設定して保存すれば、カスタムレポートから IP アドレスを確認することができるようになります。

---

お役に立てれば幸いです。

では:wave: