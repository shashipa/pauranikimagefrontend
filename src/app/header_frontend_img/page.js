import Header_fronted_client from "./client"
import axios from "axios"
export default async function Header_frontend_page(){

const getSlideImage=async(limit)=>{
    try{
    const url=`http://localhost:7001/api/v1/image?limit=${limit}`
    
    const data=await axios.get(url)
   // console.log(data.data)
    return data.data
    }
    catch(error){
        console.log(error)
    }
}
const data=await getSlideImage(10)
return (
<>
    <Header_fronted_client data={data}/>
    </>)
}