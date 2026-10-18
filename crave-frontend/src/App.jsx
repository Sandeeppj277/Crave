import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Utensils, Star, Clock, ArrowLeft, PlusCircle, Sparkles, ExternalLink, 
  RefreshCw, ChefHat, Leaf, ShieldCheck, Flame, Compass, Award, Heart, CheckCircle2,
  Shield, Package, Truck, Check, AlertCircle, ShoppingBag
} from 'lucide-react';

import Navbar from './components/Navbar';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import RestaurantCard from './components/RestaurantCard';
import RestaurantModal from './components/RestaurantModal';
import MenuItemCard from './components/MenuItemCard';
import MenuItemModal from './components/MenuItemModal';
import CartDrawer from './components/CartDrawer';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import { authApi } from './api/auth';
import { restaurantApi } from './api/restaurants';
import { menuItemApi } from './api/menuItems';
import { orderApi } from './api/orders';

export default function App() {
  // Authentication & View State
  const [user, setUser] = useState(authApi.getSavedUser());
  const [activeView, setActiveView] = useState('storefront'); // 'storefront' | 'management'
  
  // Data States
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  // Cart
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [restaurantToEdit, setRestaurantToEdit] = useState(null);
  const [menuItemModalOpen, setMenuItemModalOpen] = useState(false);
  const [menuItemToEdit, setMenuItemToEdit] = useState(null);
  
  // Delete Confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Restaurants
  const loadRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (activeView === 'management' && user && (user.role === 'ROLE_RESTAURANT_OWNER' || user.role === 'ROLE_ADMIN')) {
        data = await restaurantApi.getMyRestaurants();
      } else {
        data = await restaurantApi.getAll({
          search: searchQuery || undefined,
          cuisine: selectedCuisine !== 'All' ? selectedCuisine : undefined
        });
      }
      setRestaurants(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [activeView, user, searchQuery, selectedCuisine]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // Fetch Menu Items when restaurant is selected
  const loadMenuItems = useCallback(async (restaurantId) => {
    if (!restaurantId) return;
    setMenuLoading(true);
    try {
      const items = await menuItemApi.getByRestaurant(restaurantId, {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        isVegetarian: vegOnly ? true : undefined
      });
      setMenuItems(items);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setMenuLoading(false);
    }
  }, [selectedCategory, vegOnly]);

  useEffect(() => {
    if (selectedRestaurant) {
      loadMenuItems(selectedRestaurant.id);
    }
  }, [selectedRestaurant, loadMenuItems]);

  // Admin Live Orders Pipeline State
  const [adminTab, setAdminTab] = useState('restaurants'); // 'restaurants' | 'orders'
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const loadAllOrders = useCallback(async () => {
    if (!user || user.role !== 'ROLE_ADMIN') return;
    setOrdersLoading(true);
    try {
      const orders = await orderApi.getAllOrders();
      setAllOrders(orders);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeView === 'management' && user?.role === 'ROLE_ADMIN' && adminTab === 'orders') {
      loadAllOrders();
    }
  }, [activeView, user, adminTab, loadAllOrders]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await orderApi.updateStatus(orderId, newStatus);
      setAllOrders((prev) => prev.map((o) => o.id === orderId ? updated : o));
      showToast(`Order #${updated.orderNumber} status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Cart operations (Customer-only restriction)
  const handleAddToCart = (item) => {
    if (user && user.role !== 'ROLE_CUSTOMER') {
      showToast(`Signed in as ${user.role === 'ROLE_ADMIN' ? 'Admin' : 'Restaurant Owner'}. Food ordering is reserved for customer accounts.`, 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to basket!`, 'success');
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCart((prev) => prev.map((i) => i.id === itemId ? { ...i, quantity } : i));
    }
  };

  const handleRemoveItem = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Auth operations
  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setActiveView('storefront');
    showToast('Logged out successfully', 'info');
  };

  // Restaurant CRUD Handlers
  const handleOpenAddRestaurant = () => {
    setRestaurantToEdit(null);
    setRestaurantModalOpen(true);
  };

  const handleOpenEditRestaurant = (restaurant) => {
    setRestaurantToEdit(restaurant);
    setRestaurantModalOpen(true);
  };

  const promptDeleteRestaurant = (restaurant) => {
    setDeleteTarget(restaurant);
    setDeleteType('restaurant');
    setDeleteModalOpen(true);
  };

  // Menu Item CRUD Handlers
  const handleOpenAddMenuItem = () => {
    setMenuItemToEdit(null);
    setMenuItemModalOpen(true);
  };

  const handleOpenEditMenuItem = (item) => {
    setMenuItemToEdit(item);
    setMenuItemModalOpen(true);
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updated = await menuItemApi.toggleAvailability(item.id);
      setMenuItems((prev) => prev.map((i) => i.id === updated.id ? updated : i));
      showToast(`Item is now ${updated.isAvailable ? 'In Stock' : 'Marked Out of Stock'}`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const promptDeleteMenuItem = (item) => {
    setDeleteTarget(item);
    setDeleteType('menuItem');
    setDeleteModalOpen(true);
  };

  // Execute Deletion
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteType === 'restaurant') {
        await restaurantApi.delete(deleteTarget.id);
        showToast('Restaurant deleted successfully', 'success');
        if (selectedRestaurant?.id === deleteTarget.id) {
          setSelectedRestaurant(null);
        }
        loadRestaurants();
      } else if (deleteType === 'menuItem') {
        await menuItemApi.delete(deleteTarget.id);
        showToast('Menu item removed', 'success');
        if (selectedRestaurant) {
          loadMenuItems(selectedRestaurant.id);
        }
      }
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cuisines = [
    { name: 'All', icon: Sparkles },
    { name: 'Italian', icon: Utensils },
    { name: 'Burgers', icon: Flame },
    { name: 'Indian', icon: Award },
    { name: 'Japanese', icon: Compass },
    { name: 'Mexican', icon: Leaf },
  ];
  
  const categories = ['All', 'Mains', 'Appetizers', 'Desserts', 'Beverages'];
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] selection:bg-emerald-800 selection:text-gold-200">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Navigation Bar */}
      <Navbar
        user={user}
        cartCount={cartItemCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          setSelectedRestaurant(null);
        }}
        onOpenAddRestaurant={handleOpenAddRestaurant}
      />

      {/* Haute Editorial Hero Page with Dynamic Icon Hover Effects */}
      {!selectedRestaurant && activeView === 'storefront' && (
        <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#e6ded2]">
          {/* Subtle Background Radial Sheen */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,#e6ded2,transparent_70%)]" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
            {/* Left Column: Print Typography & Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Brand Emblem & Issue Pill with Dynamic Interactive Hover */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer hover:border-emerald-700/40">
                  <img
                    src="/logo.png"
                    alt="Crave Delivery Emblem"
                    className="h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-115 group-hover:rotate-3"
                  />
                  <div className="h-4 w-px bg-stone-200" />
                  <span className="text-[11px] font-extrabold tracking-wider text-emerald-900 uppercase">
                    Crave Delivery
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200 text-stone-800 text-[11px] font-bold shadow-xs group cursor-pointer hover:border-emerald-700/40 hover:bg-white transition-all duration-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125">
                    <Sparkles className="w-3 h-3 text-emerald-800" />
                  </div>
                  <span className="tracking-widest uppercase text-[10px] text-stone-600 font-extrabold">
                    Curated Culinary Edition • Indian Rupees (₹)
                  </span>
                </div>
              </div>

              {/* Main Editorial Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 leading-[1.08] font-serif">
                A Symphony of <span className="italic font-normal text-emerald-850">Haute Cuisine</span>, Delivered to Your Table.
              </h1>

              {/* Refined Subtitle */}
              <p className="text-base text-stone-600 max-w-xl font-normal leading-relaxed font-sans">
                Experience the artistry of master culinary artisans and wood-fired kitchens. Each bespoke plate is handcrafted with authentic farm-sourced ingredients and delivered with immaculate care.
              </p>

              {/* Sunken Clay Search Bar with Dynamic Hover Search Button */}
              <div className="pt-2 max-w-xl">
                <div className="relative flex items-center clay-input py-1.5 px-3 focus-within:ring-2 focus-within:ring-emerald-700/30 transition-all group">
                  <div className="p-2 rounded-xl text-stone-400 group-hover:text-emerald-800 transition-all duration-300 group-hover:scale-125">
                    <Search className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search bespoke restaurants, signature dishes, cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-2 py-3 bg-transparent text-sm text-stone-800 placeholder-stone-400 focus:outline-none font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mr-2 text-xs font-black text-stone-400 hover:text-stone-700"
                    >
                      Clear
                    </button>
                  )}
                  <button className="clay-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                    <span>Explore</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Hover Cuisine Selector Pills */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">
                  Curated Epicurean Traditions
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {cuisines.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = selectedCuisine === item.name;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setSelectedCuisine(item.name)}
                        className={`group px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                          isActive
                            ? 'clay-chip-active scale-105'
                            : 'clay-btn-secondary !py-2 !px-4 hover:border-emerald-600/40'
                        }`}
                      >
                        <div className={`p-1 rounded-full transition-all duration-500 ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-stone-100 text-stone-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 group-hover:rotate-12 group-hover:scale-125'
                        }`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editorial Feature Badges with Dynamic Icon Hover */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#e6ded2]/80">
                <div className="group flex items-center gap-2.5 cursor-pointer">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100/90 text-amber-800 flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-[0_4px_12px_rgba(217,119,6,0.3)]">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-stone-900 group-hover:text-emerald-900 transition-colors">4.8+ Stars</span>
                    <span className="block text-[10px] text-stone-400 font-medium">Michelin Quality</span>
                  </div>
                </div>

                <div className="group flex items-center gap-2.5 cursor-pointer">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12 group-hover:shadow-[0_4px_12px_rgba(6,78,59,0.3)]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-stone-900 group-hover:text-emerald-900 transition-colors">25 Minutes</span>
                    <span className="block text-[10px] text-stone-400 font-medium">Express Dispatch</span>
                  </div>
                </div>

                <div className="group flex items-center gap-2.5 cursor-pointer">
                  <div className="w-9 h-9 rounded-2xl bg-stone-200/90 text-stone-700 flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-stone-900 group-hover:text-emerald-900 transition-colors">Pure Organic</span>
                    <span className="block text-[10px] text-stone-400 font-medium">Farm Sourced</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Editorial Print Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Arch Hero Card */}
                <div className="clay-card-pearl p-3.5 relative overflow-hidden transition-all duration-500 hover:shadow-[18px_28px_60px_rgba(6,78,59,0.2)] group">
                  <div className="relative h-[420px] rounded-[24px] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85"
                      alt="Artisanal Haute Dish"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                    {/* Bottom Editorial Caption on Image */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="text-[10px] font-black tracking-widest uppercase bg-gold-600/90 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                        Featured Recipe
                      </span>
                      <h3 className="text-xl font-bold font-serif mt-1.5 leading-snug">
                        Wood-Fired Truffle & Wild Morel Tagliatelle
                      </h3>
                      <p className="text-xs text-stone-300 font-medium mt-0.5">
                        Prepared fresh by Master Chef Luigi • <span className="text-gold-300 font-bold">₹420.00</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Tactile Brand Seal */}
                <div className="absolute -top-6 -right-4 clay-floating-badge p-2.5 px-3.5 flex items-center gap-2.5 transition-all duration-300 hover:scale-110 hover:rotate-3 cursor-pointer group shadow-xl bg-white/95">
                  <img
                    src="/logo.png"
                    alt="Crave Seal"
                    className="h-9 w-auto object-contain drop-shadow transition-transform duration-500 group-hover:scale-120 group-hover:-rotate-6"
                  />
                  <div>
                    <span className="text-[11px] font-black text-stone-900 block leading-tight">
                      CRAVE ORIGINAL
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold block">
                      Guaranteed Fresh
                    </span>
                  </div>
                </div>

                {/* Floating Tactile Clay Pill 1: Customer Review */}
                <div className="absolute -top-4 -left-6 clay-floating-badge p-3 px-4 flex items-center gap-3 transition-all duration-300 hover:scale-110 hover:-rotate-2 cursor-pointer group shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-gold-300 flex items-center justify-center font-bold text-xs shadow-inner transition-transform duration-500 group-hover:rotate-180">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-black text-stone-800 block leading-tight mt-0.5">
                      Award Winning Taste
                    </span>
                  </div>
                </div>

                {/* Floating Tactile Clay Pill 2: Dispatch Guarantee */}
                <div className="absolute -bottom-5 -right-5 clay-floating-badge p-3 px-4 flex items-center gap-3 transition-all duration-300 hover:scale-110 hover:rotate-2 cursor-pointer group shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-stone-900 block leading-tight">
                      100% Thermal Packaging
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold block">
                      Guaranteed Piping Hot
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Selected Restaurant Menu View */}
        {selectedRestaurant ? (
          <div className="space-y-8 animate-fade-in">
            {/* Navigation & Header */}
            <div className="space-y-4">
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="clay-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-xs font-black group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Back to Restaurants</span>
              </button>

              {/* Restaurant Hero Card */}
              <div className="relative clay-card-pearl p-3 overflow-hidden shadow-xl">
                <div className="h-60 sm:h-72 w-full relative rounded-[22px] overflow-hidden">
                  <img
                    src={selectedRestaurant.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
                    alt={selectedRestaurant.name}
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent rounded-[22px]" />

                  <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-800 text-gold-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border border-emerald-700">
                          {selectedRestaurant.cuisineType}
                        </span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full shadow-xs ${
                          selectedRestaurant.isOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {selectedRestaurant.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-serif">{selectedRestaurant.name}</h2>
                      <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl font-normal leading-relaxed">
                        {selectedRestaurant.description}
                      </p>
                      <p className="text-xs text-stone-300 mt-1.5 font-semibold">
                        📍 {selectedRestaurant.address}, {selectedRestaurant.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-stone-900/70 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/20 self-start sm:self-auto shadow-md">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-black">{selectedRestaurant.rating || '4.8'}</span>
                      </div>
                      <div className="h-4 w-px bg-white/20" />
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Clock className="w-4 h-4 text-amber-300" />
                        <span>{selectedRestaurant.deliveryTimeMinutes} mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Filtering & Management Toolbar with Dynamic Hovers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 clay-card p-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'clay-chip-active scale-105'
                        : 'clay-btn-secondary !py-1.5 !px-3.5 hover:border-emerald-700/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filters & Actions */}
              <div className="flex items-center gap-3">
                {/* Pure Veg Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none bg-[#ece5d8] px-4 py-2 rounded-full shadow-[inset_1px_1px_2px_rgba(50,45,35,0.12)] hover:bg-[#e4dcce] transition-colors">
                  <input
                    type="checkbox"
                    checked={vegOnly}
                    onChange={(e) => setVegOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
                  <span className="text-xs font-black text-stone-700">Pure Veg Only</span>
                </label>

                {/* Owner/Admin Action: Add Dish */}
                {(activeView === 'management' || (user && (user.role === 'ROLE_RESTAURANT_OWNER' || user.role === 'ROLE_ADMIN'))) && (
                  <button
                    onClick={handleOpenAddMenuItem}
                    className="clay-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 group"
                    title="Add new signature dish to this restaurant's menu"
                  >
                    <PlusCircle className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                    <span>Add Dish in ₹</span>
                  </button>
                )}
              </div>
            </div>

            {/* Menu Items Grid with Dynamic Interactive Dish Hovers */}
            {menuLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-64 rounded-[28px] bg-[#ece5d8] animate-pulse" />
                ))}
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-16 clay-card p-8">
                <Utensils className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-black text-stone-800">No dishes found in this category</h3>
                <p className="text-xs text-stone-500 mt-1">Try switching categories or disabling the veg filter.</p>
                {(activeView === 'management' || (user && (user.role === 'ROLE_RESTAURANT_OWNER' || user.role === 'ROLE_ADMIN'))) && (
                  <button
                    onClick={handleOpenAddMenuItem}
                    className="mt-4 px-5 py-2.5 clay-btn-primary text-xs"
                  >
                    Add the first dish
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    isManagementMode={activeView === 'management' || (user && (user.role === 'ROLE_RESTAURANT_OWNER' || user.role === 'ROLE_ADMIN'))}
                    onEdit={handleOpenEditMenuItem}
                    onDelete={promptDeleteMenuItem}
                    onToggleAvailability={handleToggleAvailability}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Restaurants Overview / Management View */
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight font-serif">
                  {activeView === 'management' 
                    ? (user?.role === 'ROLE_ADMIN' ? 'Admin Process Control Center' : 'Kitchen Menu Management')
                    : 'Featured Epicurean Destinations'}
                </h2>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  {activeView === 'management' 
                    ? (user?.role === 'ROLE_ADMIN'
                        ? 'Master control over platform dining establishments and live order fulfillment pipeline.'
                        : 'Select any dining venue below to add signature dishes to its menu, adjust prices in ₹, or manage kitchen stock.')
                    : `Displaying ${restaurants.length} acclaimed culinary establishments with pricing in Indian Rupees (₹)`}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {activeView === 'management' && user?.role === 'ROLE_ADMIN' && (
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#ece5d8] shadow-[inset_1px_1px_3px_rgba(50,45,35,0.12)]">
                    <button
                      onClick={() => setAdminTab('restaurants')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        adminTab === 'restaurants'
                          ? 'clay-btn-primary !py-1.5 !px-3.5'
                          : 'text-stone-600 hover:text-emerald-900'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Venues ({restaurants.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        setAdminTab('orders');
                        loadAllOrders();
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        adminTab === 'orders'
                          ? 'clay-btn-primary !py-1.5 !px-3.5'
                          : 'text-stone-600 hover:text-emerald-900'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Live Orders ({allOrders.length})</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={activeView === 'management' && adminTab === 'orders' ? loadAllOrders : loadRestaurants}
                  disabled={loading || ordersLoading}
                  className="clay-btn-secondary px-4 py-2 text-xs flex items-center gap-1.5 group"
                  title="Refresh view"
                >
                  <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180 ${loading || ordersLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                {/* Admin Only: Create Restaurant */}
                {activeView === 'management' && user?.role === 'ROLE_ADMIN' && adminTab === 'restaurants' && (
                  <button
                    onClick={handleOpenAddRestaurant}
                    className="clay-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 group"
                    title="Admin Priority: Register new establishment"
                  >
                    <PlusCircle className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                    <span>Add Restaurant</span>
                  </button>
                )}
              </div>
            </div>

            {/* Admin Live Orders Fulfillment Pipeline View */}
            {activeView === 'management' && user?.role === 'ROLE_ADMIN' && adminTab === 'orders' ? (
              <div className="space-y-4 animate-fade-in">
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-40 rounded-[28px] bg-[#ece5d8] animate-pulse" />
                    ))}
                  </div>
                ) : allOrders.length === 0 ? (
                  <div className="text-center py-20 clay-card p-8 space-y-3">
                    <Package className="w-12 h-12 text-stone-300 mx-auto" />
                    <h3 className="text-lg font-black text-stone-800">No customer orders placed yet</h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Switch to the Customer profile using 1-Click Sign In and place a food order to test live fulfillment!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allOrders.map((order) => {
                      const statusStyles = {
                        CONFIRMED: 'bg-amber-100 text-amber-900 border-amber-300',
                        PREPARING: 'bg-blue-100 text-blue-900 border-blue-300',
                        OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-900 border-purple-300',
                        DELIVERED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                        CANCELLED: 'bg-rose-100 text-rose-900 border-rose-300',
                      };

                      return (
                        <div key={order.id} className="clay-card p-5 space-y-4 hover:shadow-lg transition-all">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="font-serif font-black text-stone-900 text-base">
                                #{order.orderNumber}
                              </span>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${statusStyles[order.status] || 'bg-stone-100'}`}>
                                {order.status}
                              </span>
                            </div>

                            <div className="text-xs text-stone-500 font-medium">
                              Ordered at: <span className="text-stone-800 font-bold">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Customer & Address Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-0.5">
                                Customer Details
                              </span>
                              <span className="font-bold text-stone-900 text-sm block">
                                {order.userName || 'Valued Customer'}
                              </span>
                              <span className="text-stone-500 font-medium">
                                Destination: {order.deliveryAddress}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-0.5">
                                Ordered Items
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {order.items?.map((it, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs">
                                    <span className="font-black text-emerald-800">{it.quantity}x</span>
                                    <span>{it.name}</span>
                                    <span className="text-stone-400">• ₹{(it.price * it.quantity).toFixed(2)}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Order Total & Admin Action Buttons */}
                          <div className="pt-3 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-sm font-black text-emerald-900">
                              Grand Total: <span className="text-base text-stone-900">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                            </div>

                            {/* Process Advancement Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {order.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                                  className="px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-transform hover:scale-105 flex items-center gap-1.5"
                                >
                                  <ChefHat className="w-3.5 h-3.5" />
                                  <span>Start Preparing (Kitchen)</span>
                                </button>
                              )}

                              {order.status === 'PREPARING' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                                  className="px-3.5 py-1.5 rounded-full text-xs font-black bg-purple-700 hover:bg-purple-800 text-white shadow-xs transition-transform hover:scale-105 flex items-center gap-1.5"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Dispatch (Out for Delivery)</span>
                                </button>
                              )}

                              {order.status === 'OUT_FOR_DELIVERY' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                                  className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-transform hover:scale-105 flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Mark Delivered</span>
                                </button>
                              )}

                              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 shadow-xs transition-colors"
                                >
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Restaurant Venues Grid (For Admin, Owner, and Storefront) */
              loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-72 rounded-[28px] bg-[#ece5d8] animate-pulse" />
                  ))}
                </div>
              ) : restaurants.length === 0 ? (
                <div className="text-center py-20 clay-card p-8 space-y-3">
                  <ChefHat className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="text-lg font-black text-stone-800">No destinations match your search</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {activeView === 'management' 
                      ? 'No dining venues found under this view.' 
                      : 'Try clearing your search keyword or selecting "All" traditions.'}
                  </p>
                  {activeView === 'management' && user?.role === 'ROLE_ADMIN' && (
                    <button
                      onClick={handleOpenAddRestaurant}
                      className="mt-2 px-5 py-2.5 clay-btn-primary text-xs"
                    >
                      Create Restaurant
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((r) => (
                    <RestaurantCard
                      key={r.id}
                      restaurant={r}
                      onSelect={(rest) => setSelectedRestaurant(rest)}
                      isManagementMode={activeView === 'management'}
                      onEdit={handleOpenEditRestaurant}
                      onDelete={promptDeleteRestaurant}
                      canDelete={user?.role === 'ROLE_ADMIN'}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </main>

      {/* Recruiter / Editorial Footer Banner */}
      <footer className="mt-auto border-t border-[#e6ded2] bg-[#f2eee6] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Crave Delivery" className="h-6 w-auto object-contain" />
            <span className="font-serif font-black text-stone-900 tracking-wider">CRAVE DELIVERY</span>
            <span>•</span>
            <span>Delivering bespoke culinary experiences across India • Indian Rupees (₹)</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-black text-emerald-900 bg-emerald-100 hover:bg-emerald-200/80 px-4 py-2 rounded-full border border-emerald-300 transition-all shadow-xs group"
            >
              <span>Partner & Developer API Documentation</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Cart Side Drawer (Strictly Enforces Login for Placing Orders) */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        showToast={showToast}
      />

      {/* Auth Modal (Login / Register / 1-Click Demo) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      {/* Restaurant Modal (Create / Edit) */}
      <RestaurantModal
        isOpen={restaurantModalOpen}
        onClose={() => setRestaurantModalOpen(false)}
        restaurantToEdit={restaurantToEdit}
        onSuccess={loadRestaurants}
        showToast={showToast}
      />

      {/* Menu Item Modal (Create / Edit) */}
      {selectedRestaurant && (
        <MenuItemModal
          isOpen={menuItemModalOpen}
          onClose={() => setMenuItemModalOpen(false)}
          restaurantId={selectedRestaurant.id}
          itemToEdit={menuItemToEdit}
          onSuccess={() => loadMenuItems(selectedRestaurant.id)}
          showToast={showToast}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={deleteType === 'restaurant' ? `Delete ${deleteTarget?.name}?` : `Delete dish ${deleteTarget?.name}?`}
        message={
          deleteType === 'restaurant'
            ? 'This will permanently delete this restaurant and all associated dishes from your directory.'
            : 'This will permanently remove this recipe item from the restaurant menu.'
        }
      />
    </div>
  );
}
