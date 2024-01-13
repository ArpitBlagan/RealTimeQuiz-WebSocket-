const {Schema,Types}=require('mongoose');
const {model}=require('mongoose');

export const userSchema=new Schema({
    email:String,
    password:String
});
export const uDB=model('uDB',userSchema);


export const qSchema=new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'uDB'
    },
    unique_id:String,
    questions:[
        {
            title:String,
            options:[String],
            rightAns:String
        }
    ]
});
export const qDB=model('qDB',qSchema);
