export type VideoProps = {
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
	src: string
	control: boolean
}

const Video = ({ assets, src, control }: VideoProps) => {
	const path = assets[src].url
	if (control) {
		return <video controls className="mx-auto my-4" src={path} />
	} else {
		return <video autoPlay loop muted className="mx-auto my-4" src={path} />
	}
}

export default Video
