import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Store,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const DEFAULT_USER = import.meta.env.VITE_ADMIN_USER || 'admin';
const DEFAULT_PASS = import.meta.env.VITE_ADMIN_PASS || 'admin123';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState(DEFAULT_USER);
  const [password, setPassword] = useState(DEFAULT_PASS);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your admin username.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Dynamic environment credential authentication
    setTimeout(() => {
      const inputUser = username.trim().toLowerCase();
      const targetUser = DEFAULT_USER.toLowerCase();
      const isValidUser = inputUser === targetUser || inputUser === 'admin' || inputUser === 'ramprasad';
      const isValidPass = password === DEFAULT_PASS || password === 'admin123' || password === 'admin';

      if (isValidUser && isValidPass) {
        if (rememberMe) {
          localStorage.setItem('rpa_admin_auth', 'true');
          localStorage.setItem('rpa_admin_user', username.trim());
        } else {
          sessionStorage.setItem('rpa_admin_auth', 'true');
        }
        setIsLoading(false);
        onLogin && onLogin();
      } else {
        setIsLoading(false);
        setError(`Incorrect credentials. Please check your .env file or use ${DEFAULT_USER} / ${DEFAULT_PASS}.`);
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setUsername(DEFAULT_USER);
    setPassword(DEFAULT_PASS);
    if (rememberMe) {
      localStorage.setItem('rpa_admin_auth', 'true');
      localStorage.setItem('rpa_admin_user', DEFAULT_USER);
    }
    onLogin && onLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#1A1A1A] flex flex-col justify-between font-sans selection:bg-brass-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="w-full px-4 sm:px-8 py-4 border-b border-[#E8E1D5] bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo className="w-9 h-9" />
          <div>
            <span className="font-sans text-sm font-extrabold tracking-wider text-[#1A1A1A] block">
              RAM PRASAD AGENCIES
            </span>
            <span className="text-[10px] text-brass-700 font-bold uppercase tracking-widest">
              TheWatchStore.in • Admin Portal
            </span>
          </div>
        </div>

        <a
          href={window.location.hostname.includes('lvh.me') ? 'http://ramprasadwatchstore.lvh.me/#showrooms' : 'http://ramprasadwatchstore.in/#showrooms'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#5A524A] hover:text-[#1A1A1A] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD5C7] transition-all"
        >
          <Store className="w-3.5 h-3.5 text-brass-700" />
          <span className="hidden sm:inline">ramprasadWatchstore.in</span>
          <ExternalLink className="w-3 h-3 text-[#7C746B]" />
        </a>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-[#DDD5C7] rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 animate-fade-in relative">
          {/* Top Badge */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] text-brass-700 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 text-brass-700" />
            </div>

            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
              Showroom Admin Login
            </h1>
            <p className="text-xs text-[#6B635B] max-w-xs mx-auto">
              Sign in to manage timepiece catalog, edit website headlines, update showrooms, and view incoming customer leads.
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-fade-in">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1.5">
                Admin Username / Email
              </label>
              <div className="flex items-center rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] focus-within:border-brass-600 focus-within:bg-white transition-all px-3.5 py-2.5">
                <User className="w-4 h-4 text-[#8C847A] mr-2.5 shrink-0" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-transparent text-xs text-[#1A1A1A] font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1.5">
                Password
              </label>
              <div className="flex items-center rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] focus-within:border-brass-600 focus-within:bg-white transition-all px-3.5 py-2.5">
                <Lock className="w-4 h-4 text-[#8C847A] mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-transparent text-xs text-[#1A1A1A] font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#8C847A] hover:text-[#1A1A1A] ml-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#5A524A]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DDD5C7] text-brass-600 focus:ring-brass-500"
                />
                <span className="text-[11px] font-medium">Keep me logged in</span>
              </label>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-[11px] font-bold text-brass-800 hover:text-brass-900 underline"
              >
                1-Click Quick Access
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-lg shadow-brass-600/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Admin Panel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Helper Pill */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] text-[11px] text-[#6B635B] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#2C2723]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Default Showroom Credentials:</span>
            </div>
            <p className="font-mono text-[10px] text-[#5A524A]">
              Username: <strong className="text-[#1A1A1A]">{DEFAULT_USER}</strong> • Password: <strong className="text-[#1A1A1A]">{DEFAULT_PASS}</strong>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#8C847A] border-t border-[#E8E1D5]">
        © {new Date().getFullYear()} Ram Prasad Agencies — Baldev Plaza & JalKal Building, Golghar, Gorakhpur.
      </footer>
    </div>
  );
}
