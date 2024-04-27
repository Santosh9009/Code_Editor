import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { useRef } from 'react';
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

export const CodeEditor = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const onMount:OnMount = (editor)=>{
    editorRef.current = editor;
    editorRef.current?.focus();
  }

  return (
    <MonacoEditor language="javascript" theme='vs-dark' defaultValue='// start writting here...' onMount={onMount} options={{
      wordWrap:'on',
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
    }} />
  )
}



