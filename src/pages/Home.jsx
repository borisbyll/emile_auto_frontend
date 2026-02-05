import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Card from '../components/Card';

const Home = () => {
  const [recentVehicles, setRecentVehicles] = useState([]);
  const { pathname, hash } = useLocation();

  // 1. Logique pour le scroll (Ancres ou Haut de page)
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Petit délai pour laisser le DOM respirer
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  // 2. Récupération des véhicules (CORRIGÉ)
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        // Suppression du /${id} qui causait l'erreur
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars`);
        const latest = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentVehicles(latest);
      } catch (err) {
        console.error("Erreur chargement nouveautés:", err);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="font-['Poppins'] bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center">
          <Link to="/">
            <img src="/images/logo.png" alt="Emile Auto Logo" className="h-16 w-auto" />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-[#184f02] transition-colors">
            Accueil
          </Link>
          <Link to="/Catalogue" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-[#184f02] transition-colors">
            Catalogue
          </Link>
          <a href="#propos" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-[#184f02] transition-colors">
            À Propos
          </a>
          <a 
            href="https://wa.me/22899794772" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[11px] font-bold uppercase tracking-widest text-[#184f02]"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* SECTION BANNIÈRE */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" 
            alt="Bannière Emile Auto" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4">
            Emile <span className="text-[#184f02]">Auto</span>
          </h1>
          <p className="text-xl md:text-2xl text-white font-light tracking-[0.4em] uppercase mb-10">
            L'excellence automobile à votre portée
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/Catalogue" className="bg-[#184f02] text-white px-12 py-4 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl text-center">
              Explorer le stock
            </Link>
            <a 
              href="https://wa.me/22899794772?text=Bonjour Emile Auto, je recherche un véhicule spécifique qui n'est pas dans votre catalogue actuel." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-12 py-4 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:text-slate-900 transition-all text-center"
            >
              Commande Spéciale
            </a>
          </div>
        </div>
      </section>

      {/* SECTION PRÉSENTATION */}
      <section id="propos" className="py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop" alt="Showroom" className="rounded-3xl shadow-2xl z-10 relative" />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#184f02]/10 rounded-3xl -z-0"></div>
          </div>
          <div className="space-y-6">
            <span className="text-[#184f02] font-black text-[10px] uppercase tracking-[0.3em] inline-block bg-green-50 px-3 py-1 rounded-full">Vision & Engagement</span>
            <h2 className="text-4xl font-bold text-slate-900 uppercase">Une nouvelle approche de l'achat automobile</h2>
            <p className="text-slate-500 leading-relaxed">Chez <strong>Emile Auto</strong>, nous croyons que l'acquisition d'un véhicule doit être une expérience transparente. Chaque voiture est inspectée selon les standards les plus stricts.</p>
          </div>
        </div>
      </section>

      {/* SECTION DERNIERS ARRIVAGES */}
      <section className="py-24 bg-slate-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-bold text-white uppercase">Nouveautés <span className="text-[#184f02] italic">en Stock</span></h2>
            <Link to="/Catalogue" className="text-white font-bold text-[11px] uppercase border-b-2 border-[#184f02] pb-2">Voir tout</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {recentVehicles.length > 0 ? (
              recentVehicles.map((car) => <Card key={car._id} car={car} />)
            ) : (
              <p className="col-span-3 text-center text-slate-400 animate-pulse">Chargement des nouveautés...</p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION CONTACT */}
      <section className="py-20 bg-white text-center px-6">
        <h3 className="text-2xl font-black uppercase text-slate-900 mb-4">Besoin d'un conseil ?</h3>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">Notre équipe vous accompagne dans votre projet automobile. Contactez-nous directement via nos canaux officiels.</p>
        <a 
          href="https://wa.me/22899794772" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-slate-900 text-white px-10 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#184f02] transition-all"
        >
          Discuter sur WhatsApp
        </a>
      </section>
    </div>
  );
};

export default Home;