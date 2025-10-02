import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, pwd);
      // go back to where user wanted to go or dashboard
      const dest = loc.state?.from || "/";
      nav(dest);
    } catch (e) {
      setErr(e.message || "Failed to log in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3>Log in</h3>
      <form onSubmit={onSubmit} className="mt-3">
        <input className="form-control mb-2" type="email" placeholder="Email"
               value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-control mb-3" type="password" placeholder="Password"
               value={pwd} onChange={(e) => setPwd(e.target.value)} required />
        <button className="btn btn-primary w-100" disabled={busy}>
          {busy ? "Checking..." : "Log In"}
        </button>
        {err && <div className="text-danger mt-2">{err}</div>}
      </form>
      <div className="mt-3">
        New here? <Link to="/signup">Create an account</Link>
      </div>
    </div>
  );
}
