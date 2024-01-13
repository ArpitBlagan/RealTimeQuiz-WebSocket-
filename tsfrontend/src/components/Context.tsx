import {useState,createContext,ReactNode,useEffect} from 'react'
import axios from 'axios';
interface MyContextProps {
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  }
export const context=createContext<MyContextProps|undefined>(undefined);
interface ok{
    children:ReactNode
}
const Context = ({children}:ok) => {
  const [loggedIn,setLoggedIn]=useState<boolean>(false);
  const check=async()=>{
    try{
    const res=await axios.get('http://localhost:3000/loggedIn',{withCredentials:true});
    if(res.data?.message=="yes"){
      setLoggedIn(true);
    }else{
      console.log("need to login..")
    }}
    catch(err){
      console.log("Need to login/register..");
    }
  }
  useEffect(()=>{
    check();
  },[]);
  return (
    <context.Provider value={{loggedIn,setLoggedIn}}>{children}</context.Provider>
  )
}

export default Context