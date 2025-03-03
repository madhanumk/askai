import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

const RegistrationForm = () => {



  
  // State to store form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  // State to handle loading and errors
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirm_password: "",
    non_field_errors: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic validation
    let newErrors = {};
    let hasErrors = false;

    if (!formData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      hasErrors = true;
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    setLoading(true);
    setErrors({
      email: "",
      password: "",
      confirm_password: "",
      non_field_errors: "",
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // Send POST request to the server
      const response = await axios.post(`${apiUrl}/api/register/`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle successful response
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      // You might want to redirect here
    } catch (error) {
      // Handle server errors
      console.error("Registration failed:", error.response ? error.response.data : error.message);
      
      if (error.response && error.response.data) {
        // Handle structured error responses from Django
        const serverErrors = error.response.data;
        const newErrors = { ...errors };
        
        Object.keys(serverErrors).forEach(key => {
          if (newErrors.hasOwnProperty(key)) {
            newErrors[key] = serverErrors[key].join(" ");
          } else {
            newErrors.non_field_errors = "Registration failed. Please try again.";
          }
        });
        
        setErrors(newErrors);
      } else {
        setErrors({
          ...errors,
          non_field_errors: "Registration failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content mt-0">
      <section>
        <div className="page-header min-vh-100">
          <div className="container">
            <div className="row">
              <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
                <div 
                  className="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center" 
                  style={{ backgroundImage: "url('/assets/img/illustrations/illustration-signup.jpg')", backgroundSize: "cover" }}
                >
                </div>
              </div>
              <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto">
                <div className="card card-plain">
                  <div className="card-header">
                    <h5 className="font-weight-bolder mt-2 mb-0">AI Ask & Summarize Agent</h5>
                    <h4 className="font-weight-bolder">Sign Up</h4>
                    <p className="mb-0">Enter your email and password to register</p>
                  </div>
                  <div className="card-body">
                    <form role="form" onSubmit={handleSubmit}>
                      {/* Email Field */}
                      <div className="input-group input-group-outline mb-3">
                       
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {errors.email && (
                        <div className="text-danger">
                          {errors.email}
                        </div>
                      )}
                      
                      {/* Password Field */}
                      <div className="input-group input-group-outline mb-3">
                       
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {errors.password && (
                        <div className="text-danger">
                          {errors.password}
                        </div>
                      )}
                      
                      {/* Confirm Password Field */}
                      <div className="input-group input-group-outline mb-3">
                        
                        <input
                          type="password"
                          name="confirm_password"
                          className="form-control"
                           placeholder="Confirm Password"
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {errors.confirm_password && (
                        <div className="text-danger">
                          {errors.confirm_password}
                        </div>
                      )}
                      
                      {/* Non-Field Errors */}
                      {errors.non_field_errors && (
                        <div className="alert alert-danger">
                          {errors.non_field_errors}
                        </div>
                      )}
                      
                      <div className="text-center">
                        <button 
                          type="submit" 
                          className="btn btn-lg bg-gradient-dark btn-lg w-100 mt-4 mb-0"
                          disabled={loading}
                        >
                          {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center pt-0 px-lg-2 px-1">
                    <p className="mb-2 text-sm mx-auto">
                      Already have an account?
                      <Link href="/login" className="text-primary text-gradient font-weight-bold ms-1">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegistrationForm;