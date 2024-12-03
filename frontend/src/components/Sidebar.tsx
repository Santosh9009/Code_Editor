import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ACTIONS } from "../utils/action";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCopy, 
  LogOut, 
  MoreVertical,
  Play,
  Pencil,
  Users,
  Crown 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type Client = {
  socketId: string;
  username: string;
  canExecute: boolean;
  canWrite: boolean;
};

const Sidebar = ({
  roomId,
  socketRef,
  clients,
  admin
}: {
  roomId: string;
  socketRef: React.MutableRefObject<null | Socket>;
  clients: Client[];
  admin: string;
}) => {
  const reactnavigate = useNavigate();
  const [users, setUsers] = useState<Client[]>([]);
  const isAdmin = socketRef.current?.id === admin;

  useEffect(() => {
    if(!socketRef.current) return;
    
    setUsers(clients);

    socketRef.current.on(ACTIONS.RUN_PERMISSION_UPDATED, ({ canExecute, users }) => {
      setUsers(users);
      toast.info(`Execute permission ${canExecute ? 'granted' : 'revoked'}`);
    });

    socketRef.current.on(ACTIONS.WRITE_PERMISSION_UPDATED, ({ canWrite, users }) => {
      setUsers(users);
      toast.info(`Write permission ${canWrite ? 'granted' : 'revoked'}`);
    });

    return () => {
      socketRef.current?.off(ACTIONS.RUN_PERMISSION_UPDATED);
      socketRef.current?.off(ACTIONS.WRITE_PERMISSION_UPDATED);
    };
  }, [socketRef, clients]);

  const togglePermission = (targetId: string, currentPermission: boolean) => {
    if (!isAdmin) {
      toast.error("Only admin can modify permissions");
      return;
    }
    socketRef.current?.emit(ACTIONS.RUN_UPDATE_PERMISSION, {
      roomId,
      targetId,
      canExecute: !currentPermission
    });
  };

  const toggleWritePermission = (targetId: string, currentPermission: boolean) => {
    if (!isAdmin) {
      toast.error("Only admin can modify permissions");
      return;
    }
    socketRef.current?.emit(ACTIONS.UPDATE_WRITE_PERMISSION, {
      roomId,
      targetId,
      canWrite: !currentPermission
    });
  };

  return (
    <div className="w-80 bg-gray-900 p-4 flex flex-col h-full border-r border-gray-800">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-200">Participants</h3>
          <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
            {users.length}
          </span>
        </div>
        <div className="h-[1px] bg-gray-800 w-full" />
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {users.map((user) => (
          <div 
            key={user.socketId} 
            className={`
              p-3 rounded-lg transition-all duration-200
              ${user.socketId === socketRef.current?.id ? 'bg-gray-800/60' : 'hover:bg-gray-800/40'}
            `}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-gray-200 font-medium">
                    {user.username}
                  </span>
                  {user.socketId === admin && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  {user.socketId === socketRef.current?.id && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>

                {/* Permissions Badges */}
                <div className="flex gap-2 mt-2">
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-md text-xs
                    ${user.canExecute ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                  `}>
                    <Play className="h-3 w-3" />
                    Execute
                  </div>
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-md text-xs
                    ${user.canWrite ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                  `}>
                    <Pencil className="h-3 w-3" />
                    Write
                  </div>
                </div>
              </div>

              {/* Admin Controls */}
              {isAdmin && socketRef.current?.id !== user.socketId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                    <DropdownMenuItem 
                      onClick={() => togglePermission(user.socketId, user.canExecute)}
                      className="flex items-center gap-2 text-gray-200 hover:bg-gray-800"
                    >
                      <Play className="h-4 w-4" />
                      {user.canExecute ? 'Revoke Execute Access' : 'Grant Execute Access'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => toggleWritePermission(user.socketId, user.canWrite)}
                      className="flex items-center gap-2 text-gray-200 hover:bg-gray-800"
                    >
                      <Pencil className="h-4 w-4" />
                      {user.canWrite ? 'Revoke Write Access' : 'Grant Write Access'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 space-y-2 pt-4 border-t border-gray-800">
        <Button
          variant="outline"
          className="w-full bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 transition-colors"
          onClick={() => {
            navigator.clipboard.writeText(roomId);
            toast.success("Room ID Copied!");
          }}
        >
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy Room ID
        </Button>
        <Button 
          variant="destructive"
          className="w-full"
          onClick={() => reactnavigate("/auth")}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Leave Room
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;