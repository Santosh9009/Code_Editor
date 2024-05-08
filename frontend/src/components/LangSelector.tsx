import React,{ useEffect } from "react";
import Select from "react-dropdown-select";
import { useRecoilState } from "recoil";
import { langState } from "../ store/atom";
import { Socket } from "socket.io-client";
import { ACTIONS } from "../utils/action";

interface LanguageOption {
  label: string;
  value: string;
}
type prop = {
  socketRef:React.MutableRefObject<Socket | null>,
  roomId:string
}

const LangSelector = ({socketRef,roomId}:prop) => {
  const [selectedValue, setSelectedValue] = useRecoilState(langState);

  const languageOptions: LanguageOption[] = [
    { label: "javaScript", value: "javascript" },
    { label: "python", value: "python" },
    { label: "java", value: "java" },
    { label: "c++", value: "cpp" },
    { label: "typescript", value: "typescript" },
    // Add more languages as needed
  ];

  const handleChange = (selectedOptions: LanguageOption[]) => {
    setSelectedValue(selectedOptions[0] || null);
    socketRef.current?.emit(ACTIONS.LANG_CHANGE,{lang_object:selectedOptions[0] || null,roomId});
  };


  useEffect(() => {

    return () => {};
  }, [selectedValue]);

  return (
    <Select
      className="text-blue-500 transition-all duration-400 bg-white"
      options={languageOptions}
      labelField="label"
      valueField="value"
      values={selectedValue ? [selectedValue] : []}
      onChange={handleChange}
      backspaceDelete={false}
      clearable={false}
      closeOnClickInput={true}
    />
  );
};

export default LangSelector;
