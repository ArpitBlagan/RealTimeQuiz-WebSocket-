interface Props{
    count:number,
    keyy:string,
    name:string
}
const Landing:React.FC<Props> = ({count,keyy,name}) => {
    
  return (
    <div>
        <h1 className="text-[30px]"><span className="underline text-red-400">{(name.length==0)?"Key:":"Name:"} </span> 
        {name.length>0&&name} {keyy.length>0&&keyy}</h1>
      <div className="h-[10dvh] mt-10">
        <h1 >Joined Users count</h1>
        <h1 className="text-[30px] text-center"> {count>=1?count-1:0} </h1>
      </div>
    </div>
  )
}

export default Landing