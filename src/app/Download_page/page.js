import Download from "./client";
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
export default async function Download_Page(){
     const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
    const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
return (<>
<DevotionalNavbar token={token}/>
<Download/>
</>)
}