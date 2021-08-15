import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAmazon } from '@fortawesome/free-brands-svg-icons'

export type AffiliateProps = {
  asin: string
  id: string
  label: string
}

/* eslint-disable @next/next/no-img-element */

const Affiliate = ({ asin, id, label }: AffiliateProps) => {
  return (
    <div className={`
      relative flex flex-col sm:flex-row gap-4
      p-4 my-4
      rounded-2xl
      cursor-pointer
      transition duration-300
      shadow hover:shadow-lg hover:bg-white
      hover:opacity-80
    `}>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.amazon.co.jp/gp/product/${asin}/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=${asin}&linkCode=as2&tag=midorimici06-22&linkId=${id}`}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      <img
        src={`//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=${asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=midorimici06-22`}
        alt={label}
      />
      <div className="flex flex-col justify-between">
        <div>{label}</div>
        <div className="flex gap-4 justify-center items-center p-4 rounded-2xl bg-yellow-500 text-white">
          <FontAwesomeIcon icon={faAmazon} size="lg" />
          Amazon でチェックする
        </div>
      </div>
    </div>
  )
}

export default Affiliate
