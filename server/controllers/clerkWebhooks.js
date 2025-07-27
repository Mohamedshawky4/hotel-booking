import User from "../models/User.js";
import { Webhook } from "svix";
const clerkWebhook = async (req, res) => {
    try{
        const whook= new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers={
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        }
        await whook.verify(JSON.stringify(req.body),headers);
        
        const {data,type}=req.body;
        const userData={
            _id:data.id,
            username:data.first_name+" "+data.last_name,
            email:data.email_address[0].email_address,
            image:data._url,
        }
        //switch for diff events
        switch(type){
            case "user.created":
                await User.create(userData);
                break;
            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData);
                break;
            case "user.deleted":
                await User.findOneAndDelete(data.id);
                break;
                default:
                break;
        }
       res.JSON({success:true , message:"webhook verified"});
    }
    catch(error){
        console.log(error.message);
        res.JSON({success:false , message:"webhook not verified"});
    }
}
export default clerkWebhook;