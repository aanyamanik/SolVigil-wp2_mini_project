import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Register() {


   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");


   const navigate = useNavigate();




   function handleSubmit(e) {


       e.preventDefault();


       if (password !== confirmPassword) {
           alert("Passwords do not match.");
           return;
       }


       console.log("Registration submitted:", {
           name,
           email,
           password
       });


       // Temporary frontend registration
       navigate("/login");
   }




   return (
       <main className="auth-page">


           <div className="auth-card">


               <div className="auth-header">


                   <h1>Create your account</h1>


                   <p>
                       Start using SolVigil
                   </p>


               </div>




               <form onSubmit={handleSubmit}>


                   <div className="form-group">


                       <label htmlFor="name">
                           Full Name
                       </label>


                       <input
                           id="name"
                           type="text"
                           placeholder="Enter your name"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           required
                       />


                   </div>




                   <div className="form-group">


                       <label htmlFor="register-email">
                           Email
                       </label>


                       <input
                           id="register-email"
                           type="email"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                       />


                   </div>




                   <div className="form-group">


                       <label htmlFor="register-password">
                           Password
                       </label>


                       <input
                           id="register-password"
                           type="password"
                           placeholder="Create a password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           minLength="6"
                           required
                       />


                   </div>




                   <div className="form-group">


                       <label htmlFor="confirm-password">
                           Confirm Password
                       </label>


                       <input
                           id="confirm-password"
                           type="password"
                           placeholder="Confirm your password"
                           value={confirmPassword}
                           onChange={(e) =>
                               setConfirmPassword(e.target.value)
                           }
                           minLength="6"
                           required
                       />


                   </div>




                   <button
                       type="submit"
                       className="auth-button"
                   >
                       Create Account
                   </button>


               </form>




               <div className="auth-footer">


                   <p>
                       Already have an account?
                       {" "}
                       <Link to="/login">
                           Sign in
                       </Link>
                   </p>


               </div>


           </div>


       </main>
   );
}


export default Register;
