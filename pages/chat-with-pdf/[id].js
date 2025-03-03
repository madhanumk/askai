import { useRouter } from "next/router";
import { useEffect, useState,  useRef } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from 'react-pdf';



export default function ChatWithPdf() {
  const router = useRouter();
  const { id } = router.query;

  const [pdfData, setPdfData] = useState(null);
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [messages, setMessages] = useState([]); // Store Q&A
  const [question, setQuestion] = useState(""); // User input
  const [loading, setLoading] = useState(false); // Loading state


  useEffect(() => {
    import("pdfjs-dist/build/pdf.worker.min.mjs")
      .then((worker) => {
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      })
      .catch((err) => console.error("Failed to load PDF worker:", err));
  }, []);

  useEffect(() => {
    if (id) {
      fetchPdfData(id);
      fetchOldMessages(id);
    }
  }, [id]);

   // Scroll to bottom whenever messages update
   useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const msgBodyRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (msgBodyRef.current) {
      msgBodyRef.current.scrollTop = msgBodyRef.current.scrollHeight;
    }
  };

  const fetchPdfData = async (pdfId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("User not authenticated. Redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(`${apiUrl}/chat-with-pdf-api/${pdfId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPdfData(response.data);
      console.log("PDF Data:", response.data);
      
      // Set the PDF URL
      const fullPdfUrl = `${apiUrl}${response.data.file}`;
      console.log(`${apiUrl}${response.data.file}`);
      setPdfUrl(fullPdfUrl);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching PDF data:", error);
      setError("Failed to load PDF details. Please try again.");
    }
  };

  const fetchOldMessages = async (pdfId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${apiUrl}/api/questions/${pdfId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Ensure messages are reset on error
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/questions/${id}/`,
        { question },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data);

      setMessages((messages) => [response.data, ...messages]); // Add new Q&A at the top
      setQuestion(""); // Clear input field
      scrollToBottom();
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setLoading(false);
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page when document loads
  }

  return (
    <>
    
    <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl">
        <div className="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0">
              <li className="breadcrumb-item text-sm">
                <a className="opacity-5 text-dark" href="#">Pages</a>
              </li>
              <li className="breadcrumb-item text-sm text-dark opacity-5" aria-current="page">
                <a href="/my-pdf">Chat With PDF</a>
              </li>
              <li  className="breadcrumb-item text-sm text-dark " aria-current="page">
              {pdfData.title} ({pdfData.description})
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
      <div className="container mx-auto p-1">
      <div className="row">
        <div className="col-lg-12 col-md-6 mb-md-0 mb-4 justify-content-center">
   
            
        </div>
        <div className="col-lg-8 col-md-6 mb-md-0 mb-4">        
          {/* PDF Viewer */}
          <div className="">
              {pdfUrl && (
                <div className="pdf-viewer border rounded shadow-lg">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<p className="text-center py-6">Loading PDF...</p>}
                    error={<p className="text-center py-6 text-red-500">Error loading PDF. Please try again.</p>}
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      className="mx-auto"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={1.0}
                    />
                  </Document>
                  <div className="controls flex justify-center items-center gap-4 p-3 bg-gray-100">
                  <div className="d-flex align-items-center gap-3">
                    <button
                      disabled={pageNumber <= 1}
                      onClick={() => setPageNumber(pageNumber - 1)}
                      className="btn btn-secondary"
                    >
                      Previous
                    </button>
                    <p>Page {pageNumber} of {numPages || '-'}</p>
                    <button
                      disabled={pageNumber >= numPages}
                      onClick={() => setPageNumber(pageNumber + 1)}
                      className="btn btn-secondary"
                    >
                      Next
                    </button>
                  </div>


                  </div>
                </div>
              )}
            </div>
        </div>
        <div className="col-lg-4 col-md-6">
         <section className="message-area">
          <div className="container">
              <div className="row">
                  <div className="col-12">
                      <div className="chat-area">
                          <div className="chatbox">
                              <div className="modal-dialog-scrollable">
                                  <div className="modal-content">
                                      <div className="msg-head">
                                          <div className="row">
                                              <div className="col-8">
                                                  <div className="d-flex align-items-center">
                                                      <span className="chat-icon"><img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/arroleftt.svg" alt="image title" /></span>
                                                      <div className="flex-shrink-0">
                                                        <img className="img-fluid" src="/chatbot.png" height="45" width="45" alt="user img" />
                                                      </div>
                                                      <div className="flex-grow-1 ms-3">
                                                          <h3>PDF Chatbot</h3>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
  
  
                                      <div className="modal-body">
                                          <div ref={msgBodyRef} className="msg-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                            <ul>  
                                              {messages.length > 0 ? (
                                                messages.map((msg) => (
                                                  <>
                                                    <li key={msg.id} className="reply">
                                                      <p>{msg.question}</p>
                                                      <span className="time">10:20 am</span>
                                                    </li>
                                                    <li className="question">
                                                      <p>{msg.answer ? msg.answer.answer : "No answer yet."}</p>
                                                    </li>
                                                  </>
                                                ))
                                              ) : null}
                                            </ul>

                                          </div>
                                      </div>
  
  
                                      <div className="send-box">
                                        <form action="">
                                            <div style={{ display: "flex", alignItems: "center" }}>

                                                
                                                <input 
                                                    type="text"
                                                    value={question}
                                                    onChange={(e) => setQuestion(e.target.value)}
                                                    placeholder="Type your question..."
                                                    className="flex-grow px-4 py-2 border rounded-l"
                                                    />
                                        
                                                
                                                <button 
                                                  type="button"    
                                                  onClick={handleAskQuestion}
                                                  disabled={loading}
                  >
                                                    <i className="fa fa-paper-plane" aria-hidden="true"></i> {loading ? "Sending..." : "Send"}
                                                </button>
                                            </div>
                                        </form>  
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
  
  
                  </div>
              </div>
          </div>
          </section>
        </div>
      </div>
    </div>
    
    </>
  
  );
}