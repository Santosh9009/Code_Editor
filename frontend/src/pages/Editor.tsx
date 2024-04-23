import { Clients } from "../components/Clients"

const Editor = () => {
  return (
    <div className="h-screen w-full bg-black">
      {/* Sidebar */}
      <div className="sidebar ">
        <Clients username="Santosh"/>
      </div>
      {/* Editor */}
      <div className="editor ">

      </div>
    </div>
  )
}

export default Editor