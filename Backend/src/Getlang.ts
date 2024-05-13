const axios = require('axios');
require('dotenv').config();

const languageArray = [
    { language: 'java', version: '15.0.2' },
    { language: 'c++', version: '10.2.0' },
    { language: 'javascript', version: '18.15.0' },
    { language: 'go', version: '1.16.2' },
    { language: 'python', version: '3.10.0' },
    { language: 'typescript', version: '5.0.3' }
];

type objtype = {
  language:string,
  version:string,
  aliases:[]
}
export async function getVersion(language:string){
    try{
        const runtimes = await axios.get(process.env.RUNTIMES_URL)
        const array = runtimes.data.filter((obj:objtype)=>obj.language===language)
        return array[0].version
    }catch(error){
        if(error){
            const newarr = languageArray.filter(object=>object.language===language)
            return newarr[0].version
        }
      }
}




