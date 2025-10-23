import SearchPage from "./client";
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";

export default async function  page() {
const cookieStore=cookies()
const userId=await cookieStore.get("userId")?.value

    const token=await cookieStore.get("token")?.value
   
    const email=await  cookieStore.get("email")?.value
console.log(userId+"userId")

return (<>
<DevotionalNavbar token={token}/>
<SearchPage userId={userId}/></>)

}