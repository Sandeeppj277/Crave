import React from 'react';
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function MenuItemCard({
  item,
  onAddToCart,
  isManagementMode,
  onEdit,
  onDelete,
  onToggleAvailability
}) {
  const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  return (
    <div className={`group clay-card overflow-hidden transition-all duration-500 ease-out flex flex-col justify-between hover:-translate-y-3 hover:shadow-[18px_26px_50px_rgba(6,78,59,0.16)] hover:border-emerald-600/30 cursor-pointer ${
      !item.isAvailable ? 'opacity-75 bg-stone-100/70' : ''
    }`}>
      <div>
        {/* Image & Badges Container with Dynamic Zoom */}
        <div className="relative h-48 w-[calc(100%-16px)] m-2 rounded-[22px] bg-[#f2ede4] overflow-hidden shadow-[inset_1px_1px_3px_rgba(0,0,0,0.06)]">
          <img
            src={item.imageUrl || fallbackImage}
            alt={item.name}
            onError={(e) => { e.target.src = fallbackImage; }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 rounded-[22px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent rounded-[22px] transition-opacity duration-500 group-hover:opacity-80" />

          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[2px_4px_8px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300">
            <span className={`w-2 h-2 rounded-full ring-2 ring-white ${item.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              item.isVegetarian ? 'text-emerald-800' : 'text-rose-700'
            }`}>
              {item.isVegetarian ? 'Veg' : 'Non-Veg'}
            </span>
          </div>

          {/* Category Pill */}
          <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-stone-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm group-hover:bg-emerald-900/90 transition-colors duration-300">
            {item.category}
          </div>

          {/* Availability Status */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-[2px] flex items-center justify-center rounded-[22px]">
              <span className="bg-rose-700 text-white font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Details with Editorial Typography */}
        <div className="p-5 pt-2">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-lg font-black text-stone-900 group-hover:text-emerald-800 transition-colors duration-300 line-clamp-1 font-serif tracking-tight">
              {item.name}
            </h4>
            {/* Price in Rupees (₹) with Gold Accent */}
            <span className="text-lg font-black text-emerald-800 group-hover:text-gold-700 transition-colors duration-300 whitespace-nowrap">
              ₹{parseFloat(item.price).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed font-sans">
            {item.description || 'Artisanal ingredients simmered to perfection with authentic herbs.'}
          </p>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-5 pt-0">
        {isManagementMode ? (
          <div className="space-y-2.5 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Inventory Status:</span>
              <button
                onClick={() => onToggleAvailability(item)}
                className={`text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs ${
                  item.isAvailable 
                    ? 'bg-emerald-100/90 text-emerald-900 hover:bg-emerald-200' 
                    : 'bg-rose-100/90 text-rose-900 hover:bg-rose-200'
                }`}
              >
                {item.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{item.isAvailable ? 'In Stock' : 'Mark In-Stock'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 py-2 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(item)}
                className="py-2 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(item)}
            disabled={!item.isAvailable}
            className={`w-full py-3 px-4 rounded-full text-xs font-black flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
              item.isAvailable
                ? 'clay-btn-primary group-hover:shadow-[0_12px_24px_rgba(4,120,87,0.35)] group-hover:scale-[1.02]'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            <span>{item.isAvailable ? 'Add to Order' : 'Unavailable'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
