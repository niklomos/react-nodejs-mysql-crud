import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  useEffect(()=>{
    document.body.classList.add('login-page');
    return () => {
      // ลบคลาส login-page เมื่อออกจากหน้า login
      document.body.classList.remove('login-page');
    };
  },[])
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:3001/account/checkLogin", {
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.Login) {
            navigate('/home');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Incorrect username or password',
                confirmButtonText: 'Try Again'
            });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        Swal.fire({
            icon: 'error',
            title: 'An error occurred',
            text: 'Please try again later',
            confirmButtonText: 'OK'
        });
    }
  };

  return (
    <div className="login-box">
      <div className="card card-outline card-primary text-dark">
        <div className="card-header text-center">
          <a href="#" className="h1 text-decoration-none">
            <b>Manage</b>Employee
          </a>
        </div>
        <div className="card-body">
          <p className="login-box-msg">Sign in to start your session</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope" />
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
                <div className="icheck-primary">
                  <input type="checkbox" id="remember" name="RememberMe" />
                  <label htmlFor="remember">Remember Me</label>
                </div>
              </div>
              <div className="col-4">
                <button type="submit" className="btn btn-primary btn-block">
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
