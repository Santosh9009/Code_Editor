import React, { useEffect, useRef } from 'react';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import { editor } from "monaco-editor";
import { ACTIONS } from '../utils/action';
import { Socket } from 'socket.io-client';
import { useRecoilValue } from 'recoil';
import { langState } from '../store/atom';


type Client = {
  socketId: string;
  username: string;
  canExecute: boolean;
  canWrite: boolean;
};

interface CodeEditorProps {
  socketRef: React.MutableRefObject<null | Socket>;
  roomId: string;
  codesync: (code: string) => void;
  currentUser: Client;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  socketRef, 
  roomId, 
  codesync, 
  currentUser 
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const userTypingRef = useRef<boolean>(true);
  const monaco = useMonaco();
  const language = useRecoilValue(langState);

  const onMount: OnMount = (editorInstance) => {
    editorRef.current = editorInstance;

    console.log("Editor mounted with permissions:", {
      canWrite: currentUser.canWrite,
      readOnly: !currentUser.canWrite,
      currentUser
    });

    editorInstance.onDidChangeModelContent(() => {
      if (userTypingRef.current) {
        const code = editorInstance.getValue();
        codesync(code || '');
        socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });

    socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (code !== null && code !== undefined) {
        userTypingRef.current = false;
        editorInstance.setValue(code);
        userTypingRef.current = true;
      }
    });
  };

  useEffect(() => {
    if (monaco) {
      import('monaco-themes/themes/Dracula.json')
        .then(data => {
          monaco.editor.defineTheme('monokai', data as editor.IStandaloneThemeData);
          monaco.editor.setTheme('monokai');
        });
    }

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
    };
  }, [monaco, socketRef]);

  useEffect(() => {
    console.log("CodeEditor: Current user permissions updated:", {
      socketId: currentUser.socketId,
      canWrite: currentUser.canWrite
    });

    if (editorRef.current) {
      console.log("Updating editor options, canWrite:", currentUser.canWrite);
      editorRef.current.updateOptions({
        readOnly: !currentUser.canWrite
      });
    }
  }, [currentUser]);

  return (
    <div className="relative w-full h-full">
      <Editor 
        height="100%"
        width="100%"
        language={language.value}
        onMount={onMount}
        options={{
          minimap: {
            enabled: false,
          },
          wordWrap: 'on',
          padding: {
            top: 20,
          },
          fontFamily: 'Fira Code',
          fontSize: 14,
          lineHeight: 24,
          scrollbar: {
            useShadows: true,
            verticalHasArrows: true,
            horizontalScrollbarSize: 8,
            verticalSliderSize: 8,
            horizontalSliderSize: 8,
          },
          readOnly: !currentUser.canWrite,
        }}
        className="rounded-lg overflow-hidden"
      />
      {!currentUser.canWrite && (
        <div className="absolute top-2 right-2 bg-gray-800/90 text-gray-300 px-3 py-1.5 rounded-md text-sm flex items-center gap-2 shadow-lg z-50">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Read Only Mode
        </div>
      )}
    </div>
  );
};

export default CodeEditor;