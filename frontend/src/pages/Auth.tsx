import { FormEvent, useState } from "react";
import img from '../assets/code-cast-high-resolution-logo-transparent.png'

export const Auth = () => {
  const [roomID, setRoomID] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e:FormEvent) =>{
    e.preventDefault();
  };
  return (
    <div className="h-screen bg-[#15202B] flex justify-center items-center">
      <div className="max-w-sm mx-auto text-white p-6 bg-[#192734] rounded-md mx-5">
        <div className="mb-10">
          <img src={img} alt="" />
        </div>
      <h2 className="text-xl font-medium mb-4">Enter Room ID and Username</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomid" className="block mb-1">Room ID:</label>
          <input
            type="text"
            id="roomid"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-[.4rem]"
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block mb-1">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-[.4rem]"
            required
          />
        </div>
        <div>
          <button type="submit" className="bg-blue-700 font-medium text-white px-4 py-2 rounded hover:scale-105 mt-2 duration-200">
            Join
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}
