import Kaali from "./client";
import axios from "axios"
import { cookies } from "next/headers";
export default async function page(){
const cookieStore=cookies()
const userId=await cookieStore.get("userId")?.value
console.log(userId+"userId")
const getSlideImage=async(limit)=>{
    try{
        let name="Godess Kaali"
    const url=`http://localhost:7001/api/v1/image?godName=${name}&limit=${limit}`
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
    <Kaali data={data} userId={userId}/>
    </>)
}