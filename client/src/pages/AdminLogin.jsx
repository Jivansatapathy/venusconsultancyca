import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import { setAccessToken } from "../utils/api";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const resp = await API.post("/auth/login", { email, password, userType: "admin" });
      const data = resp.data;
      
      console.log("[AdminLogin] Login response:", data);
      
      // Check if OTP is required
      if (data.requiresOTP) {
        console.log("[AdminLogin] OTP required, showing OTP form");
        console.log("[AdminLogin] Session ID:", data.sessionId);
        if (data.debugOTP) {
          console.log("[AdminLogin] DEBUG OTP (for testing):", data.debugOTP);
        }
        setShowOTP(true);
        setSessionId(data.sessionId);
        const messageText = data.debugOTP 
          ? `OTP generated: ${data.debugOTP} (Email may have failed - check console)`
          : "OTP has been sent to pareshlheru@venushiring.com. Please enter the OTP to complete login.";
        setMessage({ 
          type: "success", 
          text: messageText
        });
      } else {
        // Non-admin user or OTP not required
        const result = await login({ email, password, userType: "admin" });
        setMessage({ type: "success", text: "Login successful!" });
        
        // Redirect based on user role
        if (result?.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (result?.user?.role === "recruiter") {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Invalid credentials. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const resp = await API.post("/auth/verify-otp", {
        email,
        otp,
        sessionId
      });
      
      const { accessToken, user: userObj } = resp.data;
      
      // Set token and user
      setAccessToken(accessToken);
      setUser(userObj || null);
      
      // Store in localStorage for persistence
      if (userObj) {
        localStorage.setItem("venus_user", JSON.stringify(userObj));
        localStorage.setItem("venus_token", accessToken);
        localStorage.setItem("venus_last_login", new Date().toISOString());
      }
      
      setMessage({ type: "success", text: "Login successful!" });
      
      // Redirect based on user role
      if (userObj?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userObj?.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Invalid OTP. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <p className="title">Enter OTP</p>
          <form onSubmit={handleOTPVerification} className="form">
            <div className="input-group">
              <label htmlFor="otp">One-Time Password</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                disabled={loading}
                maxLength={6}
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 'bold' }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                Check your email at pareshlheru@venushiring.com
              </p>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="sign" disabled={loading || otp.length !== 6}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
            
            <button 
              type="button" 
              onClick={() => {
                setShowOTP(false);
                setOtp("");
                setSessionId(null);
                setMessage({ type: "", text: "" });
              }}
              className="sign"
              style={{ marginTop: '10px', background: '#6b7280' }}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <p className="title">Login</p>
        <form onSubmit={handleLogin} className="form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div className="forgot">
              <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="sign" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
