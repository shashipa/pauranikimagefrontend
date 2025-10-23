import { redirect } from "next/navigation";
import Profile from "./client";
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
export default async function page(){
    const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
    const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
console.log(email,userId,token)
    //  console.log(token+"token from profile")
return (<>
<DevotionalNavbar token={token}/>
{
    token?
    
    <Profile userId={userId} email={email}/>:redirect("/user")
}

</>)
}