import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Login: React.FC = () => {
  // Pre-filled demo credentials
  const [email, setEmail] = useState('admin@conferencenights.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        // Attempt Supabase Login first
        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!authError && data.user) {
            localStorage.setItem('cn_admin_session', 'true');
            localStorage.setItem('cn_user_role', 'admin'); // Simplified role handling
            navigate('/admin');
            return;
        }

        // Fallback to Demo Credentials (for template/demo purposes)
        // In a real production app, you would remove this block.
        const DEMO_ADMIN_EMAIL = "admin@conferencenights.com";
        const DEMO_ADMIN_PASS = "admin123";

        // Artificial delay for realism if using demo
        await new Promise(resolve => setTimeout(resolve, 800));

        if (email.toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASS) {
            localStorage.setItem('cn_admin_session', 'true');
            navigate('/admin');
        } else {
             // If authError exists, show that, otherwise show invalid creds
             const errorMsg = authError && authError.message !== 'Invalid login credentials' 
                ? authError.message 
                : 'Invalid credentials. Please check your email and password.';
             setError(errorMsg);
        }

    } catch (err: any) {
        setError("An unexpected error occurred.");
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="bg-surface border border-white/10 p-8 md:p-10 rounded-2xl w-full max-w-md shadow-2xl relative z-10 backdrop-blur-sm">
        
        <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-surfaceHighlight to-surface border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/5 group">
                <span className="font-bold text-primary text-xl group-hover:scale-110 transition-transform">CN</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-txt-dim text-sm">Sign in to manage events, conferences, and users.</p>
        </div>

        {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm animate-fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-bold text-txt-muted uppercase tracking-wide ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white focus:border-primary/50 outline-none transition-all placeholder-txt-dim focus:bg-surfaceHighlight/50 focus:ring-1 focus:ring-primary/50"
                        placeholder="admin@conferencenights.com"
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between ml-1">
                    <label className="text-xs font-bold text-txt-muted uppercase tracking-wide">Password</label>
                </div>
                <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white focus:border-primary/50 outline-none transition-all placeholder-txt-dim focus:bg-surfaceHighlight/50 focus:ring-1 focus:ring-primary/50"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primaryHover text-background font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" /> Verifying...
                    </>
                ) : (
                    <>
                        Sign In <ArrowRight size={18} />
                    </>
                )}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-txt-dim uppercase tracking-wider">
                Restricted access. Authorized personnel only.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;