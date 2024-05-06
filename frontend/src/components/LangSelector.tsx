import { useEffect } from "react";
import Select from "react-dropdown-select";
import { useRecoilState } from "recoil";
import { langState } from "../ store/atom";

interface LanguageOption {
  label: string;
  value: string;
}

const LangSelector = () => {
  // const [selectedValue, setSelectedValue] = useState<LanguageOption | null>(null);
  const [selectedValue, setSelectedValue] = useRecoilState(langState);

  const languageOptions: LanguageOption[] = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "c++" },
    // Add more languages as needed
  ];

  const handleChange = (selectedOptions: LanguageOption[]) => {
    setSelectedValue(selectedOptions[0] || null);
  };

  useEffect(() => {
    console.log(selectedValue);

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
