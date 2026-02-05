import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ car }) => {
  const navigate = useNavigate();

  // On prend la première image ou une image par défaut si vide
  const displayImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : 'https://via.placeholder.com/400x300?text=Image+Indisponible';

  return (
    <div 
      onClick={() => navigate(`/car/${car._id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-100 flex flex-col h-full"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={displayImage} 
          alt={`${car.marque} ${car.modele}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        {/* BADGE CATÉGORIE */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-tighter text-slate-900">
            {car.categorie}
          </p>
        </div>
      </div>

      {/* INFOS CONTAINER */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight leading-tight">
              {car.marque}
            </h3>
            <p className="text-slate-400 text-sm font-medium">{car.modele}</p>
          </div>
          <p className="text-amber-600 font-black text-lg">
            {Number(car.prix).toLocaleString()} €
          </p>
        </div>

        {/* CARACTÉRISTIQUES RAPIDES */}
        <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Année</span>
            <span className="text-xs font-bold text-slate-700">{car.annee || 'N/C'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Kilométrage</span>
            <span className="text-xs font-bold text-slate-700">
              {car.valeurCompteur ? `${Number(car.valeurCompteur).toLocaleString()} km` : 'N/C'}
            </span>
          </div>
        </div>

        {/* BOUTON DÉTAILS VISIBLE AU HOVER */}
        <div className="mt-6">
          <button className="w-full py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;