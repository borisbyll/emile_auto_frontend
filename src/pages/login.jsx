import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // CORRECTION : Utilisation de la variable d'environnement
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, credentials);

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else {
        // Message plus adapté pour la production
        setError('Une erreur est survenue lors de la connexion au serveur.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-['Poppins'] p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold tracking-[0.2em] text-slate-900 uppercase">
            Emile <span className="text-[#184f02]">Auto</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Accès Restreint</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identifiant Admin</label>
            <input 
              type="email" 
              className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#184f02] transition-all text-sm font-medium"
              placeholder="admin@emileauto.com"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
            <input 
              type="password" 
              className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#184f02] transition-all text-sm font-medium"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3">
              <p className="text-red-700 text-[10px] font-bold uppercase text-center">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-slate-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:-translate-y-1'}`}
          >
            {isLoading ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;