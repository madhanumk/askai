import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [videoURL, setVideoURL] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const environment = process.env.NEXT_PUBLIC_ENV === "DEV"; // Use NEXT_PUBLIC_ for frontend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  
  function extractULContent(htmlString) {
    // Remove <think>...</think> and its content
    htmlString = htmlString.replace(/<think>[\s\S]*?<\/think>/g, "");

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const ulElement = doc.querySelector("ul"); // Get the first <ul> element
    return ulElement ? ulElement.outerHTML : ""; // Return only the <ul> contents
  }


  const handleSubmit = async () => { // Add async here
    if (!videoURL) {
      console.log("Please enter a valid YouTube video URL.");
      return;
    }

    console.log("YouTube Video URL:", videoURL); // Move it here
    setLoading(true);

    const data = JSON.stringify({
      "video-url": videoURL
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiUrl}/api/youtube-summarizer/`,
      headers: {
        "Content-Type": "application/json"
      },
      data: data
    };

    try {
      const response = await axios.request(config); // Await the API call
      console.log("Response:", response.data);
      const extractedContent = extractULContent(response.data.summary_points);
      setContent(extractedContent);
      setLoading(false)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl">
        <div className="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0">
              <li className="breadcrumb-item text-sm">
                <a className="opacity-5 text-dark" href="#">Pages</a>
              </li>
              <li className="breadcrumb-item text-sm text-dark active" aria-current="page">
                YouTube Video Summarizer
              </li>
            </ol>
          </nav>
          <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
         
         <ul className="navbar-nav d-flex align-items-center  justify-content-end">
         
           <li className="mt-1">
             <span></span>
           </li>
           <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
             <a href="#" className="nav-link text-body p-0" id="iconNavbarSidenav"
             onClick={(e) => {
               e.preventDefault();
               document.body.classList.toggle("g-sidenav-pinned");
             }}
             >
               <div className="sidenav-toggler-inner">
               <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                 <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
                 </svg>
               </div>
             </a>
           </li>
         </ul>
       </div>
        </div>
      </nav>
  
      {/* Main Container */}
      <div className="container mt-5">
        {/* Heading */}
        <div style={{ margin: "47px auto 0", textAlign: "center", padding: "0 20px" }}>
          <h1 className="landing-header-title" style={{ fontFamily: "'Onest'", fontWeight: 700, fontSize: "56px", color: "#070D1B" }}>
            YouTube Video{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  position: "absolute",
                  right: "-10px",
                  top: "2px",
                  backgroundColor: "#A026FF",
                  width: "310px",
                  height: "61px",
                  transform: "rotate(1.73deg)",
                  borderRadius: "10px",
                  zIndex: 1,
                }}
              ></div>
              <span style={{ position: "relative", color: "white", zIndex: 2 }}>Summarizer</span>
            </span>
          </h1>
        </div>
  
        {/* Form Section */}
        <div className="row g-3 align-items-end">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            {environment ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="inputData">Enter YouTube Video URL:</label>
                  <input
                    type="url"
                    className="form-control"
                    id="inputData"
                    name="inputData"
                    value={videoURL}
                    onChange={(e) => setVideoURL(e.target.value)}
                    required
                  />
                </div>
                <button type="button" className="btn btn-primary mt-2" onClick={handleSubmit}>
                  Summarize
                </button>
              </form>
            ) : (
              <p className="mt-3">
                The YouTube Summarizer works only in the development environment and is not available on
                the cloud. I will soon share the module code on Git. You can clone and use it locally.
                If you have paid proxies, you can configure them. For more details, visit this link{" "}
                <a href="https://github.com/jdepoix/youtube-transcript-api/issues/303">
                  <u>Read</u>
                </a>
              </p>
            )}
          </div>
          <div className="col-md-3"></div>
        </div>
  
        {/* Loading Indicator */}
        {loading && (
            <div className="col-md-12 d-flex justify-content-center" id="loading-div">
                <p>Loading...</p>
            </div>
            )}
  
        {/* Summary Output */}
        <div className="col-md-12 m-5" id="summary-div">
          <div id="videoDetails" className="mt-3"></div>
          
          <div className="" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </>
  );
  
}
