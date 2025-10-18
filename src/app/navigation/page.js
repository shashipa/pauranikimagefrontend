import { redirect } from "next/navigation";
import DevotionalNavbar from "./client";
import { cookies } from "next/headers";

export default async function Nav(){
    const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
  //  console.log(token+"token from profile")
return (<>
<DevotionalNavbar token={token}/>
</>)
}