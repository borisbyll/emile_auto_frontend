import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // 1. DÉTECTION DES PAGES À EXCLURE (ADMIN & LOGIN)
  // On vérifie si l'URL commence par /admin ou est exactement /login
  const isControlPanel = location.pathname.toLowerCase().startsWith('/admin') || 
                         location.pathname.toLowerCase() === '/login';

  // Si on est sur l'admin, on affiche uniquement le contenu (pas de navbar, pas de footer)
  if (isControlPanel) {
    return <>{children}</>;
  }

  // 2. LOGIQUE POUR LE FIL D'ARIANE (CAR DETAIL)
  const isCarDetail = location.pathname.startsWith('/Car/');

  return (
    <div className="min-h-screen flex flex-col font-['Poppins'] bg-white">
      {/* NAVBAR CLIENT (SANS LIEN ADMIN) */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Emile Auto" className="h-10 w-auto" />
            </Link>
            
            {/* Menu Desktop Professionnel */}
            <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
              <Link to="/" className={`hover:text-[#184f02] transition-colors ${location.pathname === '/' ? 'text-[#184f02]' : ''}`}>
                Accueil
              </Link>
              <Link to="/Catalogue" className={`hover:text-[#184f02] transition-colors ${location.pathname === '/Catalogue' ? 'text-[#184f02]' : ''}`}>
                Catalogue
              </Link>
              <Link to="/contact" className="bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-[#184f02] transition-all shadow-lg shadow-slate-200">
                Contact
              </Link>
            </div>

            {/* Menu Mobile */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown Mobile (Sans lien admin) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-50 p-6 space-y-6 shadow-2xl">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-[13px] font-bold uppercase tracking-widest">Accueil</Link>
            <Link to="/Catalogue" onClick={() => setIsMenuOpen(false)} className="block text-[13px] font-bold uppercase tracking-widest">Catalogue</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-[13px] font-bold uppercase tracking-widest text-[#184f02]">Contact</Link>
          </div>
        )}
      </nav>

      {/* FIL D'ARIANE DYNAMIQUE POUR CARDETAIL */}
      {isCarDetail && (
        <div className="bg-slate-50 border-b border-slate-100 py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-slate-900">Accueil</Link>
            <span>/</span>
            <Link to="/Catalogue" className="hover:text-slate-900">Catalogue</Link>
            <span>/</span>
            <span className="text-[#184f02]">Détails du véhicule</span>
          </div>
        </div>
      )}

      {/* CONTENU DE LA PAGE */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER (SANS LIEN ADMIN) */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/images/logo.png" alt="Emile Auto" className="h-6 w-auto mx-auto mb-6 brightness-0 invert opacity-50" />
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]">
            © 2026 Emile Auto — Qualité et Expertise Automobile
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;