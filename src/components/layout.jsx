import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // 1. DÉTECTION DES PAGES À EXCLURE (ADMIN & LOGIN)
  const isControlPanel = location.pathname.toLowerCase().startsWith('/admin') || 
                         location.pathname.toLowerCase() === '/login';

  // Si on est sur l'admin, on affiche uniquement le contenu
  if (isControlPanel) {
    return <>{children}</>;
  }

  // 2. LOGIQUE POUR LE FIL D'ARIANE (CAR DETAIL)
  const isCarDetail = location.pathname.startsWith('/Car/');

  return (
    <div className="min-h-screen flex flex-col font-['Poppins'] bg-white">
      {/* NAVBAR CLIENT */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-[1000] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Emile Auto" className="h-14 w-auto" />
            </Link>
            
            {/* Menu Desktop */}
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

            {/* Menu Mobile (Bouton Croissant) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 text-slate-900 focus:outline-none z-[1100]"
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown Mobile - Amélioré */}
        <div className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl transition-all duration-300 transform ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
          <div className="p-8 space-y-6 flex flex-col items-center bg-white">
            <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)} 
                className={`text-[13px] font-bold uppercase tracking-widest ${location.pathname === '/' ? 'text-[#184f02]' : 'text-slate-600'}`}
            >
                Accueil
            </Link>
            <Link 
                to="/Catalogue" 
                onClick={() => setIsMenuOpen(false)} 
                className={`text-[13px] font-bold uppercase tracking-widest ${location.pathname === '/Catalogue' ? 'text-[#184f02]' : 'text-slate-600'}`}
            >
                Catalogue
            </Link>
            <Link 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)} 
                className="w-full text-center py-4 bg-slate-900 text-white rounded-xl text-[13px] font-bold uppercase tracking-widest"
            >
                Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* FIL D'ARIANE */}
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

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/images/logo.png" alt="Emile Auto" className="h-12 w-auto mx-auto mb-6 brightness-0 invert opacity-50" />
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]">
            © 2026 Emile Auto — Qualité et Expertise Automobile
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;