import MonacoEditor from '@monaco-editor/react';

export const CodeEditor = () => {

  
  return (
    <MonacoEditor language="javascript" theme='vs-dark' options={{
      wordWrap:'on'
    }} />
  )
}



