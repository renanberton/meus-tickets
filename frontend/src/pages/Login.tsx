import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      navigate('/tickets');
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md shadow-sm">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-[#1a1a2e] rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <span className="text-base font-medium text-gray-800">Meus Tickets</span>
        </div>

        <h1 className="text-xl font-medium text-gray-900 mb-1">Bem-vindo de volta</h1>
        <p className="text-sm text-gray-400 mb-6">Faça login para acessar seus tickets</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">
              SENHA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300">ou</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            type="button"
            className="w-full border border-gray-200 rounded-lg py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <line x1="12" y1="18" x2="12" y2="18.5" strokeLinecap="round" strokeWidth="3"/>
            </svg>
            Entrar com autenticador 2FA
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 mt-5">
          <svg className="w-3 h-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="text-xs text-gray-300">Conexão segura com criptografia JWT</span>
        </div>
      </div>
    </div>
  );
}