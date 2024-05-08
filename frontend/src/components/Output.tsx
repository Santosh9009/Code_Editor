import { useEffect, useState } from "react";
import upimg from '../assets/icons8-up-64.png';
import downimg from '../assets/icons8-down-64 (1).png';

export function Output({ output, err }: { output: string | undefined; err: string | undefined }) {
  const [height, setHeight] = useState("6vh");
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleHeight = () => {
    setIsExpanded(prevstate => !prevstate);
    setHeight(prevHeight => (prevHeight === "6vh" ? "40vh" : "6vh"));
  };

  useEffect(() => { 
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Escape") {
        toggleHeight();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="absolute w-full md:w-[83.33%] bottom-0 bg-[#1b1b23] text-slate-300 z-10 sha">
      <div className="transition-height duration-200" style={{ height: height }}>
        <div className="flex justify-between px-8 py-2">
          <div className="text-[#00BFFF] font-extralight">OUTPUT</div>
          <button onClick={toggleHeight} className="font-extralight">
            {isExpanded ? <img className="w-5" src={downimg} alt="up" /> : <img className="w-5" src={upimg} alt="down" />}
          </button>
        </div>
        {isExpanded && (
          <div className="p-3 border-t-[.03rem] border-slate-400">
            {!output ? err : output}
          </div>  
        )}
      </div>
    </div>
  );
}
