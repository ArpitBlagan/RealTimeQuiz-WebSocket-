import { useEffect , useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Landing from './test/Landing';
import Questions from './test/Questions';
import LeaderBoard from './test/LeaderBoard';
import { scoree , statementt } from './Test';

const UserTest = () => {
  const location=useLocation();
  const value=location.state;
  const [socket,setS]=useState<WebSocket|null>(null);
  const [count,setC]=useState<number>(0);
  const [start,setStart]=useState<boolean>(true);
  const [question,setQuestion]=useState<boolean>(false);
  const [leaderboard,setLeaderboard]=useState<boolean>(false);
  const [end,setEnd]=useState<boolean>(false);
  const [score,setScore]=useState<scoree[]>([]);
  const [statement,setStatement]=useState<statementt|null>(null);
  useEffect(()=>{
    const sock=new WebSocket(`ws://localhost:3000?name=${value.name}`);
    const val=JSON.stringify({
      name:"addParticipant",
      id:value.key
    });
    sock.onopen=()=>{
      sock.send(val);
    }
    sock.addEventListener('message',(event:any)=>{
      console.log("message coming");
      const respon=JSON.parse(event.data);
      console.log(respon);
      if(respon.users){
        setC(respon.users);
      }
      else if(respon.name=="end"){
        setStart(false);setLeaderboard(false);setQuestion(false);
        setEnd(true);
      }
      else if(respon.name=="question"){
        setStart(false);setLeaderboard(false);setQuestion(true);
        setStatement(respon.question);
        setTimeout(()=>{
          setStart(true);setLeaderboard(false);setQuestion(false);
        },15000);
      }
      else if(respon.name=="result"){
        setStart(false);setLeaderboard(true);setQuestion(false);
        const val:scoree[]=respon.ans;
        const arr=val.sort((a:scoree,b:scoree)=>b.score - a.score)
        setScore(arr);
      }
      else if(respon.name=="error"){
        console.log("ok");
        setStart(false);setLeaderboard(false);setQuestion(false);
        setEnd(false);
      }
    });
    setS(sock);
  },[]);
  return (
    <div className="my-5 flex flex-col justify-center items-center h-[80dvh] rounded-xl border-[2px] border-bg-red-400 mx-1">
      {start&&<Landing count={count} keyy="" name={value.name.toString()}/>}
      {question&&statement&&socket&&<Questions statement={statement} keyy={value.key.toString()} socket={socket}/>}
      {leaderboard&&<LeaderBoard score={score} />}
      {end&&<div className="text-[20px] text-red-400">
          <h1 className='my-2'>Thank You for your time hope you enjoy it...</h1>
          <Link to="/" className='text-center px-4 py-2 bg-violet-400'>Home</Link>
      </div>}
      {!start&&!end&&!question&&!leaderboard&&<div className="text-[20px] text-red-400 ">
          <h1 className="my-2">Key is Not valid please enter the valid key...</h1>
          <Link to="/" className=' text-center px-4 py-2  bg-violet-400'>Home</Link>
        </div>}
    </div>
  )
}

export default UserTest