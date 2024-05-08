import React, { useEffect, useRef } from 'react';
import Editor, { OnMount,useMonaco } from '@monaco-editor/react';
// import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { editor } from "monaco-editor";
import { ACTIONS } from '../utils/action';
import { Socket } from 'socket.io-client';
import { useRecoilValue } from 'recoil';
import { langState } from '../ store/atom';

interface CodeEditorProps {
  socketRef: React.MutableRefObject<null | Socket>;
  roomId: string;
  codesync:(code:string)=>void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ socketRef, roomId , codesync}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const userTypingRef = useRef<boolean>(true);
  const monaco = useMonaco();
  const language = useRecoilValue(langState);

  const onMount: OnMount = (editorInstance) => {
    editorRef.current = editorInstance;
    editorRef.current?.focus

    // Provide initial code value or handle null case
    const initialCode = '// Start writing here...';
    editorRef.current?.setValue(initialCode);

    // Emit code change when editor content changes
    editorRef.current?.onDidChangeModelContent(() => {
      if(userTypingRef.current){
      const code = editorRef.current?.getValue();
      codesync(code || '');
      socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
    }
    });

    // Listen for incoming code changes from the server
    socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (code !== null && code !== undefined) {
        userTypingRef.current=false;
        editorRef.current?.setValue(code);
        userTypingRef.current=true;
      }
    });
  };

  useEffect(() => {
    if (monaco) {
      import('monaco-themes/themes/Dracula.json')
        .then(data => {
          const monokaiTheme = data; // Assuming the theme data is exported as default
          monaco.editor.defineTheme('monokai', monokaiTheme as editor.IStandaloneThemeData);
          monaco.editor.setTheme('monokai');
        })
    }
    
  
    const cleanup = () => {
      // Cleanup function to unsubscribe from socket events
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
    };
    return cleanup;
  }, [socketRef,monaco]);
  


  return (
    <Editor 
      language={language.value}
      onMount={onMount}
      options={{
        minimap:{
          enabled:false,
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
      }}
    />
  );
};
