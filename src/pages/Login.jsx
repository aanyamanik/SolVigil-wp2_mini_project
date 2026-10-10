import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Login() {


   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");


   const navigate = useNavigate();


   function handleSubmit(e) {
       e.preventDefault();


       console.log("Login submitted:", {
           email,
           password
       });


       // Temporary frontend login
       navigate("/");
   }


   return (
       <main className="auth-page">


           <div className="auth-card">


               <div className="auth-header">


                   <h1>Welcome back</h1>


                   <p>
                       Sign in to continue to SolVigil
                   </p>


               </div>




               <form onSubmit={handleSubmit}>


                   <div className="form-group">


                       <label htmlFor="email">
                           Email
                       </label>


                       <input
                           id="email"
                           type="email"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                       />


                   </div>




                   <div className="form-group">


                       <label htmlFor="password">
                           Password
                       </label>


                       <input
                           id="password"
                           type="password"
                           placeholder="Enter your password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                       />


                   </div>




                   <button
                       type="submit"
                       className="auth-button"
                   >
                       Sign In
                   </button>


               </form>




               <div className="auth-footer">


                   <p>
                       Don't have an account?
                       {" "}
                       <Link to="/register">
                           Create one
                       </Link>
                   </p>


               </div>


           </div>


       </main>
   );
}


export default Login;
