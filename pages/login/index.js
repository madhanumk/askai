import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL is missing from environment variables.");
      setError("Server configuration error. Please try again later.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/login-api/`, {
        username: email,
        password: password,
      });

      // If we get here, we have a successful 2xx response
      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      router.push("/my-pdf");
      
    } catch (error) {
      console.error("Login Error:", error);
      
      // Check specific status codes from the error response
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        if (error.response.status === 401) {
          setError("Invalid credentials");
        } else {
          setError(error.response.data?.detail || "An error occurred during login");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("Error setting up request. Please try again.");
      }
    }
  };

  return (
    <main className="main-content mt-0">
      <div
        className="page-header align-items-start min-vh-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <span className="mask bg-gradient-dark opacity-6"></span>
        <div className="container my-auto">
          <div className="row">
            <div className="col-lg-4 col-md-8 col-12 mx-auto">
              <div className="card z-index-0 fadeIn3 fadeInBottom">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-dark shadow-dark border-radius-lg py-4 pe-1 text-center">
                    <h5 className="text-white font-weight-bolder">AI Ask & Summarize Agent</h5>
                    <h4 className="text-white font-weight-bolder">Sign in</h4>
                  </div>
                </div>
                <div className="card-body">
                  {error && <p className="text-danger text-center">{error}</p>}
                  <form onSubmit={handleLogin} className="text-start">
                    <div className="input-group input-group-outline my-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group input-group-outline mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn bg-gradient-dark w-100 my-4 mb-2">
                        Sign in
                      </button>
                    </div>
                  </form>
                  <hr />
                  <p className="mt-4 text-sm text-center">
                    Don't have an account? <a href="/registration" className="text-primary font-weight-bold">Sign up</a>
                  </p>
                  <p className="mt-4 text-sm text-center">Built by Madhan Umk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;