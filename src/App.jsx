import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

// Importation de tes composants
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import CarDetail from './pages/CarDetail';
import Admin from './pages/Admin';
import Login from './pages/login';

// --- COMPOSANT : PROTECTION DES ROUTES ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- COMPOSANT : BOUTON WHATSAPP MODERNE (AVEC NOTIFICATION CORRIGÉE) ---
const FloatingWhatsApp = () => {
  const location = useLocation();
  
  // Ne pas afficher le bouton sur l'admin ou le login
  const hideWhatsApp = location.pathname.startsWith('/admin') || location.pathname === '/login';
  
  if (hideWhatsApp) return null;

  const whatsappNumber = "22899794772";
  const message = encodeURIComponent("Bonjour Emile Auto, j'aurais besoin d'une assistance concernant un véhicule.");
  
  const handleWhatsAppClick = async (e) => {
    e.preventDefault();

    // --- LOGIQUE DE PROVENANCE AMÉLIORÉE ---
    let provenance = "Page d'accueil";
    if (location.pathname.startsWith('/car/')) {
      // Si on est sur une fiche, on essaie de récupérer le nom via le titre de la page
      // (CarDetail met généralement à jour document.title)
      provenance = document.title.replace(" | Emile Auto", "") || "Fiche Véhicule";
    } else if (location.pathname === '/catalogue') {
      provenance = "Catalogue Complet";
    }

    try {
      // On envoie le signal au serveur avec le nom de la page au lieu de l'URL
      await axios.post('http://localhost:5000/api/notifications/add', {
        page: provenance 
      });
    } catch (err) {
      console.error("Erreur notification:", err);
    } finally {
      // On ouvre WhatsApp quoi qu'il arrive
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    }
  };

  return (
    <button 
      onClick={handleWhatsAppClick}
      className="fixed bottom-8 right-8 z-[100] flex items-center group bg-transparent border-none p-0 outline-none cursor-pointer"
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-20 animate-ping"></span>
      <div className="relative bg-[#25D366] text-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:scale-110 transition-all duration-300 flex items-center">
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.2em] whitespace-nowrap">
          Conseiller en ligne
        </span>
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.602 6.006L0 24l6.149-1.613a11.82 11.82 0 005.895 1.564h.005c6.635 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.527-8.503z"/>
        </svg>
      </div>
    </button>
  );
};

// --- COMPOSANT : NAVBAR EMILE AUTO ---
const Navbar = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') || location.pathname === '/login';
  
  if (hideNavbar) return null;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[90]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs group-hover:bg-amber-600 transition-colors">E</div>
          <span className="text-xl font-black tracking-tighter uppercase text-slate-900">
            Emile <span className="text-amber-600">Auto</span>
          </span>
        </Link>
        
        <div className="hidden md:flex gap-10 items-center">
          <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Accueil</Link>
          <Link to="/catalogue" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Inventaire</Link>
          <Link to="/admin" className="px-5 py-2 bg-slate-50 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">Espace Admin</Link>
        </div>
      </div>
    </nav>
  );
};

// --- CONFIGURATION PRINCIPALE DE L'APPLICATION ---
function App() {
  return (
    <Router>
      <div className="relative min-h-screen selection:bg-amber-100 selection:text-amber-900">
        <Navbar />
        
        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Home />} />
        </Routes>

        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

export default App;