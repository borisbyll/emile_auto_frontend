import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('stats'); 
  const [inventoryFilter, setInventoryFilter] = useState('Tous'); 
  const [vehicles, setVehicles] = useState([]);
  const [notifications, setNotifications] = useState([]); 
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null });
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  const [formData, setFormData] = useState({
    categorie: 'Voiture', marque: '', modele: '', prix: '',
    annee: 2026, valeurCompteur: '', tonnage: '',
    motorisation: 'Diesel', transmission: 'Automatique', description: '', images: []
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // FETCH VEHICLES CORRIGÉ (Suppression de /${id})
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars`);
      setVehicles(res.data);
    } catch (err) { console.error("Erreur API:", err); }
  };

  // NOTIFICATIONS CORRIGÉES
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, getAuthHeader());
      const currentUnread = res.data.filter(n => n.read === false).length;
      if (currentUnread > unreadCount && activeMenu !== 'alerts') {
        audioRef.current.play().catch(e => console.log("Lecture audio bloquée"));
      }
      setUnreadCount(currentUnread);
      setNotifications(res.data);
    } catch (err) { console.error("Erreur Notifications:", err); }
  };

  const handleOpenAlerts = async () => {
    setActiveMenu('alerts');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/mark-as-read`, {}, getAuthHeader());
      setUnreadCount(0);
    } catch (err) { console.error("Erreur marquage lecture:", err); }
  };

  const confirmClearHistory = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notifications/clear-all`, getAuthHeader());
      setNotifications([]);
      setUnreadCount(0);
      setShowClearHistoryModal(false);
    } catch (err) { console.error("Erreur suppression notifications:", err); }
  };

  // SUBMIT CORRIGÉ (POST & PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/cars/${editId}`, formData, getAuthHeader());
        setLastId(editId);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/cars/add`, formData, getAuthHeader());
        setLastId(res.data._id);
      }
      setShowSuccessModal(true);
      setEditId(null);
      setFormData({ categorie: 'Voiture', marque: '', modele: '', prix: '', annee: 2026, valeurCompteur: '', tonnage: '', motorisation: 'Diesel', transmission: 'Automatique', description: '', images: [] });
      fetchVehicles();
    } catch (err) { 
      if(err.response?.status === 401) navigate('/login');
      else alert("Erreur lors de l'enregistrement"); 
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cars/${showDeleteModal.id}`, getAuthHeader());
      setVehicles(vehicles.filter(v => v._id !== showDeleteModal.id));
      setShowDeleteModal({ show: false, id: null });
    } catch (err) { 
      if(err.response?.status === 401) navigate('/login');
      console.error(err); 
    }
  };

  // ... (Le reste du code HTML/JSX et les fonctions Cloudinary restent identiques car ils étaient déjà corrects)

  const Icons = {
    Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Publish: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>,
    Stock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    Alerts: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Value: () => <svg className="w-6 h-6 text-[#184f02]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="1.5" /><path strokeWidth="1.5" strokeLinecap="round" d="M14.5 9.5c-.3-.5-.8-.8-1.5-.8-1.5 0-2.5 1-2.5 3.3s1 3.3 2.5 3.3c.7 0 1.2-.3 1.5-.8M9 11.5h4M9 13.5h4" /></svg>,
    Eye: () => <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    Box: () => <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    Trend: () => <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Remove: () => <svg className="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Poppins'] text-slate-900">
      
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full shadow-sm z-50">
        <div className="p-8 flex flex-col items-center border-b border-slate-50">
          <img src="/images/logo.png" alt="Logo" className="w-42 h-auto mb-4" />
          <h1 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Administration</h1>
        </div>
        
        <nav className="flex-1 px-6 space-y-8 mt-6">
          <Link to="/" className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#184f02] text-white text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#184f02]/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour Site
          </Link>

          <div className="space-y-4">
            {[
              { id: 'stats', label: 'Dashboard', icon: <Icons.Dashboard /> },
              { id: 'publish', label: 'Publication', icon: <Icons.Publish /> },
              { id: 'assets', label: 'Inventaire', icon: <Icons.Stock /> },
              { id: 'alerts', label: 'Alertes', icon: <Icons.Alerts /> }
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => {
                  if (item.id === 'alerts') {
                    handleOpenAlerts();
                  } else {
                    setActiveMenu(item.id);
                  }
                }} 
                className={`w-full flex items-center justify-between py-3 text-[11px] font-bold uppercase tracking-widest transition-all rounded-xl px-4 ${activeMenu === item.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                    {item.icon} {item.label}
                </div>
                
                {item.id === 'alerts' && unreadCount > 0 && activeMenu !== 'alerts' && (
                  <span className="flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] text-white animate-bounce shadow-lg shadow-red-200">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
            Quitter
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-12">
        {activeMenu === 'stats' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div><p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Unités Stock</p><p className="text-2xl font-bold">{vehicles.length}</p></div>
                <Icons.Box />
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div><p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Valeur Parc</p><p className="text-2xl font-bold text-[#184f02]">{totalValue.toLocaleString()} €</p></div>
                <Icons.Value />
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div><p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Moyenne / Unité</p><p className="text-2xl font-bold text-blue-600">{Math.round(averagePrice).toLocaleString()} €</p></div>
                <Icons.Trend />
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div><p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Vues Globales</p><p className="text-2xl font-bold">{totalViews}</p></div>
                <Icons.Eye />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1 bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Asset le plus consulté</h4>
                {mostViewed ? (
                  <div className="space-y-4">
                    <img src={mostViewed.images[0]} className="w-full h-32 object-cover rounded-lg shadow-sm" alt="Top" />
                    <div><p className="text-lg font-bold text-slate-900 leading-tight uppercase">{mostViewed.marque} {mostViewed.modele}</p><p className="text-[11px] font-bold text-[#184f02] mt-1">{mostViewed.views} vues au total</p></div>
                  </div>
                ) : <p className="text-slate-400 text-[11px]">Aucun véhicule en stock</p>}
              </div>

              <div className="col-span-2 bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Répartition du catalogue</h4>
                <div className="space-y-8">
                  {[ 
                    { label: 'Voitures', stats: statsCars, color: 'bg-slate-900' }, 
                    { label: 'Camions', stats: statsTrucks, color: 'bg-[#184f02]' }, 
                    { label: 'Tracteurs', stats: statsTractors, color: 'bg-blue-600' } 
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end"><span className="text-[11px] font-bold uppercase text-slate-700">{item.label}</span><span className="text-[11px] font-black text-slate-900">{item.stats.count} unités ({Math.round(item.stats.percentage)}%)</span></div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${item.color} transition-all duration-1000 ease-out`} style={{ width: `${item.stats.percentage}%` }}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {[ { label: 'Voitures', data: statsCars }, { label: 'Camions', data: statsTrucks }, { label: 'Tracteurs', data: statsTractors } ].map((cat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">{cat.label}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[12px]"><span className="text-slate-600">Stock</span><span className="font-bold">{cat.data.count}</span></div>
                    <div className="flex justify-between items-center text-[12px]"><span className="text-slate-600">Valeur</span><span className="font-bold text-slate-900">{cat.data.value.toLocaleString()} €</span></div>
                    <div className="flex justify-between items-center text-[12px] pt-2 border-t border-slate-50"><span className="text-[#184f02] font-bold uppercase text-[9px]">Intérêt</span><span className="font-black text-[#184f02]">{cat.data.views} vues</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'alerts' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-10 border-l-4 border-green-500 pl-4">
               <h2 className="text-[12px] font-bold text-slate-900 uppercase tracking-widest">Historique WhatsApp</h2>
               <button onClick={() => setShowClearHistoryModal(true)} className="text-[9px] bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100">Vider l'historique</button>
             </div>
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[9px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-100">
                    <tr><th className="p-6">Date & Heure</th><th className="p-6">Provenance</th><th className="p-6">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[12px]">
                    {notifications.map((n) => (
                      <tr key={n._id} className={`hover:bg-slate-50/50 transition-colors ${!n.read ? 'bg-green-50/30' : ''}`}>
                        <td className="p-6 font-medium">{new Date(n.date).toLocaleString('fr-FR')}{!n.read && <span className="ml-2 text-[8px] bg-red-500 text-white px-1 rounded">NEW</span>}</td>
                        <td className="p-6 italic text-slate-500">{n.pageOrigin}</td>
                        <td className="p-6"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Clic WhatsApp</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeMenu === 'publish' && (
          <div className="max-w-4xl animate-in fade-in duration-500">
            <h2 className="text-[12px] font-bold text-slate-900 uppercase tracking-widest mb-10 border-l-4 border-[#184f02] pl-4">{editId ? `Modifier : ${formData.marque} ${formData.modele}` : "Ajout de Matériel"}</h2>
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-sm border border-slate-100 space-y-8">
               <div className="grid grid-cols-4 gap-6">
                <select value={formData.categorie} onChange={(e) => setFormData({...formData, categorie: e.target.value})} className="p-2 border-b border-slate-200 text-[13px] outline-none font-bold uppercase bg-transparent">
                  <option value="Voiture">Voiture</option><option value="Camion">Camion</option><option value="Tracteur">Tracteur</option>
                </select>
                <select value={formData.motorisation} onChange={(e) => setFormData({...formData, motorisation: e.target.value})} className="p-2 border-b border-slate-200 text-[13px] outline-none font-bold uppercase bg-transparent">
                  <option value="Diesel">Diesel</option><option value="Essence">Essence</option><option value="Hybride">Hybride</option><option value="Electrique">Electrique</option>
                </select>
                <select value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} className="p-2 border-b border-slate-200 text-[13px] outline-none font-bold uppercase bg-transparent">
                  <option value="Automatique">Automatique</option><option value="Manuelle">Manuelle</option>
                </select>
                <label className="p-2 border-b border-[#184f02] text-[#184f02] font-bold text-[10px] uppercase cursor-pointer hover:bg-green-50 text-center">
                  {isUploading ? "Sync..." : "Images +"}
                  <input type="file" multiple className="hidden" onChange={handleCustomUpload} />
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-6 gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group aspect-video">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-lg shadow-sm border border-white" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-lg opacity-100 transition-opacity"><Icons.Remove /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-10">
                <input type="text" placeholder="Marque" value={formData.marque} onChange={(e) => setFormData({...formData, marque: e.target.value})} className="p-2 border-b border-slate-200 text-[13px] outline-none font-bold" required />
                <input type="text" placeholder="Modèle" value={formData.modele} onChange={(e) => setFormData({...formData, modele: e.target.value})} className="p-2 border-b border-slate-200 text-[13px] outline-none font-bold" required />
              </div>
              <div className="grid grid-cols-3 gap-10">
                <input type="number" placeholder="Prix (€)" value={formData.prix} onChange={(e) => setFormData({...formData, prix: e.target.value})} className="p-2 border-b border-slate-200 text-[13px] outline-none font-bold text-[#184f02]" required />
                <input type="number" placeholder="Année" value={formData.annee} onChange={(e) => setFormData({...formData, annee: e.target.value})} className="p-2 border-b border-slate-200 text-[13px] outline-none font-bold" />
                <input type="number" placeholder="Compteur" value={formData.valeurCompteur} onChange={(e) => setFormData({...formData, valeurCompteur: e.target.value})} className="p-2 border-b border-slate-200 text-[13px] outline-none font-bold" />
              </div>
              <textarea placeholder="Description technique..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-4 border border-slate-100 rounded-lg text-[13px] h-32 outline-none font-medium bg-slate-50"></textarea>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-lg font-bold text-[10px] uppercase tracking-[0.5em] hover:bg-black transition-all">{editId ? "Mettre à jour l'actif" : "Enregistrer l'actif"}</button>
            </form>
          </div>
        )}

        {activeMenu === 'assets' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  {['Tous', 'Voiture', 'Camion', 'Tracteur'].map((cat) => (
                    <button key={cat} onClick={() => setInventoryFilter(cat)} className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${inventoryFilter === cat ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>{cat === 'Tous' ? 'Tout' : cat + 's'}</button>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{filteredVehicles.length} {filteredVehicles.length > 1 ? 'véhicules trouvés' : 'véhicule trouvé'}</p>
              </div>
              <div className="relative w-80">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Icons.Search /></div>
                <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-10 text-[11px] font-bold outline-none focus:border-[#184f02] shadow-sm" />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-100">
                  <tr><th className="p-6">Asset & ID</th><th className="p-6 text-center">Catégorie</th><th className="p-6 text-center">Vues</th><th className="p-6 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[12px]">
                  {filteredVehicles.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 flex items-center gap-6">
                        <img src={v.images[0]} className="w-12 h-10 object-cover rounded shadow-sm bg-slate-100" alt="" />
                        <div><p className="font-bold text-slate-900 uppercase">{v.marque} {v.modele}</p><p className="text-[9px] text-slate-500 font-mono">ID: {v._id}</p><p className="text-[10px] text-[#184f02] font-bold">{Number(v.prix).toLocaleString()} €</p></div>
                      </td>
                      <td className="p-6 text-center"><span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-600 rounded">{v.categorie}</span></td>
                      <td className="p-6 text-center font-bold text-slate-600">{v.views || 0}</td>
                      <td className="p-6 text-right">
                        <button onClick={() => navigate(`/car/${v._id}`)} className="text-[10px] font-bold uppercase text-slate-400 hover:text-slate-900">Voir</button>
                        <button onClick={() => handleEdit(v)} className="text-[10px] font-bold uppercase text-[#184f02] hover:text-green-800 ml-4">Modifier</button>
                        <button onClick={() => setShowDeleteModal({ show: true, id: v._id })} className="text-[10px] font-bold uppercase text-red-300 hover:text-red-600 ml-4">Retirer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAUX --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-widest">{editId ? "Mise à jour réussie" : "Publication Validée"}</h3>
            <div className="space-y-3">
              <button onClick={() => { setShowSuccessModal(false); setActiveMenu('publish'); setEditId(null); }} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-[11px] uppercase tracking-widest">Nouveau Matériel</button>
              <button onClick={() => navigate(`/car/${lastId}`)} className="w-full bg-green-50 text-[#184f02] py-3 rounded-lg font-bold text-[11px] uppercase border border-green-100">Voir l'annonce</button>
              <button onClick={() => { setShowSuccessModal(false); setActiveMenu('assets'); }} className="w-full border border-slate-200 text-slate-600 py-3 rounded-lg font-bold text-[11px] uppercase">Gérer l'inventaire</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-6 uppercase">Confirmer le retrait ?</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal({ show: false, id: null })} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold text-[11px] uppercase">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold text-[11px] uppercase shadow-lg shadow-red-200">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {showClearHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-md font-bold text-slate-900 text-center uppercase tracking-wider mb-2">Vider l'historique ?</h3>
            <p className="text-[11px] text-slate-500 text-center mb-8 font-medium">Cette action supprimera définitivement toutes les alertes WhatsApp enregistrées pour Emile Auto.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearHistoryModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest">Annuler</button>
              <button onClick={confirmClearHistory} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-red-100">Vider tout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;