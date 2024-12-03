import { useRecoilState } from "recoil";
import { langState } from "../store/atom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Socket } from "socket.io-client";
import { ACTIONS } from "../utils/action";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface LanguageOption {
  label: string;
  value: string;
}

type LangSelectorProps = {
  socketRef: React.MutableRefObject<Socket | null>;
  roomId: string;
  users: Client[];
};

type Client = {
  socketId: string;
  username: string;
  canExecute: boolean;
};

export const LangSelector: React.FC<LangSelectorProps> = ({
  socketRef,
  roomId,
  users,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useRecoilState(langState);
  const [currentUser, setCurrentUser] = useState<Client | undefined>(undefined);

  const languageOptions: LanguageOption[] = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "C++", value: "c++" },
  ];

  useEffect(() => {
    const user = users.find(
      (user: Client) => user.socketId === socketRef.current?.id
    );
    setCurrentUser(user);
  }, [users, socketRef]);

  const handleLanguageChange = (value: string) => {
    if (!currentUser?.canExecute) {
      return; // User cannot execute
    }

    const selectedOption = languageOptions.find((lang) => lang.value === value);
    if (selectedOption) {
      setSelectedLanguage(selectedOption);
      socketRef.current?.emit(ACTIONS.LANG_CHANGE, {
        lang_object: selectedOption,
        roomId,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={!currentUser?.canExecute}
          className={`${
            !currentUser?.canExecute
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          {selectedLanguage?.label || "Select Language"}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Programming Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedLanguage?.value || ""}
          onValueChange={handleLanguageChange}
        >
          {languageOptions.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              disabled={!currentUser?.canExecute}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LangSelector;
