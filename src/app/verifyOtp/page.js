import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OtpPage from "./client";
import DevotionalNavbar from "../navigation/client";
export default async function Page() {
  const cookieStore = await cookies();                 // ✅ await here
  const email = cookieStore.get("email")?.value || ""; // ✅ safe access
  const token=cookieStore.get("token")?.value || "";

  if (!email) redirect("/user");                       // or render a fallback

  return (
  <>
 <DevotionalNavbar token={token}/>
  <OtpPage email={email} />;
   </>
  )
}
