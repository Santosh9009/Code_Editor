import { atom } from "recoil";

export const langState = atom({
  key:'langState',
  default:{label:'Javascript',value:'javascript'}
})