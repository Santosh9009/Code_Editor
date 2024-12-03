import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Terminal, X, Maximize2, Minimize2, Copy } from "lucide-react";
import { toast } from "react-toastify";

export function Output({ output, err, setOutput, setErr }: { output: string | undefined; err: string | undefined; setOutput: (output: string | undefined) => void; setErr: (err: string | undefined) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (output || err) {
      setIsExpanded(true);
    }
  }, [output, err]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Escape") {
        setIsExpanded(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleCopy = () => {
    const contentToCopy = output || err || '';
    navigator.clipboard.writeText(contentToCopy);
    toast.success('Content copied to clipboard!');
  };

  return (
    <div 
      className={`
        ${isFullScreen ? 'fixed inset-0 z-50' : 'absolute bottom-0 w-[78%]'}
        bg-[#1b1b23] text-slate-300 shadow-lg transition-all duration-300
      `}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-[#282c34] border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#00BFFF]" />
            <span className="text-[#00BFFF] font-medium">Output</span>
            {(output || err) && (
              <div className={`px-2 py-0.5 text-xs rounded-full ${output ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {output ? 'Success' : 'Error'}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {(output || err) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-300"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300"
              onClick={() => setIsFullScreen(prev => !prev)}
            >
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Content */}
        <CollapsibleContent>
          <div 
            className={`
              ${isFullScreen ? 'h-[calc(100vh-48px)]' : 'h-[40vh]'}
              overflow-auto bg-[#1e1e2e] p-4 font-mono text-sm
            `}
          >
            {output || err ? (
              <div className="space-y-2">
                {/* Timestamp */}
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString()}
                </div>
                
                {/* Output Content */}
                <div className={`
                  rounded-lg p-4 font-mono
                  ${output 
                    ? 'bg-green-500/5 text-green-400 border border-green-500/10' 
                    : 'bg-red-500/5 text-red-400 border border-red-500/10'}
                `}>
                  <pre className="whitespace-pre-wrap">
                    {output || err}
                  </pre>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Output
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setOutput(undefined);
                      setErr(undefined);
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No output to display</p>
                  <p className="text-xs mt-1">Run your code to see the results here</p>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}