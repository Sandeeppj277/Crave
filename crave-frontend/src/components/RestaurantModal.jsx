import React, { useState, useEffect } from 'react';
import { X, Store, MapPin, Phone, Clock, Image } from 'lucide-react';
import { restaurantApi } from '../api/restaurants';

export default function RestaurantModal({
  isOpen,
  onClose,
  restaurantToEdit,
  onSuccess,
  showToast
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisineType: 'Italian',
    address: '',
    city: 'Bangalore',
    phone: '',
    imageUrl: '',
    deliveryTimeMinutes: 30,
    isOpen: true
  });

  useEffect(() => {
    if (restaurantToEdit) {
      setFormData({
        name: restaurantToEdit.name || '',
        description: restaurantToEdit.description || '',
        cuisineType: restaurantToEdit.cuisineType || 'Italian',
        address: restaurantToEdit.address || '',
        city: restaurantToEdit.city || 'Bangalore',
        phone: restaurantToEdit.phone || '',
        imageUrl: restaurantToEdit.imageUrl || '',
        deliveryTimeMinutes: restaurantToEdit.deliveryTimeMinutes || 30,
        isOpen: restaurantToEdit.isOpen !== undefined ? restaurantToEdit.isOpen : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        cuisineType: 'Italian',
        address: '',
        city: 'Bangalore',
        phone: '',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        deliveryTimeMinutes: 30,
        isOpen: true
      });
    }
  }, [restaurantToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (restaurantToEdit) {
        await restaurantApi.update(restaurantToEdit.id, formData);
        showToast('Restaurant updated successfully!', 'success');
      } else {
        await restaurantApi.create(formData);
        showToast('New restaurant created successfully!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const cuisines = [
    'Italian', 'Burgers', 'Indian', 'Japanese', 
    'Mexican', 'Chinese', 'Healthy', 'Bakery', 'Mughlai', 'South Indian'
  ];

  const cities = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-[32px] shadow-[18px_24px_48px_rgba(20,25,20,0.25)] border border-white/80 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#e6ded2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-900 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                {restaurantToEdit ? 'Edit Dining Venue' : 'Register Dining Venue'}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {restaurantToEdit ? 'Update establishment profile and operational details' : 'Register a new restaurant partner'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Establishment Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bella Italia Trattoria"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 clay-input text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Cuisine Tradition *
              </label>
              <select
                value={formData.cuisineType}
                onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                className="w-full px-3.5 py-2.5 clay-input text-sm bg-white"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                City (India) *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 clay-input text-sm bg-white"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Culinary Description
            </label>
            <textarea
              rows={2}
              placeholder="Highlight authentic ingredients, culinary style, special recipes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 clay-input text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Street Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="text"
                required
                placeholder="e.g. 100ft Road, Indiranagar"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 clay-input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Phone Contact
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="tel"
                  placeholder="+91 80 4123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 clay-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Dispatch Time (Mins)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={formData.deliveryTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, deliveryTimeMinutes: parseInt(e.target.value) || 30 })}
                  className="w-full pl-10 pr-4 py-2.5 clay-input text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Banner Image URL
            </label>
            <div className="relative">
              <Image className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 clay-input text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#efe8dd] shadow-inner">
            <div>
              <span className="text-xs font-black text-stone-800">Operational Status</span>
              <p className="text-[11px] text-stone-500">Allow customers to order from this establishment</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 clay-btn-secondary text-xs font-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 clay-btn-primary text-xs font-black disabled:opacity-50"
            >
              {loading ? 'Saving...' : (restaurantToEdit ? 'Update Venue' : 'Create Venue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
