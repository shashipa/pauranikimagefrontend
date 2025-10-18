import GalleryPage from "./client"
 import axios from "axios"
 import { cookies } from "next/headers"
export default async function TypeClient(){
    const cookieStore=cookies()
const userId=await cookieStore.get("userId")?.value
console.log(userId+"userId")
const getSlideImage=async(limit)=>{
    try{
    const url=`http://localhost:7001/api/v1/image?limit=${limit}`
    const data=await axios.get(url)
   //console.log(data.data)
    return data.data
    }
    catch(error){
        console.log(error)
    }
}
const data=await getSlideImage(40)

    return (<>
    <GalleryPage data={data} userId={userId}/>
    </>)
}

