import { FormEvent, useState } from "react";
import logo from "../assets/code-cast-high-resolution-logo-transparent.png";
import { v4 as uuid } from 'uuid';
import { useNavigate, useSearchParams } from "react-router-dom";

export const Auth = () => {
  const [roomId, setroomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/editor?username=${encodeURIComponent(username)}&roomId=${encodeURIComponent(roomId)}`);
  };
  return (
    <div className="h-screen bg-[#15202B] flex justify-center items-center">
      <div className="max-w-sm mx-auto text-white p-6 bg-[#192734] rounded-md">
        <div className="mb-8">
          <img src={logo} alt="" />
          <div className="h-[.07rem] w-full bg-slate-500 mt-6"></div>
        </div>
        <h2 className="text-xl font-medium mb-4">Enter Room ID and Username</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block mb-1">
              Room Id:
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setroomId(e.target.value)}
              className="w-full rounded px-3 py-[.4rem] text-black outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block mb-1">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded px-3 py-[.4rem] text-black outline-none"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-700 font-medium text-white px-4 py-2 rounded hover:scale-105 mt-2 duration-200"
            >
              Join
            </button>
          </div>
          <div>
            Don't have an invite? create a{" "}
            <span>
              <button onClick={()=>setroomId(uuid())} className="text-blue-500 underline">newroom </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
