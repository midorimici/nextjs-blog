const Sandbox = ({ name, link }: { name: string, link: string }) => {
  return (
    <a href={link} target="_blank" rel="noopener" className="contents"> 
      <img
        src="https://codesandbox.io/static/img/play-codesandbox.svg"
        alt={`Edit ${name}`}
      />
    </a>
  )
}

export default Sandbox
