import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Clients } from "../components/Clients";
import logo from '../assets/code-cast-high-resolution-logo-transparent.png';
import { useEffect, useRef, useState } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { initSocket } from "../utils/socket";
import { Socket } from "socket.io-client";
import { ACTIONS } from "../utils/action";

type Client = {
  SocketId: number;
  username: string;
};

const Editor = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('username');
  const roomID = searchParams.get('roomID');
  const socketRef = useRef<null | Socket>(null);
  const reactnavigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(()=>{
    const init = async()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error',(e)=> handleError(e));
      socketRef.current.on('connect_failed',(e)=> handleError(e));

      socketRef.current.emit(ACTIONS.JOIN,{
        roomID,
        username:userName,
      })

      socketRef.current.on(ACTIONS.JOINED,({clients, username,SocketId})=>{
        if(username!==userName){
          alert(`${username} entered the room`)
          console.log(username);
        }
        setClients([...clients])
      })
    }
    init();
  },[])

  function handleError(e:Event){
    console.log('socket error',e)
    alert('Socket connnection failed!');
    reactnavigate('/auth')
  }

  if(!userName || !roomID){
    <Navigate to={'/auth'}/>
  }


  return (
    <div className="h-screen">
     <div>
     <div className="bg-black p-4 flex justify-between items-center">
        {/* Logo */}
        <img src={logo} alt="Logo" className="h-8" />
        <button
          className="md:hidden text-white bg-[#1F75FE] rounded p-2"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          {sidebarVisible ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>
      <div className="h-[.07rem] w-full bg-slate-300"></div>
     </div>


    <div className=" bg-black grid grid-cols-6">

      {/* Sidebar (visible on larger screens) */}
      <div className={`sidebar hidden md:block bg-[#121c25] py-6 px-4 gap-5 max-h-full sticky`}>
        <div className="flex flex-col justify-between h-[85vh]">
        <div className="flex overflow-hidden flex-wrap gap-5">
          {clients && clients.map((e, i) => <Clients key={i} username={e.username} />)}
        </div>
        <div className="flex flex-col gap-5">
        <button className="text-white bg-[#1F75FE] rounded py-2 font-medium hover:bg-[#034694] duration-300">Copy RoomId</button>
          <button className="text-white bg-[#1F75FE] rounded py-2 font-medium hover:bg-[#034694] duration-300">Leave</button>
        </div>
        </div>
      </div>

      {/* Sidebar (visible on smaller screens) */}
      <div className={`sidebar bg-[#121c25] py-6 px-4 gap-5 w-screen md:hidden flex flex-col justify-between ${sidebarVisible ? 'block' : 'hidden'}`}>
        <div className="flex gap-5">
          {clients && clients.map((e, i) => <Clients key={i} username={e.username} />)}
        </div>
          <div className="flex flex-col gap-3">
          <button className="text-white bg-[#1F75FE] rounded py-2 px-2 font-medium hover:bg-[#034694] duration-300">Copy RoomId</button>
          <button className="text-white bg-[#1F75FE] rounded py-2 font-medium hover:bg-[#034694] duration-300">Leave</button>
          </div>
      </div>

      {/* Editor */}
      <div className="col-span-6 md:col-span-5">
        <CodeEditor/>
      </div>
    </div>
    </div>
  );
};

export default Editor;
