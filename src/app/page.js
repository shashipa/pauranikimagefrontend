import Image from "next/image";
import TypeClient from "./Type_frontend_img/page";
import Header_frontend_page from "./header_frontend_img/page";
import Category_Client from "./category_frontend_img/client";
import Img_Page from "./img_list_frontend/page";
import ProdCategory from "./Img_middle_cat/page";
import Download_Page from "./Download_page/page";
import DevotionalNavbar from "./navigation/client";
import { cookies } from "next/headers";
export default async function Home() {
  const cookieStore=cookies()
  const token= (await cookieStore).get("token")?.value
  console.log(token+"from app page")
  return (
   <>
   <DevotionalNavbar token={token}/>
   <Header_frontend_page/>
   <Category_Client/>
   <TypeClient/>
   <Img_Page/>
   </>
  );
}
