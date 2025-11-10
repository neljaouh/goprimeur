import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    slot: "",
    payOnDelivery: true,
  });
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  const MINIMUM_ORDER = 30;
  const FREE_DELIVERY_THRESHOLD = 50;
  const DELIVERY_FEE = 2.99;

  const cart = JSON.parse(localStorage.getItem("goprimeur_cart")) || [];
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty * i.weight, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!/^[0-9]{9,15}$/.test(form.phone)) errs.phone = "Entrez un numéro de téléphone valide";
    if (!form.address.trim()) errs.address = "L'adresse de livraison est requise";
    if (!form.slot) errs.slot = "Sélectionnez un créneau de livraison";
    if (subtotal < MINIMUM_ORDER) errs.order = `La commande minimum est de €${MINIMUM_ORDER}`;
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) return setErrors(v);
    setErrors({});
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 4000);
    localStorage.removeItem("goprimeur_cart");
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F6F3] text-[#374151] font-sans">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold text-[#4E9F3D] mb-2">✅ Commande confirmée !</h2>
          <p className="text-gray-600 text-sm mb-6">Merci, {form.name || "Client"} ! Vos produits frais arriveront bientôt.</p>
          <Link to="/" className="text-[#4E9F3D] text-sm hover:underline">← Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#374151] font-sans flex flex-col items-center py-10">
      <div className="text-center mb-6">
        <Link to="/" className="text-3xl font-semibold text-[#4E9F3D] tracking-tight">GoPrimeur</Link>
      </div>
      <div className="bg-white shadow-md rounded-xl w-full max-w-3xl p-8">
        <h1 className="text-2xl font-semibold text-[#4E9F3D] mb-6">Commande</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Nom *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#4E9F3D] outline-none"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Téléphone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#4E9F3D] outline-none"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Adresse de livraison *</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows="2"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#4E9F3D] outline-none"
              ></textarea>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Créneau de livraison préféré *</label>
              <select
                value={form.slot}
                onChange={(e) => setForm({ ...form, slot: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#4E9F3D] outline-none"
              >
                <option value="">Sélectionner un créneau</option>
                <option>Samedi matin (8–12h)</option>
                <option>Samedi après-midi (12–16h)</option>
                <option>Samedi soir (16–20h)</option>
              </select>
              {errors.slot && <p className="text-red-500 text-xs mt-1">{errors.slot}</p>}
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Méthode de paiement</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    checked={form.payOnDelivery}
                    onChange={() => setForm({ ...form, payOnDelivery: true })}
                  />
                  <span>💶 Paiement à la livraison</span>
                </label>
                <label className="flex items-center space-x-2 text-sm opacity-50 cursor-not-allowed">
                  <input type="radio" disabled />
                  <span>💳 Paiement par carte (bientôt disponible)</span>
                </label>
              </div>
            </div>

            {errors.order && <p className="text-red-500 text-xs mt-2">{errors.order}</p>}

            <button
              type="submit"
              className="w-full mt-4 bg-[#4E9F3D] text-white font-medium py-2 rounded-md hover:bg-green-700 transition"
            >
              Confirmer la commande
            </button>
          </form>

          <div className="bg-[#F9FAF8] rounded-lg p-5 shadow-sm text-sm space-y-3">
            <h2 className="text-lg font-semibold text-[#4E9F3D] mb-3">Résumé de la commande</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Aucun article dans le panier.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.map((i) => (
                  <li key={`${i.id}-${i.weight}`} className="py-2 flex justify-between">
                    <span>
                      {i.name} ({i.weight} kg × {i.qty})
                    </span>
                    <span>{(i.price * i.qty * i.weight).toFixed(2)} €</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t pt-3 text-gray-700">
              <p className="flex justify-between">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </p>
              <p className="flex justify-between text-sm">
                <span>Livraison</span>
                <span>{deliveryFee === 0 ? "Gratuit" : `${DELIVERY_FEE.toFixed(2)} €`}</span>
              </p>
              <p className="flex justify-between font-semibold text-[#4E9F3D] mt-2">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
