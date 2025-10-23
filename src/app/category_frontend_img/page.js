import Category_Client from "./client";
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
export default async function Category_Page(){
const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
    const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
return<>
<Category_Client/>
</>
}