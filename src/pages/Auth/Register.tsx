// src/pages/Auth/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import googleLogo from "../../assets/google-logo.svg";
import bgImage from "../../assets/bg.webp"; // Fallback image
import { useRandomMovieBg } from "../../hooks/useRandomMovieBg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const bgUrl = useRandomMovieBg(bgImage);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate("/home");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/home");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Dynamic Cinematic Background */}
      <div 
        style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -2,
          backgroundImage: `url(${bgUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          transition: "background-image 1.5s ease-in-out",
          animation: "slowZoom 30s infinite alternate linear", // Smooth dynamic zooming
        }}
      />
      
      {/* Dark Overlay for Readability */}
      <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: "linear-gradient(to top, rgba(15,15,19,0.9) 0%, rgba(15,15,19,0.2) 50%, rgba(15,15,19,0.9) 100%)"
      }} />

      {/* Glassmorphism Form Container */}
      <div
        style={{
          width: "100%", maxWidth: "320px", padding: "40px 30px", borderRadius: "16px",
          backgroundColor: "rgba(20, 20, 25, 0.45)", // Highly transparent base
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", // Strong blur
          boxShadow: "0 15px 50px rgba(0,0,0,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column", color: "#fff",
          transform: "translateY(-5%)" // Slight upward cinematic float
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontWeight: 700, fontSize: "1.8rem", letterSpacing: "-0.5px" }}>Register</h2>
        <p style={{ textAlign: "center", color: "#b3b3c1", marginBottom: "30px", fontSize: "0.9rem" }}>Create your account</p>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.8rem", color: "#b3b3c1", fontWeight: 500 }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                padding: "12px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", 
                fontSize: "0.95rem", background: "rgba(0,0,0,0.4)", color: "#fff",
                outline: "none", transition: "border-color 0.2s, box-shadow 0.2s"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#e50914"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(229, 9, 20, 0.2)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
              required
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
             <label style={{ fontSize: "0.8rem", color: "#b3b3c1", fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                padding: "12px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", 
                fontSize: "0.95rem", background: "rgba(0,0,0,0.4)", color: "#fff",
                outline: "none", transition: "border-color 0.2s, box-shadow 0.2s"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#e50914"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(229, 9, 20, 0.2)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              padding: "12px", borderRadius: "8px", border: "none",
              backgroundColor: "#e50914", color: "#fff", fontSize: "0.95rem",
              fontWeight: 600, cursor: "pointer", marginTop: "10px",
              transition: "background-color 0.2s, transform 0.1s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f6121d"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e50914"}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Sign Up
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "25px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          <span style={{ margin: "0 15px", color: "#8b8b99", fontSize: "0.8rem", fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%", padding: "12px", borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "transparent",
            display: "flex", justifyContent: "center", alignItems: "center",
            cursor: "pointer", gap: "10px", fontWeight: 600, color: "#fff",
            fontSize: "0.95rem", transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <img src={googleLogo} alt="Google" style={{ width: "18px", height: "18px" }} />
          Google
        </button>

        <p style={{ textAlign: "center", marginTop: "30px", color: "#b3b3c1", fontSize: "0.85rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#fff", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}