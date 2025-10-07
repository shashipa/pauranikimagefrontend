import OtpPage from "./client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function page () {
   // let router=useRouter()
    const cookieStore = await cookies();
  const data = cookieStore.get("email");
  const email=data?.value  
    return (<>
   {email?<OtpPage email={email}/>
   :redirect("/user")
   }
    </>)
    
}