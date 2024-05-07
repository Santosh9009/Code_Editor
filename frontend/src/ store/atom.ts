import { atom } from "recoil";

type lang ={
  label:string,
  value:string
}

export const langState = atom<lang>({
  key:'langState',
  default:{label:'javascript',value:'javascript'}
})


