import { boolean } from "zod";
import { qDB } from "../schemas/userQuesSchema"
interface ques{
    title:string,
    options:string[],
    rightAns:string
}
interface participant{
    socket:WebSocket,
    name:string,
    score:number,
}
interface result{
    name:string,
    score:number
}
interface room{
    id:string,
    participants:participant[],
    questions:ques[],
    current:number
}

export class Quiz{
    private rooms:room[];
    constructor(){
        this.rooms=[];
    }
    async createRoom(id:string,ws:WebSocket,name:string){
        let have=false;
        this.rooms.forEach((ele)=>{
            if(ele.id==id){have=true;}
        });
        if(!have){
            const res=await qDB.find({unique_id:id},{questions:1});
            this.rooms.push({id,participants:[{socket:ws,name,score:0}],questions:res[0].questions,current:0});
            console.log("creating Room");
            console.log(this.rooms);
        }
    }
    delteRoom(id:string){
        this.rooms=this.rooms.filter((ele)=>{
            ele.id!=id;
        })
        console.log("room removed");
        console.log(this.rooms);
    }
    addParticipants(id:string,ws:WebSocket,name:string){
        let found=false;
        this.rooms.forEach((ele)=>{
            if(ele.id==id){
                found=true;
                let have=false;
                ele.participants.forEach((el)=>{
                    if(el.socket==ws){have=true;}
                });if(!have){
                ele.participants.push({socket:ws,name,score:0});
                const data=JSON.stringify({users:ele.participants.length});
                console.log("participitants",ele.participants);
                ele.participants.forEach((ee)=>{
                    console.log("sending...")
                    ee.socket.send(data);
                });}
            }
        });
        if(!found){
            const data=JSON.stringify({name:"error",value:"Not found"});
            ws.send(data);
        }
    }
    getResult(id:string){
        this.rooms.forEach((ele)=>{
            if(ele.id==id){
                let ans:result[]=[]
                ele.participants.forEach((ee)=>{
                    ans.push({score:ee.score,name:ee.name});
                });
                const data=JSON.stringify({name:"result",ans});
                ele.participants.forEach((ee)=>{
                    ee.socket.send(data);
                });
            }
        })
    }
    participantAns(id:string,ws:WebSocket,ans:string,time:number){
        let score=0;
        // calculat the score with respect to timing
        this.rooms.forEach((ele)=>{
            if(ele.id==id){
                console.log(ele.questions[ele.current-1].rightAns,ans);
                if(ele.questions[ele.current-1].rightAns==ans){
                    score=100*(15-(15-time));
                }
                ele.participants.forEach((eee)=>{
                    if(eee.socket==ws){
                        eee.score+=score;
                    }
                });
            }
        });
        console.log("done add score for user");
    }
    startQuiz(id:string){
        //admin will start the test right
        this.nextQues(id);
    }
    nextQues(id:string){
        this.rooms.forEach((ele)=>{
            if(ele.id==id){
                if(ele.current==ele.questions.length){
                    ele.participants.forEach((ee)=>{
                        ee.socket.send(JSON.stringify({name:"end"}));
                    });
                    this.delteRoom(id);
                    return;
                }
                const data=JSON.stringify(
                    {   name:"question",
                        question:ele.questions[ele.current]
                    }
                );
                ele.participants.forEach((ee)=>{
                    console.log("sending question to participants")
                    ee.socket.send(data);
                });
                ele.current++;
            }
        });
    }
}