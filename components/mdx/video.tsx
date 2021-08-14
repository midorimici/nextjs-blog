export type VideoProps = { slug: string, src: string, control: boolean }

const Video = ({ slug, src, control }: VideoProps) => {
  const path = `/posts/${slug}/${src}.mp4`
  if (control) {
    return (
      <video controls className="mx-auto my-4" src={path} />
    )
  } else {
    return (
      <video autoPlay loop muted className="mx-auto my-4" src={path} />
    )
  }
}

export default Video
