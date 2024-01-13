import {useState , useContext , useEffect} from 'react'
import { context } from './Context';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import PopUp from './PopUp';
export interface error{
  reqError:boolean;
  errorText:string;
}
const LogInReg = () => {
  const [req,setRer]=useState<error>({reqError:false,errorText:""});
  const [login,setL]=useState<boolean>(false);
  const [email,setE]=useState<string>("");
  const [password,setP]=useState<string>("");
  const [error,setEr]=useState<boolean>(true);
  const [passError,setEp]=useState<boolean>(true);
  const navigate=useNavigate();
  const value=useContext(context);
  useEffect(()=>{
    if(value){value.setLoggedIn(false);}
  },[])
  const validateEmail = (inputEmail:string) => {
    if(inputEmail==""){return true;}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };
  const validatePassword=(pass:string)=>{
      if(pass.length==0||pass.length>=8){
        return true;
      }
      return false;
  }
  const handleRegister=async(event:React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    if(email==""||password==""){
      setRer((prev)=>{
        return {...prev,reqError:true,
          errorText:"Please fill the required filled"}
      });
      return;
    }
      const body={email,password};
      const res=await axios.post("http://localhost:3000/register",body,{withCredentials:true});
      console.log(res);
      if(res.data.message=="Logged IN"){
          if(value){
            value.setLoggedIn(true);
          }
          setP("");
          setE("")
        navigate("/")
      }
      else if(res.data.message=="email already registered"){
        setRer((prev)=>{
          return {...prev,reqError:true,errorText:"Email is already register"}
        });
      }
      else{
        setRer((prev)=>{
          return {...prev,reqError:true,errorText:"Something Went try again later or with correct credentials"}
        });
      }
  }
  const handleLogin=async(event:React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    if(email==""||password==""){
      setRer((prev)=>{
        return {...prev,reqError:true,
          errorText:"Please fill the required filled"}
      });
      return;
    }
    const body={email,password};
    const res=await axios.post("http://localhost:3000/login",body,{withCredentials:true});
    if(res.data.message=="Logged IN"){ 
      if(value){
        value.setLoggedIn(true);
      }
        setE("");setP("");
      navigate("/")
    }
    else{
      setRer((prev)=>{
        return {...prev,reqError:true,errorText:"Something Went try again later or with correct credentials"}
      });
    }
  }
  return (
    <div className="flex md:flex-row mt-4 flex-col justify-around h-[90dvh]">
      
      
      <div className='flex flex-col justify-center mx-1 p-2 text-[30px]'>
        <p>Hello, Welcom to <span className='text-violet-400'>Real Time </span>Quiz.</p>
        <p>It is all about to make the quiz interactive.</p>
        <p>To able to create a quiz you need to login/register first😁.</p>
        <p>Thank you<a href="https://github.com/ArpitBlagan" target='_blank' className='text-red-400'> Arpit Blagan </a> this side.</p>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <h1 className='text-[40px]'>{login?"LOGIN":"REGISTER"}</h1>
        <form className='border-[2px]  p-3 rounded-md'>
          <div className='my-[4px] flex flex-col justify-center'>
            <h1>Email*</h1>
            <input className='h-[40px] md:w-[550px]  border-[2px] border-gray-300 pl-2'
              placeholder='enter your email'
              type="email" value={email} onChange={(e)=>{
                const {value}=e.target;
                setE(value);
                const ff=validateEmail(value);
                setEr(ff);
              }}/>
              <p className='text-red-500'>{!error?"please enter valid email":""}</p>
          </div>
          <div className='my-[4px]'>
            <h1>Password*</h1>
            <input className='h-[40px] md:w-[550px]  border-[2px] border-gray-300 pl-2'
              placeholder='enter your password'
              type="password" value={password} onChange={(e)=>{
                setP(e.target.value);
                setEp(validatePassword(e.target.value));
              }}/>
              <p className='text-red-500'>{!passError?"password length should be more than or equal to 8":""}</p>
          </div>
          <hr/>
          <div className='my-4 flex justify-center'>
              <button className='bg-violet-400 px-7 py-3 rounded-xl' onClick={login?handleLogin:handleRegister}>
                {login?"Login":"Register"}
              </button>
          </div>
        </form>
        <div>
        {!login?
              <button className='' onClick={(event)=>{
                console.log('clicked');
                event.preventDefault();setL(!login);
              }}>Already Register Login</button>:
              <button className='' onClick={(event)=>{
                console.log('clicked');
                event.preventDefault();setL(!login);
              }}>Not Registered</button>
            }
        </div>
      </div>
    </div>
  )
}

export default LogInReg