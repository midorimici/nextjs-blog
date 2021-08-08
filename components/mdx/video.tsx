export type VideoProps = { slug: string, src: string, control: boolean }

const Video = ({ slug, src, control }: VideoProps) => {
  if (control) {
    return (
      <video controls className="mx-auto my-4">
        <source src={`/posts/${slug}/${src}.mp4.webm`} type="video/webm" />
        <source src={`/posts/${slug}/${src}.mp4`} type="video/mp4" />
      </video>
    )
  } else {
    return (
      <video autoPlay loop muted className="mx-auto my-4">
        <source src={`/posts/${slug}/${src}.mp4.webm`} type="video/webm" />
        <source src={`/posts/${slug}/${src}.mp4`} type="video/mp4" />
      </video>
    )
  }
}

export default Video
