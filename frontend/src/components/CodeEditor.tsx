import {Editor, OnMount } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

export const CodeEditor = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [ code ,setCode ] = useState('//Start writting here...');

  const onMount:OnMount = (editor)=>{
    editorRef.current = editor;
    editorRef.current?.focus();
  }

  useEffect(()=>{
    
  })

  function showValue() {
    alert(editorRef.current?.getValue());
  }


  return (
    <>
    <button className='text-white bg-red-700 px-2 py-2 rounded focus:bg-red-500' onClick={showValue}>Show value</button>
    <Editor language="javascript" theme='vs-dark' defaultValue={code} value={code} onMount={onMount} onChange={(value)=>setCode(value||"")} options={{
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
        </>

  )
}



