import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/code-cast-high-resolution-logo-transparent.png";
import { useEffect, useRef, useState } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { initSocket } from "../utils/socket";
import { Socket } from "socket.io-client";
import { ACTIONS } from "../utils/action";
import LangSelector from "../components/LangSelector";
import { useRecoilState } from "recoil";
import { langState } from "../store/atom";
import { Output } from "../components/Output";
import { Spinner } from "../components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import SmallScreenWarning from "@/components/ SmallScreenWarning";

type Client = {
  socketId: string;
  username: string;
  canExecute: boolean;
  canWrite: boolean;
};

const Editor = () => {
  const [searchParams] = useSearchParams();
  const userName: string = searchParams.get("username") || "";
  const roomId: string = searchParams.get("roomId") || "";
  const socketRef = useRef<null | Socket>(null);
  const reactnavigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const codeRef = useRef<string | null>(null);
  const [language, setlanguage] = useRecoilState(langState);
  const [output, setOutput] = useState<string>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<Client | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  useEffect(() => {
    if (!socketRef.current) {
      console.log("No socket connection");
      return;
    }
    console.log("Setting up permission listeners in Editor");

    // Set up permission update listeners
    socketRef.current.on(ACTIONS.RUN_PERMISSION_UPDATED, ({ users, targetId, canExecute }) => {
      console.log("Editor: Received RUN_PERMISSION_UPDATED:", { users, targetId, canExecute });
      setClients(users);
      
      if (socketRef.current?.id === targetId) {
        const updatedUser = users.find((user: Client) => user.socketId === targetId);
        if (updatedUser) {
          console.log("Editor: Updating current user for run permission:", updatedUser);
          setCurrentUser(updatedUser);
        }
      }
    });

    socketRef.current.on(ACTIONS.WRITE_PERMISSION_UPDATED, ({ users, targetId, canWrite }) => {
      console.log("Editor: Received WRITE_PERMISSION_UPDATED:", { users, targetId, canWrite });
      setClients(users);
      
      if (socketRef.current?.id === targetId) {
        const updatedUser = users.find((user: Client) => user.socketId === targetId);
        if (updatedUser) {
          console.log("Editor: Updating current user for write permission:", updatedUser);
          setCurrentUser(updatedUser);
        }
      }
    });

    // Cleanup
    return () => {
      console.log("Cleaning up permission listeners in Editor");
      socketRef.current?.off(ACTIONS.RUN_PERMISSION_UPDATED);
      socketRef.current?.off(ACTIONS.WRITE_PERMISSION_UPDATED);
    };
  }, [socketRef, clients]); 

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      
      socketRef.current.on("connect_error", (e) => {
        console.log("Socket connection error:", e);
        handleError(e);
      });

      // Emit join event after socket is connected
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: userName,
      });

      // Set up initial joined listener
      socketRef.current.on(ACTIONS.JOINED, ({ users, admin, username }) => {
        if (username !== userName) {
          toast.info(`${username} entered the room`);
        }
        setClients(users);
        setAdmin(admin);
        const currentUser = users.find(
          (user: Client) => user.socketId === socketRef.current?.id
        );
        setCurrentUser(currentUser || null);
      });

      // Code output listener
    socketRef.current.on(ACTIONS.CODE_OUTPUT, ({ stdout, error }) => {
      console.log("Editor: Received code output:", { stdout, error });
      setOutput(stdout);
      setErr(error);
      setLoading(false);
    });

    // Language change listener
    socketRef.current.on(ACTIONS.LANG_CHANGE, ({ lang_object }) => {
      console.log("Editor: Received language change:", lang_object);
      setlanguage(lang_object);
    });

      // Other existing listeners...
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current?.off(ACTIONS.CODE_OUTPUT);
        socketRef.current?.off(ACTIONS.LANG_CHANGE);
      }
    };
  }, []); // Empty dependency array for initial setup


  if (isSmallScreen) {
    return <SmallScreenWarning />;
  }

  function handleError(e: Event | Error) {
    console.log("socket error", e);
    alert("Socket connnection failed!");
    reactnavigate("/auth");
  }

  function handleRun() {
   if (codeRef.current === null || codeRef.current === "") {
      toast.warning(`Editor is empty`);
      return;
    }

    const code = codeRef.current;

    socketRef.current?.emit(ACTIONS.RUN_CODE, {
      lang: language.value,
      code,
      roomId,
    });
    setLoading(true);
  }

  if (!userName || !roomId) {
    <Navigate to={"/auth"} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ToastContainer />
      {/* Header */}
      <div className="bg-[#070707] p-4 flex justify-between items-center">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="h-4 md:h-7" />
        </Link>

        <div className="flex gap-3 md:gap-5">
          <LangSelector users={clients} socketRef={socketRef} roomId={roomId} />
          <Button
            onClick={handleRun}
            disabled={!currentUser?.canExecute}
            className={`bg-[#2F4858] text-[#00BFFF] hover:bg-[#12EAEA] hover:text-black ${
            !currentUser?.canExecute
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
          >
            {loading ? <Spinner /> : "RUN"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-gray-800">
          <Sidebar
            socketRef={socketRef}
            roomId={roomId}
            clients={clients}
            admin={admin}
          />
        </div>

        {/* Editor and Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1">
            <CodeEditor
              currentUser={currentUser || {
                socketId: "",
                username: "",
                canExecute: false,
                canWrite: false,
              }}
              socketRef={socketRef}
              roomId={roomId}
              codesync={(code) => {
                codeRef.current = code;
              }}
            />
          </div>
          <Output output={output} err={err} setOutput={setOutput} setErr={setErr} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
