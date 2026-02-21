import { motion } from "framer-motion";
import { Music2, Play, Headphones, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "@/lib/constants";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Music2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/register")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</button>
          <button onClick={() => navigate("/login")} className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">Log In</button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Music for <span className="text-primary">every</span> moment
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Stream millions of songs, discover new artists, and create your perfect playlist. All free.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3">
          <button onClick={() => navigate("/register")} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
            Get Started Free
          </button>
          <button onClick={() => navigate("/home")} className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/80 transition-colors">
            Browse Music
          </button>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl w-full">
          {[
            { icon: Play, title: "Unlimited Streaming", desc: "Listen to any song, any time" },
            { icon: Headphones, title: "High Quality Audio", desc: "Crystal clear sound experience" },
            { icon: Radio, title: "Personalized Radio", desc: "Discover music you'll love" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl bg-card/50 border border-border/50 text-center space-y-2">
              <Icon className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
