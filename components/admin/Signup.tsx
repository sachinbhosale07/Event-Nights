
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Lock, Mail, User, AlertCircle, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Try Supabase Signup
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: searchParams.get('role') || 'Editor'
          }
        }
      });

      // Handle Supabase errors or Fallback to Local Demo Mode if Supabase is not reachable/configured
      if (authError) {
         // Check if it's likely a config/connection issue to fallback to demo
         const isConnectionIssue = authError.message.includes('service') || authError.status === 500 || authError.message === 'Failed to fetch';
         
         if (isConnectionIssue) {
            console.warn("Supabase unavailable, using local demo storage");
            const demoUsers = JSON.parse(localStorage.getItem('cn_demo_users') || '[]');
            
            // Check if exists
            if (demoUsers.find((u: any) => u.email === email)) {
                setError("User already exists (Demo Mode)");
                setLoading(false);
                return;
            }

            demoUsers.push({ 
                id: 'demo_' + Date.now(),
                email, 
                password, 
                name, 
                role: searchParams.get('role') || 'Editor' 
            });
            localStorage.setItem('cn_demo_users', JSON.stringify(demoUsers));
            
            // Auto login for demo
            localStorage.setItem('cn_admin_session', 'true');
            navigate('/admin');
            return;
         } else {
             throw authError;
         }
      }

      if (data.user) {
        alert("Account created successfully! Please sign in.");
        navigate('/admin/login');
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back Button */}
      <Link 
        to="/admin/login" 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2 text-txt-dim hover:text-white transition-colors bg-surface/50 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-md hover:bg-surface"
      >
        <ChevronLeft size={18} />
        <span className="font-medium text-sm">Back to Login</span>
      </Link>

      <div className="bg-surface border border-white/10 p-8 md:p-10 rounded-2xl w-full max-w-md shadow-2xl relative z-10 backdrop-blur-sm animate-fade-in-up">
        
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
            <p className="text-txt-dim text-sm">Join the team to manage events.</p>
        </div>

        {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm animate-fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-txt-muted uppercase tracking-wide ml-1">Full Name</label>
                <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary/50 outline-none transition-all placeholder-txt-dim focus:bg-surfaceHighlight/50 focus:ring-1 focus:ring-primary/50"
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-txt-muted uppercase tracking-wide ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary/50 outline-none transition-all placeholder-txt-dim focus:bg-surfaceHighlight/50 focus:ring-1 focus:ring-primary/50"
                        placeholder="Enter email"
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-txt-muted uppercase tracking-wide ml-1">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary/50 outline-none transition-all placeholder-txt-dim focus:bg-surfaceHighlight/50 focus:ring-1 focus:ring-primary/50"
                        placeholder="Create password"
                        minLength={6}
                    />
                </div>
            </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-txt-muted uppercase tracking-wide ml-1">Confirm Password</label>
                <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-dim group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary/50 outline-none transition-all placeholder-txt-dim focus:bg-surfaceHighlight/50 focus:ring-1 focus:ring-primary/50"
                        placeholder="Confirm password"
                        minLength={6}
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
                        <Loader2 size={18} className="animate-spin" /> Creating Account...
                    </>
                ) : (
                    <>
                        Sign Up <ArrowRight size={18} />
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
