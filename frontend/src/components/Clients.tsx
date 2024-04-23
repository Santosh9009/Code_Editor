import { useEffect, useState } from "react";
import { generateRandomColor } from './color'
export const Clients = ({username}:{username:string}) => {
  const [color, setColor ] = useState('');

  useEffect(()=>{
    const newcolor = generateRandomColor();
    setColor(newcolor);
  },[])
  return (
    <div className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-[${color}] rounded-full`}>
      <span className="font-medium text-gray-600 dark:text-gray-300">{username.slice(0,1).toUpperCase()}</span>
    </div>
  );
};
