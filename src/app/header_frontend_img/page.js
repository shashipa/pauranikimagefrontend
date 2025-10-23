import Header_fronted_client from "./client"
import axios from "axios"
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
export default async function Categories(){
let URL="https://pauranikart.com/api/v1/"
 const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
    const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
const getSlideImage=async(limit)=>{
    try{
    const url=`${URL}image?limit=${limit}&aspect_ratio=768:768`
    const data=await axios.get(url)
    //console.log(data.data)
    return data.data
    }
    catch(error){
        console.log(error)
    }
}
const data=await getSlideImage(10)
return (
<>
<DevotionalNavbar token={token}/>
    <Header_fronted_client data={data}/>
    </>)
}