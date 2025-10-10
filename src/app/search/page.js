import SearchPage from "./client";
import { cookies } from "next/headers";

export default async function  page() {
const cookieStore=cookies()
const userId=await cookieStore.get("userId")?.value
console.log(userId+"userId")

return (<><SearchPage userId={userId}/></>)

}