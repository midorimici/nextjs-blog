import type { EntryFields, Asset } from 'contentful'

export type ContentfulPostFields = {
  slug: EntryFields.Symbol
  title: EntryFields.Symbol
  date: EntryFields.Date
  lastmod: EntryFields.Date
  topics: EntryFields.Symbol[]
  katex: EntryFields.Boolean
  published: EntryFields.Boolean
  assets: Asset[]
  summary: EntryFields.Text
  content: EntryFields.Text
}

export type ContentfulAboutPostFields = {
  title: EntryFields.Symbol
  profile: Asset
  content: EntryFields.Text
}
