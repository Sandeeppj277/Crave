import React from 'react';
import { ShoppingBag, LogIn, LogOut, PlusCircle, ChefHat, Sparkles, Shield } from 'lucide-react';

export default function Navbar({
  user,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onLogout,
  activeView,
  setActiveView,
  onOpenAddRestaurant
}) {
  const isAdmin = user && user.role === 'ROLE_ADMIN';
  const isOwner = user && user.role === 'ROLE_RESTAURANT_OWNER';
  const isManagerOrAdmin = isAdmin || isOwner;

  return (
    <header className="sticky top-0 z-40 bg-[#f8f6f0]/95 backdrop-blur-md border-b border-[#e6ded2] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo Using User's Custom Crave Delivery Logo */}
        <div 
          onClick={() => setActiveView('storefront')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative py-1">
            <img 
              src="/logo.png" 
              alt="Crave Delivery" 
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm" 
            />
          </div>
        </div>

        {/* View Switcher Navigation Based on Priority */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#ece5d8] shadow-[inset_2px_2px_5px_rgba(50,45,35,0.14),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]">
          <button
            onClick={() => setActiveView('storefront')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 group ${
              activeView === 'storefront'
                ? 'clay-btn-primary !py-2 !px-4'
                : 'text-stone-600 hover:text-emerald-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <span>Storefront</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveView('management')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 group ${
                activeView === 'management'
                  ? 'clay-btn-primary !py-2 !px-4'
                  : 'text-stone-600 hover:text-emerald-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125 text-emerald-800" />
              <span>Admin Process Control</span>
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setActiveView('management')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 group ${
                activeView === 'management'
                  ? 'clay-btn-primary !py-2 !px-4'
                  : 'text-stone-600 hover:text-emerald-900'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125 text-gold-700" />
              <span>Kitchen Menu Portal</span>
            </button>
          )}

          {activeView === 'management' && isAdmin && (
            <button
              onClick={onOpenAddRestaurant}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-gold-600 text-white shadow-[4px_6px_12px_rgba(180,83,9,0.3),inset_1px_1px_2px_rgba(255,255,255,0.4)] hover:bg-gold-700 transition-all flex items-center gap-1 group"
              title="Admin Priority: Register new dining establishment"
            >
              <PlusCircle className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline">Add Restaurant</span>
            </button>
          )}
        </div>

        {/* Actions & User Profile */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="group relative p-2.5 px-3.5 rounded-2xl clay-card hover:bg-emerald-50/40 text-stone-800 transition-all flex items-center gap-2 hover:-translate-y-0.5"
            title="View Basket"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-800 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
            <span className="text-xs font-extrabold hidden sm:inline text-stone-800">Basket</span>
            {cartCount > 0 && (
              <span className="bg-emerald-800 text-gold-200 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-[2px_4px_8px_rgba(6,78,59,0.4)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Status / Login */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-300">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-black text-stone-900 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 capitalize tracking-wider">
                  {user.role?.replace('ROLE_', '').toLowerCase()}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="group p-2 sm:px-3 sm:py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-rose-100 transition-all"
                title="Log out"
              >
                <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="clay-btn-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 group"
            >
              <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
