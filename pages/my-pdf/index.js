import { useEffect, useState } from "react";
import axios from "axios";


export default function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loadingChunks, setLoadingChunks] = useState({}); // Track loading state per row
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (page) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("User not authenticated. Redirecting to login...");
        window.location.href = "/login";
        return;
      }
      const response = await axios.get(`${apiUrl}/api/external_knowledge/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("access_token");
      await axios.delete(`${apiUrl}/api/external_knowledge/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
      setError("Failed to delete item. Please try again.");
    }
  };

  const handleGenerateChunks = async (id) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Access token not found. Please log in.");
      return;
    }

    setLoadingChunks((prevState) => ({ ...prevState, [id]: true }));

    try {
      const response = await axios.post(
        `${apiUrl}/api/knowledge/${id}/process/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Chunks generated successfully:", response.data.message);

        // Update the chunk status dynamically in the UI
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, chunks_generated: true } : item
          )
        );
      } else {
        console.error("Failed to generate chunks:", response.data.message);
      }
    } catch (error) {
      console.error("Error generating chunks:", error.response?.data || error.message);
    } finally {
      setLoadingChunks((prevState) => ({ ...prevState, [id]: false }));
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
              <li className="breadcrumb-item text-sm text-dark active" aria-current="page">
                Chat With PDF
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

      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
                  <h6 className="text-white text-capitalize ps-3">My PDFs</h6>
                  <a href="/add-pdf/" className="btn btn-primary me-3">
                    Add New PDF
                  </a>
                </div>
              </div>

              <div className="card-body px-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Title</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Description</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Created On</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Chunks Status</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">View/Chat</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((pdf) => (
                          <tr key={pdf.id}>
                            <td>
                            <div className="d-flex px-2 py-1">
                                <h6 className="mb-0 text-sm">{pdf.title}</h6>
                            </div>                             
                            </td>
                            <td>
                              <p className="text-xs font-weight-bold mb-0">{pdf.description}</p>
                            </td>
                            <td className="align-middle text-center text-sm">
                              <span className="text-secondary text-xs font-weight-bold">{pdf.created_on}</span>
                            </td>
                            <td className="align-middle text-center">
                              {pdf.chunks_generated ? (
                                <span className="badge badge-sm bg-gradient-success">Generated</span>
                              ) : (
                                <button
                                  className="badge badge-sm bg-gradient-danger"
                                  onClick={() => handleGenerateChunks(pdf.id)}
                                  disabled={loadingChunks[pdf.id]}
                                >
                                  {loadingChunks[pdf.id] ? "Generating..." : "Generate"}
                                </button>
                              )}
                            </td>
                            <td className="align-middle text-center">
                              {pdf.chunks_generated ? (
                                <a href={`/chat-with-pdf/${pdf.id}`} className="text-secondary font-weight-bold text-xs">
                                  Chat
                                </a>
                              ) : (
                                <span
                                  className="text-secondary font-weight-bold text-xs"
                                  title="Chunks not generated"
                                  style={{ cursor: "not-allowed", opacity: 0.5 }}
                                >
                                  Chat
                                </span>
                              )}
                            </td>
                            <td className="align-middle text-center">
                              <i
                                className="material-symbols-rounded text-sm me-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDelete(pdf.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17" height="17" viewBox="0 0 24 24">
                                  <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                                </svg>
                              </i>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center p-4">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="mt-4 flex justify-center ml-4 px-2">
                    <button style={{marginBottom: '0rem'}} onClick={() => setPage(page - 1)} disabled={page <= 1} className="btn btn-secondary me-2">
                      Previous
                    </button>
                    <span className="mx-4 text-lg">
                      Page {page} of {totalPages}
                    </span>
                    <button style={{marginBottom: '0rem'}} onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="btn btn-secondary">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
