import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser, login } from "../api/users";

import "./SignUp.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createUser({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup">
      <div className="signup__card">
        <h2 className="signup__title">Create account</h2>

        {error && <div className="signup__error">{error}</div>}

        <form className="signup__form" onSubmit={handleSubmit}>
          <label className="signup__label">First name</label>
          <input
            className="signup__input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label className="signup__label">Last name</label>
          <input
            className="signup__input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label className="signup__label">Email</label>
          <input
            className="signup__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label className="signup__label">Password</label>
          <input
            className="signup__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="signup__button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="signup__footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
