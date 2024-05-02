import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { ACTIONS } from '../utils/action';
import { Socket } from 'socket.io-client';

interface CodeEditorProps {
  socketRef: React.MutableRefObject<null | Socket>;
  roomId: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ socketRef, roomId }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const userTypingRef = useRef<boolean>(true);

  const onMount: OnMount = (editorInstance) => {
    editorRef.current = editorInstance;
    // editorRef.current?.focus();

    // Provide initial code value or handle null case
    const initialCode = '// Start writing here...';
    editorRef.current?.setValue(initialCode);

    // Emit code change when editor content changes
    editorRef.current?.onDidChangeModelContent(() => {
      if(userTypingRef.current){
      const code = editorRef.current?.getValue();
      console.log(code);
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

  return (
    <Editor
      language="javascript"
      theme="vs-dark"
      onMount={onMount}
      options={{
        wordWrap: 'on',
        padding: {
          top: 20,
          bottom: 20,
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
