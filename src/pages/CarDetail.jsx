import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const CarDetail = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [others, setOthers] = useState([]);
  const [activeImg, setActiveImg] = useState(0);

  // États pour le formulaire
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const form = useRef();

  // Force le retour en haut de page
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
    setStatus("Envoi...");
    
    emailjs.sendForm('service_8v8pyp8', 'template_qre7nbe', form.current, 'L11-5W-L7_y9_L8_Y')
      .then(() => {
        setStatus("Message envoyé avec succès !");
        setShowModal(true);
        form.current.reset();
      }, (error) => {
        setStatus("Erreur lors de l'envoi.");
        console.log(error.text);
      });
  };

  if (!car) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">Chargement Emile Auto...</div>;

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* BOUTON RETOUR EN ARRIÈRE - Ajouté proprement */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <div className="p-2 rounded-full bg-slate-50 group-hover:bg-slate-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Retour au catalogue</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* COLONNE GAUCHE : IMAGES - Conservation du rounded-[2rem] */}
          <div className="space-y-6">
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 shadow-2xl">
              <img 
                src={car.images[activeImg]} 
                alt={car.modele} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {car.images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImg(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImg === index ? 'border-[#184f02] scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="miniature" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* COLONNE DROITE : INFOS & CONTACT */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                {car.categorie}
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mt-4 uppercase italic tracking-tighter">
                {car.marque} <span className="text-[#184f02]">{car.modele}</span>
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-2xl font-bold text-slate-400">{car.annee}</p>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                <p className="text-2xl font-bold text-[#184f02]">
                  {Number(car.prix).toLocaleString()} <span className="text-xs uppercase ml-1">CFA</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kilométrage</p>
                <p className="text-lg font-black text-slate-900">{Number(car.valeurCompteur).toLocaleString()} KM</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Motorisation</p>
                <p className="text-lg font-black text-slate-900">{car.motorisation}</p>
              </div>
            </div>

            {/* FORMULAIRE - Retour au style sombre original */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 text-center mb-8">
                <h2 className="text-white font-bold text-lg uppercase tracking-widest">S'informer sur ce véhicule</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">Réponse rapide de l'équipe Emile Auto</p>
              </div>

              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-slate-800 pb-4 italic">Ref : {car._id}</p>
            
              <form ref={form} onSubmit={sendEmail} className="space-y-4">
                <input type="hidden" name="car_id" value={car._id} />
                <input type="hidden" name="car_name" value={`${car.marque} ${car.modele}`} />
                
                <input type="text" name="user_name" placeholder="Votre nom" required className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-4 outline-none focus:border-[#184f02] placeholder-slate-500" />
                <input type="email" name="user_email" placeholder="Votre email" required className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-4 outline-none focus:border-[#184f02] placeholder-slate-500" />
                <textarea name="message" placeholder="Ex: Bonjour, je souhaite avoir plus de photos..." rows="3" className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-4 outline-none focus:border-[#184f02] resize-none placeholder-slate-500"></textarea>
                
                <button type="submit" className="w-full bg-[#184f02] text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                  Envoyer la demande
                </button>
              </form>

              {status && <p className="mt-4 text-center text-white text-[10px] font-bold uppercase tracking-widest">{status}</p>}
            </div>
          </div>
        </div>

        {/* SECTION AUTRES VÉHICULES */}
        <div className="mt-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[10px] font-black text-[#184f02] uppercase tracking-[0.4em] mb-2">Opportunités</p>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Autres <span className="italic">Véhicules</span></h2>
            </div>
            <Link to="/Catalogue" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1">Voir tout le stock</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {others.map((other) => (
              <Link to={`/Car/${other._id}`} key={other._id} className="group">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-xl">
                  <img src={other.images[0]} alt={other.modele} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">{other.marque} <span className="text-[#184f02]">{other.modele}</span></h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{Number(other.prix).toLocaleString()} CFA</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL SUCCESS */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#184f02]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#184f02]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-2">Message envoyé</h3>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-8">
              L'équipe Emile Auto vous contactera dans les plus brefs délais.
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-[#184f02] transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetail;