import React, { useState, useEffect } from 'react';
import { X, Utensils, Image } from 'lucide-react';
import { menuItemApi } from '../api/menuItems';

export default function MenuItemModal({
  isOpen,
  onClose,
  restaurantId,
  itemToEdit,
  onSuccess,
  showToast
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Mains',
    isVegetarian: false,
    imageUrl: '',
    isAvailable: true,
    restaurantId: restaurantId
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        description: itemToEdit.description || '',
        price: itemToEdit.price || '',
        category: itemToEdit.category || 'Mains',
        isVegetarian: itemToEdit.isVegetarian || false,
        imageUrl: itemToEdit.imageUrl || '',
        isAvailable: itemToEdit.isAvailable !== undefined ? itemToEdit.isAvailable : true,
        restaurantId: itemToEdit.restaurantId || restaurantId
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Mains',
        isVegetarian: false,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
        restaurantId: restaurantId
      });
    }
  }, [itemToEdit, restaurantId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        restaurantId: parseInt(formData.restaurantId)
      };

      if (itemToEdit) {
        await menuItemApi.update(itemToEdit.id, payload);
        showToast('Menu dish updated successfully!', 'success');
      } else {
        await menuItemApi.create(payload);
        showToast('New menu dish added successfully!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Mains', 'Appetizers', 'Desserts', 'Beverages', 'Sides'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#faf8f5] rounded-[32px] shadow-[18px_24px_48px_rgba(20,25,20,0.25)] border border-white/80 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#e6ded2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-900 shadow-xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                {itemToEdit ? 'Edit Recipe Dish' : 'Add Recipe Dish'}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {itemToEdit ? 'Modify price in Rupees (₹) and ingredients' : 'Add an artisanal recipe to the menu'}
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
              Dish Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Paneer Butter Masala"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 clay-input text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 clay-input text-sm bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Price in Rupees (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-stone-500 font-black text-sm">₹</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="299"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-2.5 clay-input text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Description & Ingredients
            </label>
            <textarea
              rows={2}
              placeholder="List spices, texture, accompaniments..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 clay-input text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Dish Image URL
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

          {/* Veg / Non-Veg Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#efe8dd] shadow-inner">
            <div>
              <span className="text-xs font-black text-stone-800">Pure Vegetarian</span>
              <p className="text-[11px] text-stone-500">Green mark indication for vegetarians</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVegetarian}
                onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {/* In-Stock Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#efe8dd] shadow-inner">
            <div>
              <span className="text-xs font-black text-stone-800">Inventory Status</span>
              <p className="text-[11px] text-stone-500">Allow customers to order this dish</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
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
              {loading ? 'Saving...' : (itemToEdit ? 'Save Changes' : 'Add Dish in ₹')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
