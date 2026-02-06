import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const CarDetail = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [car, setCar] = useState(null);
  const [others, setOthers] = useState([]);
  const [activeImg, setActiveImg] = useState(0);

  // États pour le formulaire
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const form = useRef();

  // Force le retour en haut de page au changement d'un véhicule
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, pathname]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars/${id}`);
        setCar(res.data);
        const all = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars`);
        setOthers(all.data.filter(c => c._id !== id).slice(0, 3));
      } catch (e) { 
        console.error("Erreur Emile Auto:", e); 
      }
    };
    getData();
  }, [id]);

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Envoi en cours...");
    emailjs.sendForm('service_e39e3pt', 'template_knlavjb', form.current, 'HwgslCnp0S0sP-hdp')
      .then(() => {
        setStatus("Demande envoyée !");
        setTimeout(() => { setShowModal(false); setStatus(""); }, 2000);
        form.current.reset();
      }, () => { 
        setStatus("Erreur."); 
      });
  };

  if (!car) return <div className="p-40 text-center font-black uppercase tracking-[0.3em] text-slate-400">Chargement du véhicule...</div>;

  return (
    <div className="min-h-screen bg-white pb-20 font-['Poppins']">
      
      {/* NAVBAR STANDARD EMILE AUTO */}
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
          <a href="/#propos" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-[#184f02] transition-colors">
            À Propos
          </a>
          <a 
            href="https://wa.me/22899794772" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-[#184f02]"
          >
            Contact
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32">
        
        {/* --- SECTION DÉTAILS PRINCIPAUX --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-start">
          <div>
            <div className="bg-slate-50 rounded-[2.5rem] p-6 flex items-center justify-center min-h-[400px] border border-slate-100 overflow-hidden shadow-inner">
              <img src={car.images[activeImg]} className="max-w-full max-h-[450px] w-auto h-auto object-contain transition-all duration-500" alt={car.modele} />
            </div>
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {car.images.map((img, i) => (
                <img key={i} src={img} onClick={() => setActiveImg(i)} 
                     className={`w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-all ${activeImg === i ? 'border-[#184f02] scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                />
              ))}
            </div>
          </div>

          <div>
            <span className="text-[#184f02] font-bold uppercase text-[10px] tracking-[0.3em] mb-2 block">{car.marque}</span>
            <h1 className="text-4xl font-black text-slate-900 uppercase mb-4 leading-tight">{car.modele}</h1>
            <p className="text-2xl font-black text-slate-900 mb-8">{car.prix?.toLocaleString()} €</p>
            
            {/* GRILLE DES CARACTÉRISTIQUES (5 BLOCS - ÉTAT RETIRÉ) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[8px] uppercase font-bold text-slate-400 mb-1">Kilométrage</p>
                <p className="text-sm font-black italic text-slate-800">{car.valeurCompteur?.toLocaleString() || '0'} KM</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[8px] uppercase font-bold text-slate-400 mb-1">Année</p>
                <p className="text-sm font-black italic text-slate-800">{car.annee}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[8px] uppercase font-bold text-slate-400 mb-1">Motorisation</p>
                <p className="text-sm font-black italic text-slate-800">{car.motorisation}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[8px] uppercase font-bold text-slate-400 mb-1">Transmission</p>
                <p className="text-sm font-black italic text-slate-800">{car.transmission || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 col-span-2 md:col-span-1">
                <p className="text-[8px] uppercase font-bold text-slate-400 mb-1">Type</p>
                <p className="text-sm font-black italic text-slate-800">{car.categorie}</p>
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-[10px] font-black uppercase mb-3 underline decoration-[#184f02] underline-offset-4 tracking-widest">Description</h4>
              {/* Utilisation de whitespace-pre-wrap pour forcer les retours à la ligne */}
              <p className="text-[13px] text-slate-500 leading-relaxed font-light whitespace-pre-wrap break-words">
                {car.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button onClick={() => setShowModal(true)} className="w-full bg-[#184f02] text-white text-center py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-green-100">
                Vérifier la disponibilité
              </button>
              <a href={`https://wa.me/22899794772?text=Bonjour, je suis intéressé par le modèle ${car.marque} ${car.modele} (ID: ${car._id})`} 
                 target="_blank" rel="noopener noreferrer" className="block w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-green-600 transition-all">
                Réserver sur WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* --- SECTION SUGGESTIONS --- */}
        <div className="border-t border-slate-100 pt-16">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
              D'autres opportunités <span className="text-[#184f02] italic">Emile Auto</span>
            </h3>
            <Link to="/Catalogue" className="group text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2">
              Voir tout le stock 
              <span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#184f02] group-hover:text-white transition-all">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
              </span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {others.map(c => (
              <Link key={c._id} to={`/car/${c._id}`} className="group relative">
                <div className="relative bg-[#F8FAFC] rounded-[2.5rem] h-64 flex items-center justify-center p-8 border border-slate-100 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:border-green-100">
                  <img src={c.images[0]} className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110" alt={c.modele} />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm">
                    <p className="text-[11px] font-black text-slate-900">{c.prix?.toLocaleString()} €</p>
                  </div>
                </div>

                <div className="mt-6 px-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] font-black text-[#184f02] uppercase tracking-widest mb-1">{c.marque}</p>
                      <h5 className="text-lg font-black uppercase text-slate-900 leading-tight group-hover:text-[#184f02] transition-colors">{c.modele}</h5>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{c.annee}</p>
                      <p className="text-[9px] font-medium text-slate-300 uppercase">{c.motorisation}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODAL DE CONTACT --- */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 text-xl font-bold">✕</button>
            <h3 className="text-2xl font-black text-slate-900 uppercase mb-2">Vérifier la disponibilité</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8 border-b pb-4 italic">Ref : {car._id}</p>
            
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <input type="hidden" name="car_id" value={car._id} />
              <input type="hidden" name="car_name" value={`${car.marque} ${car.modele}`} />
              
              <input type="text" name="user_name" placeholder="Votre nom" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#184f02]" />
              <input type="email" name="user_email" placeholder="Votre email" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#184f02]" />
              <textarea name="message" placeholder="Votre message..." rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#184f02] resize-none"></textarea>
              
              <button type="submit" className="w-full bg-[#184f02] text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-slate-900 transition-all">
                Envoyer la demande
              </button>
              {status && <p className="text-center text-[10px] font-bold text-[#184f02] uppercase mt-4 animate-pulse">{status}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetail;