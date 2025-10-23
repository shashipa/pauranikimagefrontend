import { cookies } from "next/headers";
import { headers } from "next/headers";
import LoginForm from "./client";
import DevotionalNavbar from "../navigation/client";
export default async function page(){
  const cookieStore = cookies();
 const token =await cookieStore.get("token");
 
 console.log(token)
return (<>
<DevotionalNavbar token={token}/>
<LoginForm  token={token}/>
</>)
}