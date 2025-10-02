import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signup(email, pwd);
      nav("/"); // go to dashboard
    } catch (e) {
      setErr(e.message || "Failed to sign up");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3>Create account</h3>
      <form onSubmit={onSubmit} className="mt-3">
        <input className="form-control mb-2" type="email" placeholder="Email"
               value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-control mb-3" type="password" placeholder="Password"
               value={pwd} onChange={(e) => setPwd(e.target.value)} required />
        <button className="btn btn-primary w-100" disabled={busy}>
          {busy ? "Creating..." : "Sign Up"}
        </button>
        {err && <div className="text-danger mt-2">{err}</div>}
      </form>
      <div className="mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
