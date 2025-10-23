import Img_Client from "./client";
import axios from "axios"
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
export default async function Img_Page(){
const cookieStore=cookies()
const userId=await cookieStore.get("userId")?.value
    const token=await cookieStore.get("token")?.value
    const email=await  cookieStore.get("email")?.value
console.log(userId+"userId")
const getSlideImage=async(limit)=>{
    try{
        let URL="https://pauranikart.com/api/v1/"
    const url=`${URL}image?limit=${limit}`
    const data=await axios.get(url)
  // console.log(data.data)
    return data.data
    }
    catch(error){
        console.log(error)
    }
}
const data=await getSlideImage(100000)
return (
<>
    <Img_Client data={data} userId={userId}/>
    </>)
}