import { atom } from "recoil";

type outputType=string;
type errType=string;

export const langState = atom({
  key:'langState',
  default:{label:'javascript',value:'javascript'}
})

export const Outputvalue = atom<outputType>({
  key:'stdout',
  default:""
})

export const Err = atom<errType>({
  key:'error',
  default:""
})
