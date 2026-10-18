import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Sparkles, Shield, ChefHat, UserCheck } from 'lucide-react';
import { authApi } from '../api/auth';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_CUSTOMER',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await authApi.login(formData.email, formData.password);
        showToast(`Welcome back, ${res.name}!`, 'success');
      } else {
        res = await authApi.register(formData);
        showToast(`Account created successfully! Logged in as ${res.name}`, 'success');
      }
      onAuthSuccess(res);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      showToast(`Logged in as demo user (${res.role})`, 'success');
      onAuthSuccess(res);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#faf8f5] rounded-[32px] shadow-[18px_24px_48px_rgba(20,25,20,0.25),-8px_-8px_24px_rgba(255,255,255,0.9)] border border-white/80 overflow-hidden">
        {/* Header with Serif Typography */}
        <div className="p-6 pb-4 border-b border-[#e6ded2] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black font-serif text-stone-900">
              {isLogin ? 'Sign In to Crave' : 'Create an Account'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              {isLogin ? 'Required to place orders and manage menus' : 'Join Crave to order or manage dining partners'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Logins with Explicit Role Priorities */}
        <div className="bg-[#f2ede4] p-4 border-b border-[#e6ded2]">
          <div className="flex items-center justify-between text-xs font-black text-stone-800 mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-800" />
              <span>1-Click Role Sign In (By Priority)</span>
            </div>
            <span className="text-[10px] text-stone-500 font-bold">password123</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('admin@crave.com', 'password123')}
              className="px-2 py-2 rounded-2xl clay-card hover:bg-emerald-50/70 text-left transition-all group flex flex-col justify-between"
              title="Admin Priority: Controls overall process, restaurants & live orders"
            >
              <div className="flex items-center justify-between w-full">
                <Shield className="w-4 h-4 text-emerald-800 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">Top</span>
              </div>
              <div className="mt-1">
                <span className="text-xs font-black text-stone-900 block">Admin</span>
                <span className="text-[9px] text-stone-500 block font-medium leading-tight">Overall Process</span>
              </div>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('owner@crave.com', 'password123')}
              className="px-2 py-2 rounded-2xl clay-card hover:bg-emerald-50/70 text-left transition-all group flex flex-col justify-between"
              title="Owner Priority: Adds anything to restaurant menus & manages dishes"
            >
              <div className="flex items-center justify-between w-full">
                <ChefHat className="w-4 h-4 text-gold-700 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full">Menu</span>
              </div>
              <div className="mt-1">
                <span className="text-xs font-black text-stone-900 block">Owner</span>
                <span className="text-[9px] text-stone-500 block font-medium leading-tight">Curate Menus</span>
              </div>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('customer@crave.com', 'password123')}
              className="px-2 py-2 rounded-2xl clay-card hover:bg-emerald-50/70 text-left transition-all group flex flex-col justify-between"
              title="Customer Priority: Places food orders & explores dishes in ₹"
            >
              <div className="flex items-center justify-between w-full">
                <UserCheck className="w-4 h-4 text-emerald-700 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-extrabold uppercase bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full">Order</span>
              </div>
              <div className="mt-1">
                <span className="text-xs font-black text-stone-900 block">Customer</span>
                <span className="text-[9px] text-stone-500 block font-medium leading-tight">Order Food (₹)</span>
              </div>
            </button>
          </div>

          <div className="mt-2.5 p-2 rounded-xl bg-white/70 border border-stone-200/80 text-[10px] text-stone-600 space-y-0.5">
            <div><strong className="text-emerald-900">👑 Admin Priority:</strong> Full process control, restaurants & live orders</div>
            <div><strong className="text-gold-800">🍳 Owner Priority:</strong> Add anything to menus, edit recipes & stock</div>
            <div><strong className="text-emerald-700">🛍️ Customer Priority:</strong> Place orders in ₹ (Admins/Owners cannot order)</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajiv Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 clay-input text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 clay-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 clay-input text-sm"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  Phone (India)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 clay-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  Register As Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 clay-input text-sm bg-white"
                >
                  <option value="ROLE_CUSTOMER">Customer (Order Food in ₹)</option>
                  <option value="ROLE_RESTAURANT_OWNER">Restaurant Owner (Manage Menus)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 clay-btn-primary text-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In to Crave' : 'Create Account')}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-emerald-850 hover:text-emerald-950 font-bold"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
