import { useEffect, useState } from "react";
import { getRandomColor } from '../utils/color'
export const Clients = ({username}:{username:string}) => {
  const [color, setColor ] = useState('');

  useEffect(()=>{
    const newcolor = getRandomColor(username);
    console.log(newcolor);
    setColor(newcolor);
  },[])
  
  return (
    <div className="flex flex-col items-center gap-2">
    <div className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full`} style={{background:color}}>
      <span className="font-semibold text-gray-600 dark:text-gray-300">{username.slice(0,1).toUpperCase()}</span>
    </div>
    <div className="text-white text-sm font-semibold">{username}</div>
    </div>
  );
};
