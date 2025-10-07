
import axios from "axios"
import ImageDetailClient from "./client"
export default async function imgSlug({params}){
     const {slug}=await params
const url=`http://localhost:7001/api/v1/single/image?slug=${slug}`
    const data=await axios.get(url)
    let detail=data?.data?.data
   // console.log(detail)
    return (<>
      <ImageDetailClient data={detail}/>
    </>)
}