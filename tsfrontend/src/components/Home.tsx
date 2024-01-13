import { useContext , useEffect ,useState} from "react"
import { context } from "./Context"
import { Link , useNavigate } from "react-router-dom";
import axios from "axios";
import PopUp from "./PopUp";
import { error } from "./LogInReg";
interface quiz{
  unique_id:string,
}
const Home = () => {
  const navigate=useNavigate();
  const[name,setNa]=useState<string>("");
  const [req,setRer]=useState<error>({reqError:false,errorText:""});
  const [quizKey,setQk]=useState<string>("")
  const [quizs,setQuizs]=useState<quiz[]>([]);
  const value=useContext(context);
  const getQuizs=async()=>{
    try{
      const res=await axios.get("http://localhost:3000/quizs",{withCredentials:true});
      console.log(res.data);
      setQuizs(res.data);
    }catch(err){
      console.log(err);
    }
  }
  useEffect(()=>{
    console.log(value?.loggedIn)
    getQuizs();
  },[]);
  const handleStart=(event:React.MouseEvent<HTMLButtonElement>,key:string)=>{
      event.preventDefault();
      navigate("/start",{state:{key}});
  }
  const handleUS=(event:React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    console.log(name,quizKey);
    if(!name||!quizKey){
      setRer({reqError:true,errorText:"Please fill both fields"});
      return;
    }
    navigate("/userStart",{state:{key:quizKey,name}})
  }
  return (
    <div>
        {req.reqError&&<div className='fixed w-full h-full top-0 left-0'><PopUp change={setRer} text={req.errorText}/></div>}
        <div className="flex flex-col w-full items-center justify-center my-10 gap-4"> 
          <h1 className="text-[30px] text-red-400">Enter the Quizzz...</h1>
          <div className="flex flex-col text-red-400">
            <h1>Name</h1>
            <input className='h-[40px] md:w-[550px] rounded-xl  border-[2px] border-gray-300 pl-2'
                placeholder='enter your Name ...' value={name}
                onChange={(e)=>{setNa(e.target.value)}}/>
            <h1>Key</h1>    
            <input className='h-[40px] md:w-[550px] rounded-xl  border-[2px] border-gray-300 pl-2'
                placeholder='enter quiz ID ...' value={quizKey}
                onChange={(e)=>{setQk(e.target.value)}}/>
          </div>    
          <button className='bg-violet-400 px-7 py-3 rounded-xl hover:px-5'
            onClick={handleUS}
          >ENTER</button>
        </div>
        { value&&value.loggedIn?<div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[30px] underline">Create your<span className="text-red-400"> own test </span>and invite users</h1>
          <Link to="/form" className='bg-violet-400 px-7 py-3 rounded-xl hover:px-5'>
            Create Test
          </Link>
        </div>
        <div className="flex flex-col my-4 items-center border-[2px] p-2 rounded-md">
          <h1 className="text-[30px]">Created Test...</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {
              quizs.map((ele,indd)=>{
                return <div key={indd} className="w-full flex flex-col items-center p-3 justify-center m-2 border-[2px] border-gray-300">
                  <h1>KEY: {ele.unique_id}</h1>
                  <p>Using this KEY user can enter the quiz..</p>
                  <button className="bg-red-400 px-4 py-1 rounded-xl my-3 hover:px-5"
                    onClick={(e)=>{handleStart(e,ele.unique_id)}}
                  >Start</button>
                </div>
              })
            }
          </div>
          {!quizs.length&&<h1 className="text-[20px] text-red-400">No Created Test</h1>}
        </div></div>:
        <h1 className="text-center text-[30px] font-thin text-red-400">You Need<Link to="loginReg" className="text-black underline text-[35px]"> Register/Login </Link>first to create your own Quiz😁.</h1>
        }
    </div>
  )
}

export default Home