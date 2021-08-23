export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

export const existsGaId = GA_ID !== ''

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', GA_ID, {
    page_path: url,
  })
}

type Event = {
  action: string
  category: string
  label: string
  value: string
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value = '' }: Event) => {
  if (!existsGaId) { return }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
