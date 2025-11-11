import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function GoPrimeurProductsWithCart() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('goprimeur_cart')) || []);
  const [filter, setFilter] = useState('all');
  const [subFilter, setSubFilter] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const MINIMUM_ORDER = 30;
  const FREE_DELIVERY_THRESHOLD = 50;
  const DELIVERY_FEE = 4.99;
  const weightOptions = [0.25, 0.5, 1, 1.5, 2];

  const products = [
    // Fruits - Agrumes
    { id: 4, name: 'Oranges', price: 3.8, category: 'fruit', subcategory: 'agrumes', img: '/images/oranges.png', tag: '⭐ Meilleure vente' },
    { id: 21, name: 'Citrons', price: 3.0, category: 'fruit', subcategory: 'agrumes', img: '/images/citrons.png' },
    { id: 22, name: 'Pamplemousses', price: 3.6, category: 'fruit', subcategory: 'agrumes', img: '/images/pamplemousses.png' },
    { id: 23, name: 'Clémentines', price: 3.4, category: 'fruit', subcategory: 'agrumes', img: '/images/clementines.png', tag: '🌞 De saison' },
    // Fruits - Baies
    { id: 3, name: 'Fraises', price: 5.0, category: 'fruit', subcategory: 'baies', img: '/images/fraises.png', tag: '🌞 De saison' },
    { id: 14, name: 'Cerises', price: 6.5, category: 'fruit', subcategory: 'baies', img: '/images/cerises.png', tag: '🌞 De saison' },
    { id: 15, name: 'Myrtilles', price: 7.2, category: 'fruit', subcategory: 'baies', img: '/images/myrtilles.png' },
    { id: 16, name: 'Framboises', price: 8.0, category: 'fruit', subcategory: 'baies', img: '/images/framboises.png', tag: '🌞 De saison' },
    { id: 29, name: 'Mûres', price: 6.8, category: 'fruit', subcategory: 'baies', img: '/images/mures.png' },
    { id: 5, name: 'Raisins', price: 4.6, category: 'fruit', subcategory: 'baies', img: '/images/raisins.png' },
    { id: 57, name: 'Raisins blancs', price: 4.8, category: 'fruit', subcategory: 'baies', img: '/images/raisins-blancs.png' },
    // Fruits - À noyau
    { id: 12, name: 'Pêches', price: 4.2, category: 'fruit', subcategory: 'fruits-a-noyau', img: '/images/peches.png', tag: '🌞 De saison' },
    { id: 13, name: 'Abricots', price: 4.8, category: 'fruit', subcategory: 'fruits-a-noyau', img: '/images/abricots.png', tag: '🌞 De saison' },
    { id: 27, name: 'Nectarines', price: 4.3, category: 'fruit', subcategory: 'fruits-a-noyau', img: '/images/nectarines.png', tag: '🌞 De saison' },
    { id: 28, name: 'Prunes', price: 3.7, category: 'fruit', subcategory: 'fruits-a-noyau', img: '/images/prunes.png' },
    // Fruits - Exotiques
    { id: 18, name: 'Ananas', price: 3.9, category: 'fruit', subcategory: 'fruits-exotiques', img: '/images/ananas.png' },
    { id: 19, name: 'Mangues', price: 5.5, category: 'fruit', subcategory: 'fruits-exotiques', img: '/images/mangues.png' },
    { id: 20, name: 'Avocats', price: 4.8, category: 'fruit', subcategory: 'fruits-exotiques', img: '/images/avocats.png', tag: '⭐ Meilleure vente' },
    { id: 17, name: 'Kiwis', price: 4.5, category: 'fruit', subcategory: 'fruits-exotiques', img: '/images/kiwis.png' },
    { id: 58, name: 'Kiwis jaunes', price: 5.2, category: 'fruit', subcategory: 'fruits-exotiques', img: '/images/kiwis-jaunes.png' },
    // Fruits - Autres
    { id: 1, name: 'Pommes', price: 3.2, category: 'fruit', subcategory: 'autres', img: '/images/pommes.png', tag: '⭐ Meilleure vente' },
    { id: 2, name: 'Bananes', price: 2.5, category: 'fruit', subcategory: 'autres', img: '/images/bananes.png', tag: '🌞 De saison' },
    { id: 11, name: 'Poires', price: 3.5, category: 'fruit', subcategory: 'autres', img: '/images/poires.png' },
    { id: 24, name: 'Melons', price: 2.8, category: 'fruit', subcategory: 'autres', img: '/images/melons.png', tag: '🌞 De saison' },
    { id: 25, name: 'Pastèques', price: 2.2, category: 'fruit', subcategory: 'autres', img: '/images/pasteques.png', tag: '🌞 De saison' },
    { id: 26, name: 'Figues', price: 5.8, category: 'fruit', subcategory: 'autres', img: '/images/figues.png', tag: '🌞 De saison' },
    // Légumes - Feuilles
    { id: 30, name: 'Salade', price: 2.5, category: 'vegetable', subcategory: 'legumes-feuilles', img: '/images/salade.png' },
    { id: 35, name: 'Épinards', price: 3.3, category: 'vegetable', subcategory: 'legumes-feuilles', img: '/images/epinards.png' },
    { id: 48, name: 'Endives', price: 3.1, category: 'vegetable', subcategory: 'legumes-feuilles', img: '/images/endives.png' },
    { id: 56, name: 'Chou kale', price: 3.5, category: 'vegetable', subcategory: 'legumes-feuilles', img: '/images/chou-kale.png' },
    { id: 39, name: 'Choux', price: 2.4, category: 'vegetable', subcategory: 'legumes-feuilles', img: '/images/choux.png' },
    // Légumes - Racines
    { id: 6, name: 'Carottes', price: 2.8, category: 'vegetable', subcategory: 'legumes-racines', img: '/images/carottes.png', tag: '⭐ Meilleure vente' },
    { id: 8, name: 'Pommes de terre', price: 1.9, category: 'vegetable', subcategory: 'legumes-racines', img: '/images/pommes-de-terre.png', tag: '⭐ Meilleure vente' },
    { id: 43, name: 'Radis', price: 2.6, category: 'vegetable', subcategory: 'legumes-racines', img: '/images/radis.png' },
    { id: 44, name: 'Betteraves', price: 2.9, category: 'vegetable', subcategory: 'legumes-racines', img: '/images/betteraves.png' },
    { id: 50, name: 'Navets', price: 2.5, category: 'vegetable', subcategory: 'legumes-racines', img: '/images/navet.png' },
    { id: 52, name: 'Patates douces', price: 2.6, category: 'vegetable', subcategory: 'legumes-racines', img: '/images/patate-douce.png' },
    // Légumes - Fleurs
    { id: 9, name: 'Brocoli', price: 2.9, category: 'vegetable', subcategory: 'legumes-fleurs', img: '/images/brocoli.png' },
    { id: 40, name: 'Choux-fleurs', price: 2.7, category: 'vegetable', subcategory: 'legumes-fleurs', img: '/images/choux-fleurs.png' },
    { id: 46, name: 'Asperges', price: 5.5, category: 'vegetable', subcategory: 'legumes-fleurs', img: '/images/asperges.png', tag: '🌞 De saison' },
    { id: 47, name: 'Artichauts', price: 4.8, category: 'vegetable', subcategory: 'legumes-fleurs', img: '/images/artichaut.png' },
    // Légumes - Fruits
    { id: 7, name: 'Tomates', price: 3.9, category: 'vegetable', subcategory: 'legumes-fruits', img: '/images/tomates.png', tag: '🌞 De saison' },
    { id: 10, name: 'Courgettes', price: 3.1, category: 'vegetable', subcategory: 'legumes-fruits', img: '/images/courgette.png', tag: '🌞 De saison' },
    { id: 31, name: 'Concombres', price: 2.3, category: 'vegetable', subcategory: 'legumes-fruits', img: '/images/concombres.png', tag: '🌞 De saison' },
    { id: 32, name: 'Poivrons', price: 4.2, category: 'vegetable', subcategory: 'legumes-fruits', img: '/images/poivrons.png' },
    { id: 60, name: 'Piments', price: 4.5, category: 'vegetable', subcategory: 'legumes-fruits', img: '/images/piments.png' },
    { id: 37, name: 'Aubergines', price: 3.8, category: 'vegetable', subcategory: 'legumes-fruits', img: '/images/aubergine.png', tag: '🌞 De saison' },
    { id: 53, name: 'Butternut', price: 2.8, category: 'vegetable', subcategory: 'legumes-fruits', img: '/images/butternut.png' },
    // Légumes - Bulbes
    { id: 33, name: 'Oignons', price: 2.1, category: 'vegetable', subcategory: 'legumes-bulbes', img: '/images/onions.png' },
    { id: 34, name: 'Ail', price: 3.5, category: 'vegetable', subcategory: 'legumes-bulbes', img: '/images/ail.png' },
    { id: 38, name: 'Poireaux', price: 3.0, category: 'vegetable', subcategory: 'legumes-bulbes', img: '/images/poireaux.png' },
    { id: 49, name: 'Échalotes', price: 4.0, category: 'vegetable', subcategory: 'legumes-bulbes', img: '/images/echalotes.png' },
    // Légumes - Autres
    { id: 41, name: 'Haricots verts', price: 3.6, category: 'vegetable', subcategory: 'autres', img: '/images/haricots-verts.png', tag: '🌞 De saison' },
    { id: 42, name: 'Petits pois', price: 3.4, category: 'vegetable', subcategory: 'autres', img: '/images/petits-pois.png' },
    { id: 45, name: 'Céleri', price: 3.2, category: 'vegetable', subcategory: 'autres', img: '/images/celeri.png' },
    { id: 51, name: 'Champignons de Paris', price: 4.2, category: 'vegetable', subcategory: 'autres', img: '/images/champignons-de-paris.png' },
    { id: 59, name: 'Champignons roses', price: 4.8, category: 'vegetable', subcategory: 'autres', img: '/images/champignons-roses.png' },
    { id: 54, name: 'Fenouil', price: 3.3, category: 'vegetable', subcategory: 'autres', img: '/images/fenouil.png' }
  ];

  useEffect(() => localStorage.setItem('goprimeur_cart', JSON.stringify(cart)), [cart]);

  const addToCart = (product, weight) => {
    if (!weight) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.weight === weight);
      if (existing) {
        // Remove existing item and add it to the top with incremented quantity
        const filtered = prev.filter((i) => !(i.id === product.id && i.weight === weight));
        return [{ ...existing, qty: existing.qty + 1 }, ...filtered];
      }
      // Add new item at the top
      return [{ ...product, qty: 1, weight }, ...prev];
    });
    setToast(`✅ ${product.name} (${weight} kg) ajouté au panier`);
    setTimeout(() => setToast(null), 2000);
  };

  const removeFromCart = (id, weight) => setCart((prev) => prev.filter((i) => !(i.id === id && i.weight === weight)));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty * i.weight, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const canProceed = subtotal >= MINIMUM_ORDER;

  const progressOrder = Math.min((subtotal / MINIMUM_ORDER) * 100, 100);
  const progressDelivery = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  const subcategories = {
    fruit: [
      { value: 'agrumes', label: '🍊 Agrumes' },
      { value: 'baies', label: '🫐 Baies' },
      { value: 'fruits-a-noyau', label: '🍑 À noyau' },
      { value: 'fruits-exotiques', label: '🥭 Exotiques' },
      { value: 'autres', label: '🍎 Autres' }
    ],
    vegetable: [
      { value: 'legumes-feuilles', label: '🥬 Feuilles' },
      { value: 'legumes-racines', label: '🥕 Racines' },
      { value: 'legumes-fleurs', label: '🥦 Fleurs' },
      { value: 'legumes-fruits', label: '🍅 Fruits' },
      { value: 'legumes-bulbes', label: '🧅 Bulbes' },
      { value: 'autres', label: '🍄 Autres' }
    ]
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSubFilter(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'all' || p.category === filter;
    const matchesSubFilter = !subFilter || p.subcategory === subFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSubFilter && matchesSearch;
  });

  return (
    <div className="bg-[#F7F6F3] text-[#374151] min-h-screen font-sans flex relative tracking-tight leading-relaxed">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2.5 rounded-md shadow-md text-sm z-50">
          {toast}
        </div>
      )}

      {/* Mobile Cart Toggle Button */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#4E9F3D] text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-colors"
        aria-label="Toggle cart"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </div>
      </button>

      {/* Mobile Overlay */}
      {isCartOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className="flex-1 lg:pr-80 pb-4 lg:pb-0">
        <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
          <div className="container mx-auto flex justify-between items-center py-3 px-4 lg:px-5">
            <a href="#" className="text-xl lg:text-2xl font-semibold text-[#4E9F3D] tracking-tight">GoPrimeur</a>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-full px-3 lg:px-4 py-1.5 text-xs lg:text-sm focus:ring-1 focus:ring-[#4E9F3D] outline-none text-gray-600 w-32 lg:w-auto"
            />
          </div>
        </nav>

        <div className="container mx-auto mt-6 mb-6">
          <div className="text-center space-x-3 mb-4">
          {['all', 'fruit', 'vegetable'].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full border transition text-sm font-medium tracking-wide ${filter === f ? 'bg-[#4E9F3D] text-white border-[#4E9F3D]' : 'bg-white text-[#4E9F3D] border-[#4E9F3D] hover:bg-[#4E9F3D] hover:text-white'}`}
                onClick={() => handleFilterChange(f)}
            >
                {f === 'all' && 'Tous'}
              {f === 'fruit' && '🍎 Fruits'}
                {f === 'vegetable' && '🥕 Légumes'}
              </button>
            ))}
          </div>
          {filter !== 'all' && subcategories[filter] && (
            <div className="text-center space-x-2 flex flex-wrap justify-center gap-2 px-4">
              <button
                onClick={() => setSubFilter(null)}
                className={`px-3 py-1.5 rounded-full border transition text-xs font-medium ${!subFilter ? 'bg-[#4E9F3D] text-white border-[#4E9F3D]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
              >
                Tous
              </button>
              {subcategories[filter].map((sub) => (
                <button
                  key={sub.value}
                  className={`px-3 py-1.5 rounded-full border transition text-xs font-medium ${subFilter === sub.value ? 'bg-[#4E9F3D] text-white border-[#4E9F3D]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => setSubFilter(sub.value)}
                >
                  {sub.label}
            </button>
          ))}
            </div>
          )}
        </div>

        <section id="product-list" className="container mx-auto px-4 pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-5">
            {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition transform duration-200 p-3 text-center group">
                  <div className="relative mb-3">
                    {p.tag && <span className="absolute top-2 left-2 bg-[#4E9F3D] text-white text-[10px] px-2 py-0.5 rounded-full">{p.tag}</span>}
                    <img src={p.img} alt={p.name} className="rounded-lg w-full h-36 object-cover" />
                    <button onClick={() => addToCart(p, 1)} className="absolute inset-0 bg-[#4E9F3D]/80 text-white font-medium text-sm opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity duration-300">
                      + Ajouter 1kg
                    </button>
                  </div>
                  <h3 className="font-medium text-sm text-gray-800 mb-1">{p.name}</h3>
                  <p className="text-gray-500 text-xs mb-2">{p.price.toFixed(2)} €/kg</p>
                  <select className="border border-[#4E9F3D] rounded-md px-2 py-1 text-xs bg-[#F9FFF9] focus:outline-none focus:ring-1 focus:ring-[#4E9F3D]" onChange={(e) => addToCart(p, parseFloat(e.target.value))} defaultValue="">
                    <option value="" disabled>Sélectionner le poids</option>
                    {weightOptions.map((w) => (
                      <option key={w} value={w}>{w} kg</option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        </section>
      </div>

      <aside className={`w-full lg:w-80 bg-white border-l border-gray-100 shadow-md fixed right-0 top-0 h-full flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isCartOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex justify-between items-center mb-3 p-5 border-b border-gray-50">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-semibold text-[#4E9F3D] tracking-tight">Votre panier</h3>
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-gray-800">{total.toFixed(2)} €</span>
              <button
                onClick={() => setIsCartOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <div className="bg-[#FAFAFA] border border-gray-100 rounded-md p-3 mb-4 text-xs">
            <div className="w-full bg-gray-200 h-1.5 rounded-full mb-2">
              <div className="bg-[#4E9F3D] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressOrder}%` }}></div>
            </div>
            <p className="text-gray-700 leading-snug">{subtotal < MINIMUM_ORDER ? `${(MINIMUM_ORDER - subtotal).toFixed(2)} € restant pour atteindre ${MINIMUM_ORDER} € de commande minimum` : '✅ Commande minimum atteinte !'}</p>
          </div>

          <div className="bg-[#FAFAFA] border border-gray-100 rounded-md p-3 mb-5 text-xs">
            <div className="w-full bg-gray-200 h-1.5 rounded-full mb-2">
              <div className="bg-[#4E9F3D] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressDelivery}%` }}></div>
            </div>
            <p className="text-gray-700 leading-snug">{subtotal < FREE_DELIVERY_THRESHOLD ? `${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} € restant pour débloquer la livraison gratuite` : '🚚 Livraison gratuite débloquée !'}</p>
          </div>
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center mt-10 text-sm">Votre panier est vide.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((i) => (
                <div key={`${i.id}-${i.weight}`} className="flex justify-between items-center bg-[#F9FAF8] p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{i.name}</p>
                    <p className="text-xs text-gray-500">{i.weight} kg × {i.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">{(i.price * i.qty * i.weight).toFixed(2)} €</p>
                    <button onClick={() => removeFromCart(i.id, i.weight)} className="text-red-500 text-xs hover:underline">Retirer</button>
                  </div>
                </div>
              ))}

              <div className={`flex justify-between items-center bg-[#F9FAF8] p-3 rounded-lg text-sm ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                <p className="font-medium">Frais de livraison</p>
                <p className="font-semibold">{deliveryFee === 0 ? 'Gratuit ✅' : `${DELIVERY_FEE.toFixed(2)} €`}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-[#F9F9F9] text-center space-y-3 lg:relative">
          <Link
            to="/checkout"
            onClick={() => setIsCartOpen(false)}
            className={`block w-full py-2 lg:py-2 rounded-md font-medium text-center transition ${
              canProceed
                ? "bg-[#4E9F3D] text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
            }`}
          >
            Passer à la caisse ({itemCount}) - {total.toFixed(2)} €
          </Link>


          <div className="grid grid-cols-1 gap-3 text-left">
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl py-4 px-4 text-sm text-green-900 leading-relaxed shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚚</span>
                  <span className="font-semibold text-base">Frais de livraison</span>
                </div>
                <span className={`font-bold text-lg ${deliveryFee === 0 ? 'text-green-700' : 'text-gray-800'}`}>
                  {deliveryFee === 0 ? 'Gratuit ✅' : `${DELIVERY_FEE.toFixed(2)} €`}
                </span>
              </div>
              <p className="text-green-800 text-xs italic mt-2 pl-7">Livraison gratuite à partir de {FREE_DELIVERY_THRESHOLD} €</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
