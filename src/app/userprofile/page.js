import { redirect } from "next/navigation";
import Profile from "./client";
import { cookies } from "next/headers";

export default async function page(){
    const cookieStore=cookies()
    const token=(await cookieStore).get("token")?.value
    console.log(token)
return (<>
{
    token?<Profile/>:redirect("/user")
}

</>)
}