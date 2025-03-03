import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await axios.post(`${apiUrl}/api/external_knowledge/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("File uploaded successfully!");
      console.log(response.data);
      if (window.confirm("File uploaded successfully! Click OK to proceed.")) {
        window.location.href = "/my-pdf"; // Redirect to success page
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload file. Please try again.");
    }
  };

  return (

    <>
     <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl">
        <div className="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0">
              <li className="breadcrumb-item text-sm">
                <a className="opacity-5 text-dark" href="#">Pages</a>
              </li>
              <li className="breadcrumb-item text-sm" aria-current="page">
                <a href="/my-pdf/" className="opacity-5">Chat With PDF</a>
              </li>
              <li className="breadcrumb-item text-sm text-dark active" aria-current="page">
                Add PDF
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
      <div className="container mt-5">
      <div
        style={{
          margin: "47px auto 0",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <h1
          style={{
            fontFamily: "Onest",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "56px",
            lineHeight: "71px",
            letterSpacing: "-0.8px",
            color: "#070D1B",
            position: "relative",
            display: "inline-block",
            padding: "0",
            margin: "0",
          }}
          className="landing-header-title"
        >
          Chat with any{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                position: "absolute",
                right: "-10px",
                top: "2px",
                backgroundColor: "#A026FF",
                width: "127px",
                height: "61px",
                transform: "rotate(1.73deg)",
                borderRadius: "10px",
                zIndex: 1,
              }}
              className="landing-header-pdf-highlight form-control"
            ></div>
            <span style={{ position: "relative", color: "white", zIndex: 2 }}>
              PDF
            </span>
          </span>
        </h1>
      </div>

      <div className="container mx-auto p-4">
        <div class="row">
          <div class="col-lg-3">

          </div>
          <div class="col-lg-6">
              <h1 className="text-2xl font-bold mb-4">Upload File</h1>
              {message && <p className="mb-2 text-red-500">{message}</p>}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label for="id_title" className="form-label">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-2 rounded form-control"
                  required
                />
                <label for="id_description" className="form-label">Description</label>
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 rounded form-control"
                  required
                ></textarea>

                <label for="id_file" className="form-label">File</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="border p-2 rounded  form-control"
                  required
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Upload
                </button>
              </form>
            
          </div>
          <div class="col-lg-3">
            
          </div>


        </div>

      </div>
    </div>
    
    </>
    
  );
}
