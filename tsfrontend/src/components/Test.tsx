import { useState , useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import Landing from "./test/Landing";
import Questions from "./test/Questions";
import LeaderBoard from "./test/LeaderBoard";
export interface scoree{
  score:number,
  name:string
}
export interface statementt{
  title:string,
  options:string[]
}

const Test = () => {
  const {key}=useLocation().state;
  const [count,setCount]=useState<number>(0);
  const [socket,setS]=useState<WebSocket|null>(null);
  const [start,setStart]=useState<boolean>(true);
  const [question,setQuestion]=useState<boolean>(false);
  const [leaderboard,setLeaderboard]=useState<boolean>(false);
  const [end,setEnd]=useState<boolean>(false);
  const [score,setScore]=useState<scoree[]>([]);
  const [statement,setStatement]=useState<statementt|null>(null);
  useEffect(()=>{
    const sock=new WebSocket(`ws://localhost:3000?name=admin${key}`);
    const val=JSON.stringify({
      name:'AddRoom',
      id:key
    });
    sock.onopen=()=>{
      console.log("creating room");
      sock.send(val);
    }
    sock.addEventListener('message',(event:any)=>{
      console.log("message coming");
      const respon=JSON.parse(event.data);
      if(respon.users){
        setCount(respon.users);
      }
      else if(respon.name=="question"){
        console.log("getting question");
        setStart(false);setLeaderboard(false);setQuestion(true);
        console.log(respon.question);
        setStatement({title:respon.question.title,options:respon.question.options});
        setTimeout(()=>{
          setStart(true);setLeaderboard(false);setQuestion(false);
        },15000);
      }
      else if(respon.name=="result"){
        console.log("getting scoreBoard");
        setStart(false);setLeaderboard(true);setQuestion(false);
        const val:scoree[]=respon.ans;
        const arr=val.sort((a:scoree,b:scoree)=>b.score - a.score)
        setScore(arr);console.log(arr);
      }
      else if(respon.name=="end"){
        setStart(false);setLeaderboard(false);setQuestion(false);
        setEnd(true);
      }
    });
    setS(sock);
    return ()=>{
      sock.close();
    }
  },[]);
  const handleQS=(event:React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    console.log("starting the quiz");
    const val=JSON.stringify({
      name:'startQuiz',
      id:key
    });
    socket?.send(val);
  }
  const handleGetScoreboard=(event:React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    const val=JSON.stringify({
      name:"getResult",
      id:key
    });
    socket?.send(val);
  }
  return (
    <div className="my-5 flex flex-col justify-center items-center h-[80dvh] rounded-xl border-[2px] border-bg-red-400 mx-1">
      {start&&<Landing count={count} keyy={key.toString()} name=""/>}
      {question&&statement&&socket&&<Questions statement={statement} keyy={key.toString()} socket={socket}/>}
      {leaderboard&&<LeaderBoard score={score} />}
      {end?
      <div className="text-[20px] text-red-400 ">
          <h1 className="my-2">Thank You for your time hope you enjoy it...</h1>
          <Link to="/" className=' text-center px-4 py-2  bg-violet-400'>Home</Link>
      </div>
      :<div className="flex justify-around w-full">
        <button className="bg-red-400 px-7 py-3 rounded-xl hover:bg-red-500 touch:bg-red-200"
          onClick={handleQS}
        >Start/Resume</button>
        <button className="bg-red-400 px-7 py-3 rounded-xl hover:bg-red-500 touch:bg-red-200"
          onClick={handleGetScoreboard}
        >ShowResult</button>
      </div>}
    </div>
  )
}

export default Test