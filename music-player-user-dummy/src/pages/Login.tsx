import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/schemas/auth.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) { setError(parsed.error.errors[0].message); return; }

    setLoading(true);
    try {
      await login(parsed.data as { email: string; password: string });
      navigate("/home");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Demo login
  const handleDemo = () => {
    const demoUser = { id: "demo", name: "Demo User", email: "demo@auralis.com" };
    const ctx = (window as any).__auth;
    // Use context login directly for demo
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("access_token", "demo-token");
    window.location.href = "/home";
  };

  return (
    <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 disabled:opacity-50">
        {loading ? "Signing in…" : "Sign In"}
      </button>
      <button type="button" onClick={handleDemo} className="w-full py-2.5 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/80">
        Try Demo
      </button>
      <div className="text-center text-sm space-y-1">
        <Link to="/forgot-password" className="text-primary hover:underline block">Forgot password?</Link>
        <p className="text-muted-foreground">Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link></p>
      </div>
    </motion.form>
  );
}
