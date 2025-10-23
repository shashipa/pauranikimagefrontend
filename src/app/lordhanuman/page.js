import Ganesh from "./client";
import axios from "axios"
import { cookies } from "next/headers";
import Krishna from "./client";
import DevotionalNavbar from "../navigation/client";
export default async function page(){
const cookieStore=cookies()
const userId=await cookieStore.get("userId")?.value
 
    const token=await cookieStore.get("token")?.value
  
    const email=await  cookieStore.get("email")?.value
console.log(userId+"userId")
let URL="https://pauranikart.com/api/v1/"
const getSlideImage=async(limit)=>{
    try{
        let name="Lord Hanuman"
    const url=`${URL}image?godName=${name}&limit=${limit}`
    console.log(url)
    const data=await axios.get(url)
 //console.log(data.data)
    return data.data
    }
    catch(error){
        console.log(error)
    }
}
const data=await getSlideImage(100000)
return (
<>
<DevotionalNavbar token={token}/>
    <Krishna data={data} userId={userId}/>
    </>)
}