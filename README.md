# みどりみちのブログ

## MDX Components

👀 [`components/mdx`](components/mdx)

### affiliate

`affiliate` -> [`Affiliate`](components/mdx/affiliate.tsx)

```ts
asin: string
id: string
label: string   // 商品名
```

```md
<affiliate asin="xxx" id="xxx" label="xxx" />
```

### code-block

`code` -> [`CodeBlock`](components/mdx/code-block.tsx)

```ts
children: string
className: string
name?: string       // コードのファイル名
hide_nums?: boolean = false // 行番号非表示
hl_lines?: string   // ハイライト行 numbers
ins?: string        // 挿入行 numbers
del?: string        // 削除行 numbers
inline_hl?: string  // 部分ハイライト 行番号:単語番号 number ':' numbers (';' number ':' numbers)*
/*
number = [0-9]+
range = number '-' number
number_or_range = number | range
numbers = number_or_range (',' number_or_range)*
*/
```

````md
```lang name=xxx.lang hl_lines=1,2-3 inline_hl=1:2-3;2:1,5-6
xxx
```
````

### fukidashi

`fukidashi` -> [`Fukidashi`](components/mdx/fukidashi.tsx)

```ts
children: string | ReactElement
face?: 'ase' | 'neut' | 'normal' = 'normal'   // 画像の種類
```

```md
<fukidashi>xxx</fukidashi>
<fukidashi face='ase'>xxx</fukidashi>
```

### icode

`code` がコードブロックとして解析されるため、インラインコード用に。

```ts
children: string
```

```md
<icode>xxx</icode>
```

### manga

`manga-text` と一緒に使う。

`manga` -> [`Manga`](components/mdx/manga.tsx)

```ts
src: string   // 画像のファイル名（拡張子なし）
alt: string   // 代替テキスト
children: Element
```

### manga-text

`manga` と一緒に使う。

`manga-text` -> [`MangaText`](components/mdx/manga-text.tsx)

```ts
x: number     // 左端からの距離
y: number     // 上端からの距離
text: string  // 表示する内容 マークダウン・tltp 対応
size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' = 'xl'  // テキストの大きさ
color?: string    // テキストの色
```

```md
<manga src="xxx" alt="xxx">

<manga-text x={d} y={d} text="xxx" />

</manga-text>
```

### postimage

`postimage` -> [`PostImage`](components/mdx/post-image.tsx)

```ts
src: string   // 画像のファイル名（拡張子なし）
alt: string   // 代替テキスト
```

```md
<postimage src="xxx" alt="xxx" />
```

### pstlk

`pstlk` -> [`PostLink`](components/mdx/pstlk.tsx)

```ts
label: string   // 表示するテキスト
to: string      // リンク先のスラッグ
```

```md
<pstlk label="xxx" to="xxx" />
```

### relpos

`relpos` -> [`RelatedPost`](components/mdx/relpos.tsx)

```ts
link: string  // リンク先のスラッグ
```

```md
<relpos link="xxx" />
```

### sandbox

`sandbox` -> [`Sandbox`](components/mdx/sandbox.tsx)

```ts
name: string  // 代替テキストに使われるプロジェクト名
link: string  // リンク URL
```

```md
<sandbox name="xxx" link="xxx" />
```

### tltp

`tltp` -> [`Tooltip`](components/mdx/tltp.tsx)

```ts
label: string   // もとのテキスト
children: string | ReactElement   // ツールチップ内のテキスト マークダウン対応
```

```md
<tltp label="xxx">xxx</tltp>
```

### tweet

```ts
id: string
```

```md
<tweet id="xxx" />
```

### video

`video` -> [`Video`](components/mdx/video.tsx)

```ts
src: string   // 動画のファイル名（拡張子なし）
control?: boolean = false   // コントロール領域を表示する
```

```md
<video src="xxx" />
<video src="xxx" control />
```

### yout

`yout` -> [`YouTube`](components/mdx/youtube.tsx)

```ts
id: string
```

```md
<yout id="xxx" />
```
