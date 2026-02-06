import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Card from '../components/Card';

const Catalog = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const { pathname } = useLocation();
  
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 6; 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [tempFilters, setTempFilters] = useState({
    categorie: 'Tous',
    marque: 'Tous',
    modele: 'Tous',
    prixMax: '',
    kmMax: '',
    anneeMin: '',
    motorisation: 'Tous'
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars`);
        setVehicles(res.data);
        setFilteredVehicles(res.data);
      } catch (err) {
        console.error("Erreur chargement catalogue:", err);
      }
    };
    fetchVehicles();
  }, []);

  const categoriesDispo = ['Tous', ...new Set(vehicles.map(v => v.categorie))];
  
  const marquesDispo = ['Tous', ...new Set(vehicles
    .filter(v => tempFilters.categorie === 'Tous' || v.categorie === tempFilters.categorie)
    .map(v => v.marque))];

  const modelesDispo = ['Tous', ...new Set(vehicles
    .filter(v => (tempFilters.categorie === 'Tous' || v.categorie === tempFilters.categorie) && 
                 (tempFilters.marque === 'Tous' || v.marque === tempFilters.marque))
    .map(v => v.modele))];

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);

    const results = vehicles.filter((v) => {
      const matchCat = tempFilters.categorie === 'Tous' || v.categorie === tempFilters.categorie;
      const matchMarque = tempFilters.marque === 'Tous' || v.marque === tempFilters.marque;
      const matchModele = tempFilters.modele === 'Tous' || v.modele === tempFilters.modele;
      const matchPrix = tempFilters.prixMax === '' || Number(v.prix) <= Number(tempFilters.prixMax);
      const matchKm = tempFilters.kmMax === '' || Number(v.valeurCompteur) <= Number(tempFilters.kmMax);
      const matchAnnee = tempFilters.anneeMin === '' || Number(v.annee) >= Number(tempFilters.anneeMin);
      const matchMotor = tempFilters.motorisation === 'Tous' || v.motorisation === tempFilters.motorisation;

      return matchCat && matchMarque && matchModele && matchPrix && matchKm && matchAnnee && matchMotor;
    });

    setFilteredVehicles(results);
    setIsFilterVisible(false);
  };

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const resetFilters = () => {
    setTempFilters({ categorie: 'Tous', marque: 'Tous', modele: 'Tous', prixMax: '', kmMax: '', anneeMin: '', motorisation: 'Tous' });
    setFilteredVehicles(vehicles);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Poppins']">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center">
          <Link to="/">
            <img src="/images/logo.png" alt="Emile Auto Logo" className="h-14 w-auto" />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-[#184f02] transition-colors">Accueil</Link>
          <Link to="/Catalogue" className="text-[11px] font-bold uppercase tracking-widest text-[#184f02] transition-colors">Catalogue</Link>
          <a href="/#propos" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-[#184f02] transition-colors">À Propos</a>
          <a href="https://wa.me/22899794772" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-[#184f02]">Contact</a>
        </div>
      </nav>

      {/* HEADER - RÉDUIT AU MAXIMUM */}
      <div className="bg-slate-900 pt-24 pb-10 px-6 text-center">
        <h1 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">
          Stock <span className="text-[#184f02]">Emile Auto</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        {/* BOUTON DE CONTRÔLE */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => {
                setIsFilterVisible(!isFilterVisible);
                if(!isFilterVisible) window.scrollTo({top: 100, behavior: 'smooth'});
            }}
            className="bg-white border border-slate-200 px-8 py-3 rounded-full shadow-xl flex items-center gap-3 hover:scale-105 transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 group-hover:text-[#184f02]">
              {isFilterVisible ? "Fermer les filtres" : "Affiner la recherche"}
            </span>
            <div className={`w-2 h-2 rounded-full ${isFilterVisible ? 'bg-red-500' : 'bg-[#184f02] animate-pulse'}`}></div>
          </button>
        </div>

        {/* FORMULAIRE COMPACT */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFilterVisible ? 'max-h-[800px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
          <form onSubmit={handleSearch} className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                <select className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] outline-none font-bold"
                  value={tempFilters.categorie} onChange={(e) => setTempFilters({...tempFilters, categorie: e.target.value, marque: 'Tous', modele: 'Tous'})}>
                  {categoriesDispo.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Marque</label>
                <select className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] outline-none font-bold"
                  value={tempFilters.marque} onChange={(e) => setTempFilters({...tempFilters, marque: e.target.value, modele: 'Tous'})}>
                  {marquesDispo.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Modèle</label>
                <select className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] outline-none font-bold"
                  value={tempFilters.modele} onChange={(e) => setTempFilters({...tempFilters, modele: e.target.value})}>
                  {modelesDispo.map(mod => <option key={mod} value={mod}>{mod}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Énergie</label>
                <select className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] outline-none font-bold"
                  value={tempFilters.motorisation} onChange={(e) => setTempFilters({...tempFilters, motorisation: e.target.value})}>
                  <option value="Tous">Toutes</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Essence">Essence</option>
                  <option value="Hybride">Hybride</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Budget Max</label>
                <input type="number" placeholder="Ex: 50000" className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] outline-none"
                  value={tempFilters.prixMax} onChange={(e) => setTempFilters({...tempFilters, prixMax: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">KM Max</label>
                <input type="number" placeholder="Ex: 100000" className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] outline-none"
                  value={tempFilters.kmMax} onChange={(e) => setTempFilters({...tempFilters, kmMax: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Année Min</label>
                <input type="number" placeholder="Ex: 2018" className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] outline-none"
                  value={tempFilters.anneeMin} onChange={(e) => setTempFilters({...tempFilters, anneeMin: e.target.value})} />
              </div>

              <div className="flex items-end gap-2">
                <button type="button" onClick={resetFilters} className="flex-1 p-2.5 border border-slate-100 rounded-xl font-bold text-[9px] uppercase text-slate-400 hover:bg-slate-50 transition-all">Vider</button>
                <button type="submit" className="flex-[2] p-2.5 bg-[#184f02] text-white rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">Lancer</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RÉSULTATS */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentVehicles.map((car) => <Card key={car._id} car={car} />)}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-300 font-bold uppercase text-[10px] tracking-widest">Aucun résultat</div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentPage(i + 1); window.scrollTo({top: 300, behavior: 'smooth'}); }}
                className={`w-9 h-9 rounded-full font-bold text-xs transition-all ${currentPage === i + 1 ? 'bg-[#184f02] text-white shadow-xl' : 'bg-white text-slate-400 hover:text-slate-900'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;