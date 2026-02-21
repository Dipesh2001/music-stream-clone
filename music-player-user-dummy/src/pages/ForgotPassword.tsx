import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {sent ? (
        <div className="text-center space-y-3">
          <p className="text-sm">If an account exists for <strong>{email}</strong>, you'll receive a reset link.</p>
          <Link to="/login" className="text-primary text-sm hover:underline">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">Enter your email and we'll send you a reset link.</p>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90">
            Send Reset Link
          </button>
          <p className="text-center text-sm text-muted-foreground"><Link to="/login" className="text-primary hover:underline">Back to login</Link></p>
        </form>
      )}
    </motion.div>
  );
}
