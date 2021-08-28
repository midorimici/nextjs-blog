import type { EntryFields, Asset, Entry } from 'contentful'

export type ContentfulTopicFields = {
	id: string
	label: string
	logoUrl: string
}

export type ContentfulPostFields = {
	slug: EntryFields.Symbol
	title: EntryFields.Symbol
	date: EntryFields.Date
	lastmod: EntryFields.Date
	topics: Entry<ContentfulTopicFields>[]
	katex?: EntryFields.Boolean
	assets?: Asset[]
	summary?: EntryFields.Text
	content: EntryFields.Text
}

export type ContentfulAboutPostFields = {
	title: EntryFields.Symbol
	profile: Asset
	content: EntryFields.Text
}

export type PostFieldsToIndex = {
	slug: string
	title: string
	date: string
	lastmod: string
	topics: ContentfulTopicFields[]
	coverImageUrl: string
	summary: string
	content: string
}

export type PostFieldsToShow = {
	slug: string
	title: string
	date: string
	lastmod: string
	topics: ContentfulTopicFields[]
	katex?: boolean
	assets: Record<
		string,
		{
			url: string
			size: {
				width: number
				height: number
			} | null
		}
	>
	content: string
	toc: string
}
