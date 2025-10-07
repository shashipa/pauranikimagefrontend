"use client"
import {use, useState} from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './page'; // custom styles if needed

export default function AddImage() {
const [godName,setGodName]=useState("")
const [imgArtType,setImgArtType]=useState("")
const [imgDesc,setImgDesc]=useState("")
const [imgHeading,setImgHeading]=useState("")
const [categories,setImgCategories]=useState("")
const [aspect_ratio,setAspectRatio]=useState("")
const [mediaType,setMediaType]=useState("")
const [imgLevel,setImgLevel]=useState("")
  const [keywordInput, setKeywordInput] = useState('');
const [imgKeyword,setImgKeyword]=useState([])
const [img_slug,setImgSlug]=useState("")
const [imgFile,setImgFile]=useState(null)
const router=useRouter()

// imgDesc, imgArtType, godName,imgHeading,
//         categories,aspect_ratio,mediaType,imgLevel,imgKeyword

const handlesubmit=async(e)=>{
e.preventDefault()
const formData=new FormData()
formData.append("godName",godName)
formData.append("imgArtType",imgArtType)
formData.append("imgDesc",imgDesc)
formData.append("imgHeading",imgHeading)
formData.append("aspect_ratio",aspect_ratio)
formData.append("mediaType",mediaType)
formData.append("imgLevel",imgLevel)
 formData.append('imgKeyword', imgKeyword.join(','));
 formData.append("img_slug",img_slug)
 formData.append("file",imgFile)

 try{
const response=await axios.post("http://localhost:7001/api/v1/image/add",formData,{
     headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
  maxBodyLength: Infinity
})
// if(response.data.success==true){
//     router.push("/pauranik_admin")
// }
// else {
//     alert("error")
// }
console.log(response.data.success)
}
catch(error){
    console.log(error)
}
}

  const addKeyword = (e) => {
    e.preventDefault()
    if (keywordInput.trim()) {
      setImgKeyword((prevKeywords) => [...prevKeywords, keywordInput.trim()]);
      setKeywordInput(''); // Clear input after adding keyword
    }
  };
  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h1 className="h4 text-center fw-bold">Image Metadata Form</h1>
              <p className="text-muted text-center mb-3">
                Static Bootstrap form — no functionality
              </p>
              <hr className="mt-2 mb-0" />
            </div>

            <div className="card-body p-4">
              <form className="row g-4" onSubmit={handlesubmit}>
                {/* Image Heading */}
                <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="imgHeading">
                    Image Heading
                  </label>
                  <input
                    type="text"
                    id="imgHeading"
                    className="form-control"
                    value={imgHeading}
                    onChange={(e)=>{setImgHeading(e.target.value)}}
                    placeholder="e.g., Divine Portrait of Lord Vishnu"
                  />
                </div>

                {/* God Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="godName">
                    God Name
                  </label>
                  <input
                    type="text"
                    id="godName"
                    value={godName}
                    onChange={(e)=>{setGodName(e.target.value)}}
                    className="form-control"
                    placeholder="e.g., Vishnu"
                  />
                </div>

                {/* Art Type */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="imgArtType">
                    Art Type
                  </label>
                  <input
                    type="text"
                    id="imgArtType"
                    value={imgArtType}
                    onChange={(e)=>{setImgArtType(e.target.value)}}
                    className="form-control"
                    placeholder="e.g., Raja Ravi Varma Style"
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="imgDesc">
                    Image Description
                  </label>
                  <textarea
                    id="imgDesc"
                    className="form-control"
                    rows="3"
                    value={imgDesc}
                    onChange={(e)=>{setImgDesc(e.target.value)}}
                    placeholder="Describe the image..."
                  />
                </div>
                 <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="imgFile">
                    Image File
                  </label>
                  <input type='file'
                    id="imgFile"
                    onChange={(e)=>{setImgFile(e.target.files[0])}}
                    className="form-control"
                    rows="3"
                    placeholder="Describe the image..."
                  />
                </div>
  <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="imgSlug">
                    Image Slug
                  </label>
                  <input type='text'
                    id="imgSlug"
                    value={img_slug}
                    onChange={(e)=>{setImgSlug(e.target.value)}}
                    className="form-control"
                    rows="3"
                    placeholder="Describe the image..."
                  />
                </div>
                {/* Categories */}
              

                {/* Aspect Ratio */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="aspect_ratio">
                    Aspect Ratio
                  </label>
                  <input
                  value={aspect_ratio}
                  onChange={(e)=>{setAspectRatio(e.target.value)}}
                    type="text"
                    id="aspect_ratio"
                    className="form-control"
                    placeholder="e.g., 16:9"
                  />
                </div>

                {/* Media Type */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="mediaType">
                    Media Type
                  </label>
                  <select id="mediaType" 
                  className="form-select"
                  value={mediaType}
                  onChange={(e)=>{setMediaType(e.target.value)}}
                  >
                      <option value="select" >select</option>
                    <option value="Image" >Image</option>
                    <option value="Video">Video</option>
                      <option value="NFT">NFT</option>
                    <option value="Illustration">Illustration</option>
                  </select>
                </div>

                {/* Image Level */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="imgLevel">
                    Image Level
                  </label>
                  <select id="imgLevel" className="form-select"
                  value={imgLevel}
                  onChange={(e)=>{setImgLevel(e.target.value)}}
                  >
                      <option value="select">select</option>
                    <option value="normal">normal</option>
                    <option value="medium">medium</option>
                    <option value="best">best</option>
                  </select>
                </div>

               
                {/* Image Keywords */}
                <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="imgKeyword">
                    Image Keywords
                  </label>
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e)=>{setKeywordInput(e.target.value)}}
                    id="imgKeyword"
                    className="form-control"
                    placeholder="Comma-separated keywords"
                  />
                </div>
                  <button 
               type="button" 
               className="btn btn-primary keywordbtn" 
              onClick={addKeyword}>Add Keyword</button>
              {/* Display Keywords */}
              <div>
                {imgKeyword.map((keyword, index) => (
                  <span key={index} style={{ marginRight: '10px' }}>
                    {keyword}
                  </span>
                ))}
              </div>

                {/* Static Submit Button */}
                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary px-5" >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
