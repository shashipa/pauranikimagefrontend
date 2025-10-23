import Durga from "../godessdurga/client"
import Kali from "../godesskali/client";
import Lakshmi from "../godesslakshmi/client";
import Saraswati from "../godesssaraswati/client";
import Ganesh from "../lordganesh/client";
import Hanuman from "../lordhanuman/client";
import Krishna from "../lordkrishna/client";
import Shiva from "../lordshankar/client";
import Ram from "../lordram/client";
import Vishnu from "../lordvishnu/client";
import axios from "axios"

import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
import SearchPage from "../search/client";
export default async function page(){
const cookieStore=cookies()
const userId=await cookieStore.get("userId")?.value
    const token=await cookieStore.get("token")?.value
   // const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
console.log(userId+"userId")
let URL="https://pauranikart.com/api/v1/api/v1/"
const getSlideImage=async(limit)=>{
    try{
        let name="Godess Durga"
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
    <Durga data={data} userId={userId}/>
    </>)
}

export default function main(){
    return (<>
    
    
    </>)
}