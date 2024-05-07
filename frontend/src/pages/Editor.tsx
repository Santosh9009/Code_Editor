import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Clients } from "../components/Clients";
import logo from '../assets/code-cast-high-resolution-logo-transparent.png';
import { useEffect, useRef, useState } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { initSocket } from "../utils/socket";
import { Socket } from "socket.io-client";
import { ACTIONS } from "../utils/action";
import LangSelector from "../components/LangSelector";
import { useRecoilValue } from "recoil";
import { langState } from "../ store/atom";
import { Output } from "../components/Output";

type Client = {
  socketId: number;
  username: string;
};


const Editor = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const userName:string = searchParams.get('username') || "";
  const roomId:string = searchParams.get('roomId') || '';
  const socketRef = useRef<null | Socket>(null);
  const reactnavigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const codeRef = useRef<string | null>(null);
  const { label } = useRecoilValue(langState);
  const [output, setOutput] = useState<string>();
  const [err, setErr] = useState<string>();

  useEffect(()=>{
    const init = async()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error',(e)=> handleError(e));
      socketRef.current.on('connect_failed',(e)=> handleError(e));

  // Listing to join
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:userName,
      })


// listening to Joined
      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
        console.log(clients)
        if(username!==userName){
          alert(`${username} entered the room`)
        }
        setClients(clients)
        socketRef.current?.emit(ACTIONS.SYNC_CODE, {code:codeRef.current, socketId})
      })

      // listening to output
      socketRef.current?.on(ACTIONS.CODE_OUTPUT,({stdout,error})=>{
        setOutput(stdout)
        setErr(error)
      });
// Listening to disconnected
      socketRef.current?.on(ACTIONS.DISCONNECTED,({username, socketId})=>{
        console.log(username, socketId)
        
        setClients((prev)=>{
          return prev.filter(client=>client.socketId!==socketId)
        })
        alert(`${username} left the room`)
      })
    }
    init();

    return ()=>{
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.RUN_CODE);
      socketRef.current?.off(ACTIONS.CODE_OUTPUT);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    }
  },[])

  function handleError(e:Event){
    console.log('socket error',e)
    alert('Socket connnection failed!');
    reactnavigate('/auth')
  }

  function copyRoomId(){
    try{
      navigator.clipboard.writeText(roomId);
      alert('Room Id copied!')
    }catch(err){
      alert('could not copy Room Id');
      console.log(err)
    }
  }


  function leaveRoom(){
      reactnavigate('/auth')
  }

  function handleRun() {
    const code = codeRef.current;

    socketRef.current?.emit(ACTIONS.RUN_CODE, { lang:label ,code , roomId });
  }


  if(!userName || !roomId){
    <Navigate to={'/auth'}/>
  }


  return (
    <div className="h-screen overflow-y-hidden">
     <div>
     <div className="bg-[#070707] p-4 flex justify-between items-center">
        {/* Logo */}
        <img src={logo} alt="Logo" className="h-4 md:h-7" />
        <button
          className=" text-sm md:hidden text-white bg-[#1F75FE] rounded p-2"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          {sidebarVisible ? 'Close' : 'Open'}
        </button>
        {!sidebarVisible && <div className="flex gap-3 md:gap-5">
        <button onClick={handleRun} className="text-sm md:text-base bg-[#2F4858] px-4 py-1 rounded-sm text-[#00BFFF] hover:bg-[#12EAEA] hover:text-black transition-colors active:bg-white active:text-black active:duration-200">RUN</button>
        <LangSelector/>
        </div>}
      </div>
      {/* <div className="h-[.03rem] w-full bg-slate-300"></div> */}
     </div>


    <div className=" bg-black grid grid-cols-6">

      {/* Sidebar (visible on larger screens) */}
      <div className={`sidebar hidden md:block bg-[#1b1b23] py-6 px-4 gap-5 max-h-full border-[.03rem] border-black`}>
        <div className="flex flex-col justify-between h-[85vh]">
        <div className="flex overflow-hidden flex-wrap gap-5">
          {clients && clients.map((e, i) => <Clients key={i} username={e.username} />)}
        </div>
        <div className="flex flex-col gap-5">
        <button onClick={copyRoomId} className="text-black bg-white rounded py-2 font-bold hover:bg-slate-400 duration-200">Copy RoomId</button>
          <button onClick={leaveRoom} className="text-black bg-[#1098F7] rounded py-2 font-bold hover:bg-[#034694] duration-200 ">Leave</button>
        </div>
        </div>
      </div>

      {/* Sidebar (visible on smaller screens) */}
      <div className={`sidebar bg-[#191920] py-6 px-4 gap-5 w-screen md:hidden flex flex-col justify-between ${sidebarVisible ? 'block' : 'hidden'}`}>
        <div className="flex gap-5">
          {clients && clients.map((e, i) => <Clients key={i} username={e.username} />)}
        </div>
          <div className="flex flex-col gap-3">
          <button onClick={copyRoomId} className="text-black bg-white rounded py-2 px-2 font-bold hover:bg-slate-400 duration-200">Copy roomId</button>
          <button onClick={leaveRoom} className="text-black bg-[#1F75FE] rounded py-2 font-bold hover:bg-[#034694] duration-200">Leave</button>
          </div>
      </div>

      {/* Editor */}
      <div className="col-span-6 md:col-span-5">
        <CodeEditor socketRef={socketRef} roomId={roomId} codesync={(code)=>codeRef.current=code}/>
        <Output output={output} err={err}/>
      </div>
    </div>
    </div>
  );
};

export default Editor;
