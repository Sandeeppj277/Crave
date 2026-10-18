import React from 'react';
import { Star, Clock, MapPin, Edit3, Trash2, Utensils } from 'lucide-react';

export default function RestaurantCard({
  restaurant,
  onSelect,
  isManagementMode,
  onEdit,
  onDelete,
  canDelete = true
}) {
  const fallbackImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      onClick={() => onSelect && onSelect(restaurant)}
      className="group clay-card overflow-hidden transition-all duration-500 hover:-translate-y-3 flex flex-col cursor-pointer hover:shadow-[18px_26px_50px_rgba(6,78,59,0.16)] hover:border-emerald-600/30"
    >
      {/* Image Banner */}
      <div className="relative h-56 w-[calc(100%-16px)] m-2 rounded-[22px] bg-[#f2ede4] overflow-hidden">
        <img
          src={restaurant.imageUrl || fallbackImage}
          alt={restaurant.name}
          onError={(e) => { e.target.src = fallbackImage; }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-[22px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-black/10 rounded-[22px] transition-opacity duration-500 group-hover:opacity-80" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-md group-hover:scale-105 transition-transform duration-300">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-black text-stone-900">
            {restaurant.rating ? restaurant.rating.toFixed(1) : '4.8'}
          </span>
        </div>

        {/* Cuisine Badge */}
        <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-stone-100 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm group-hover:bg-emerald-950/90 transition-colors">
          {restaurant.cuisineType}
        </div>

        {/* Open/Closed indicator */}
        <div className="absolute bottom-3 left-3">
          <span className={`text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md shadow-md ${
            restaurant.isOpen 
              ? 'bg-emerald-600 text-white' 
              : 'bg-rose-600 text-white'
          }`}>
            {restaurant.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {/* Delivery Time */}
        <div className="absolute bottom-3 right-3 bg-stone-950/70 backdrop-blur-md text-stone-100 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>{restaurant.deliveryTimeMinutes} mins</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold font-serif text-stone-900 group-hover:text-emerald-800 transition-colors duration-300 line-clamp-1 tracking-tight">
            {restaurant.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed font-sans">
            {restaurant.description || 'Artisanal recipes prepared fresh to order by certified master culinary chefs.'}
          </p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
            <span className="truncate max-w-[150px] font-semibold">{restaurant.city || 'Bangalore'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-[#f4eee5] px-3 py-1 rounded-full">
            <Utensils className="w-3.5 h-3.5 text-emerald-800" />
            <span>{restaurant.menuItemCount || 0} dishes</span>
          </div>
        </div>

        {/* Management Controls */}
        {isManagementMode && (
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSelect && onSelect(restaurant)}
              className="flex-1 py-2 px-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-gold-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              title="Add or manage dishes for this restaurant"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Manage Menu</span>
            </button>
            <button
              onClick={() => onEdit(restaurant)}
              className="py-2 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              title="Edit establishment details"
            >
              <Edit3 className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            {canDelete && (
              <button
                onClick={() => onDelete(restaurant)}
                className="py-2 px-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                title="Delete restaurant venue (Admin only)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
