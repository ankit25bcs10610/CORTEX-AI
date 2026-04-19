import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../app/auth/AuthContext";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";

export function AuthPage() {
  const { user, signIn, signUp, signInWithGoogle, hasFirebase } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const fn = mode === "signin" ? signIn : signUp;
      const { error } = await fn(email, password);
      if (error) {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setMessage("");
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="theme-aurora min-h-screen app-bg flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-3xl border border-[var(--panel-border)] overflow-hidden shadow-[0_40px_100px_rgba(2,6,23,0.55)]">
        <div className="relative hidden lg:block p-10 bg-[linear-gradient(160deg,rgba(34,211,238,0.18),rgba(15,23,42,0.9))]">
          <div className="auth-orb" />
          <p className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-100"><Sparkles size={13} /> AI Life Operating System</p>
          <h1 className="mt-6 text-4xl font-semibold text-white leading-tight">Run your life with the clarity of a product dashboard.</h1>
          <p className="mt-4 text-slate-200/90 max-w-md">Tasks, habits, goals, learning, and AI coaching in one intelligent workspace.</p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="auth-stat"><ShieldCheck size={15} /> Secure authentication powered by Firebase</div>
            <div className="auth-stat"><Zap size={15} /> Daily planning + weekly optimization</div>
            <div className="auth-stat"><Sparkles size={15} /> AI coach recommendations that adapt to your behavior</div>
          </div>
        </div>

        <div className="p-6 md:p-10 bg-[color-mix(in_srgb,var(--panel)_84%,transparent)]">
          <h2 className="text-3xl font-semibold text-white mb-1">Welcome to Cortex-AI</h2>
          <p className="text-sm text-slate-400 mb-6">Sign in to your command center.</p>

          {!hasFirebase ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100 mb-4">
              Firebase is not configured. Add `VITE_FIREBASE_*` variables in `.env`.
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-xl bg-black/20 border border-[var(--panel-border)]">
            <button className={`rounded-lg py-2 text-sm transition ${mode === "signin" ? "bg-[var(--accent-bg)] text-[var(--accent-text)] border border-[var(--accent-soft)]" : "text-slate-300"}`} onClick={() => setMode("signin")}>Sign In</button>
            <button className={`rounded-lg py-2 text-sm transition ${mode === "signup" ? "bg-[var(--accent-bg)] text-[var(--accent-text)] border border-[var(--accent-soft)]" : "text-slate-300"}`} onClick={() => setMode("signup")}>Create Account</button>
          </div>

          <button
            type="button"
            onClick={onGoogle}
            disabled={loading || !hasFirebase}
            className="w-full mb-4 rounded-xl py-2.5 font-medium border border-[var(--panel-border)] bg-white text-slate-900 hover:bg-slate-100 transition disabled:opacity-60"
          >
            Continue with Google
          </button>
          <div className="relative mb-4">
            <div className="h-px bg-[var(--panel-border)]" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-2 text-xs text-slate-400 bg-[color-mix(in_srgb,var(--panel)_84%,transparent)]">or continue with email</span>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-xs uppercase tracking-wide text-slate-400">Email</label>
            <input type="email" required className="w-full panel-input rounded-xl px-3 py-2.5" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label className="block text-xs uppercase tracking-wide text-slate-400">Password</label>
            <input type="password" required minLength={6} className="w-full panel-input rounded-xl px-3 py-2.5" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={loading || !hasFirebase} className="w-full rounded-xl py-2.5 font-medium text-black bg-[var(--accent)] disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              {!loading ? <ArrowRight size={16} /> : null}
            </button>
          </form>

          {message ? <p className="text-sm text-slate-300 mt-4">{message}</p> : null}
          <p className="text-xs text-slate-500 mt-5">By continuing, you agree to use Cortex-AI responsibly for personal productivity improvement.</p>
        </div>
      </div>
    </div>
  );
}
