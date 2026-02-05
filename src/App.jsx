import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/layout'; // Vérifie que le L est majuscule

// Importation des composants
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import CarDetail from './pages/CarDetail';
import Admin from './pages/Admin';
import Login from './pages/login';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- PROTECTION DES ROUTES ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// --- BOUTON WHATSAPP (Nettoyé) ---
const FloatingWhatsApp = () => {
  const location = useLocation();
  // On cache si c'est admin ou login (en minuscule pour correspondre aux routes)
  const isHidden = location.pathname.toLowerCase().startsWith('/admin') || 
                   location.pathname.toLowerCase() === '/login';
  
  if (isHidden) return null;

  const handleWhatsAppClick = async (e) => {
    e.preventDefault();
    let provenance = "Page d'accueil";
    if (location.pathname.startsWith('/Car/')) provenance = "Fiche Véhicule";
    else if (location.pathname === '/Catalogue') provenance = "Catalogue Complet";

    try {
      await axios.post(`${API_URL}/api/notifications/add`, { page: provenance });
    } catch (err) {
      console.error("Erreur notification:", err);
    } finally {
      window.open(`https://wa.me/22899794772?text=Bonjour...`, "_blank");
    }
  };

  return (
    <button onClick={handleWhatsAppClick} className="fixed bottom-8 right-8 z-[100] cursor-pointer">
       <div className="bg-[#25D366] text-white p-4 rounded-2xl shadow-lg">
         {/* Ton SVG WhatsApp ici */}
         <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M17.472 14.382c..."/></svg>
       </div>
    </button>
  );
};

function App() {
  return (
    <Router>
      {/* IMPORTANT : 
          On ne met PAS de composant <Navbar /> ici car il est déjà dans <Layout />.
          Le Layout gère lui-même l'affichage ou non de la Navbar selon l'URL.
      */}
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/Catalogue" element={<Catalogue />} />
          <Route path="/Car/:id" element={<CarDetail />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>

      <FloatingWhatsApp />
    </Router>
  );
}

export default App;