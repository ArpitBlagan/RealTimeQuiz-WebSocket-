export interface user{
    name:string,
    socket:WebSocket
}
export class userManager{
    private users:user[];
    constructor(){
        this.users=[];
    }
    addUser(name:string,ws:WebSocket){
        this.users.push({name:name,socket:ws});
        console.log(this.users);
    }
    removeUser(ws:WebSocket){
        this.users=this.users.filter((ele)=>{
            return ele.socket!=ws
        });
        console.log(this.users);
    }
}