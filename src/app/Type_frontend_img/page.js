import Type from "./client"
 import axios from "axios"
 import { cookies } from "next/headers"
import DevotionalNavbar from "../navigation/client";
export default async function TypeClient(){
    const cookieStore=cookies()
const userId=await cookieStore.get("userId")?.value
 
    const token=await cookieStore.get("token")?.value
   
    const email=await  cookieStore.get("email")?.value
console.log(userId+"userId")
let URL="https://pauranikart.com/api/v1/api/v1/"
const getSlideImage=async()=>{
    try{
    const url=`${URL}image/all?page=1&limit=40000`
    const data=await axios.get(url)
   console.log(data.data)
    return data.data
    }
    catch(error){
        console.log(error)
    }
}
const data=await getSlideImage()

    return (<>
    <Type data={data} userId={userId}/>
    </>)
}

