import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { orderApi } from '../api/orders';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onOpenAuth,
  showToast
}) {
  const [address, setAddress] = useState('Flat 402, Lotus Palms, 100ft Road, Indiranagar, Bangalore');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  // Rupee calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 300 || subtotal === 0 ? 0 : 40.00;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Strict authentication enforcement
    if (!user) {
      showToast('Please sign in or register to place your order.', 'error');
      onOpenAuth();
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        deliveryAddress: address,
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity
        }))
      };

      const res = await orderApi.placeOrder(orderPayload);
      setPlacedOrder(res.data);
      onClearCart();
      showToast(`Order #${res.data.orderNumber} placed successfully!`, 'success');

      setTimeout(() => {
        setPlacedOrder(null);
        onClose();
      }, 3500);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fbf9f5] shadow-2xl flex flex-col justify-between border-l border-[#e6ded2]">
          {/* Header with Editorial Typography */}
          <div className="p-6 border-b border-[#e6ded2] flex items-center justify-between bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 border border-emerald-200 text-emerald-900 flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-stone-900">Your Epicurean Basket</h3>
                <p className="text-xs text-stone-500 font-medium">{items.length} {items.length === 1 ? 'dish' : 'dishes'} selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {placedOrder ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-[6px_8px_24px_rgba(6,78,59,0.25)] animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-200">
                    Order Confirmed
                  </span>
                  <h4 className="text-2xl font-black font-serif text-stone-900 mt-2">
                    {placedOrder.orderNumber}
                  </h4>
                  <p className="text-base font-black text-emerald-800 mt-1">
                    Total: ₹{parseFloat(placedOrder.totalAmount).toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed font-medium">
                  Transmitted directly to the head chef! Expected delivery in ~30 minutes at:
                  <span className="block font-bold text-stone-800 mt-1">{placedOrder.deliveryAddress}</span>
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-20 h-20 rounded-3xl bg-[#eee8dd] text-stone-400 flex items-center justify-center shadow-[inset_2px_2px_5px_rgba(50,45,35,0.12)]">
                  <ShoppingBag className="w-9 h-9 text-stone-400" />
                </div>
                <h4 className="text-lg font-bold font-serif text-stone-800">Your basket is empty</h4>
                <p className="text-xs text-stone-400 max-w-xs font-medium">
                  Explore acclaimed restaurant partners and select fine dishes in Indian Rupees (₹).
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl clay-card bg-white"
                >
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate font-serif">{item.name}</h5>
                    {/* Item Total in Rupees */}
                    <span className="text-sm font-black text-emerald-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 overflow-hidden shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-stone-200 text-stone-700 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-black text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-stone-200 text-stone-700 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {items.length > 0 && !placedOrder && (
            <div className="p-6 border-t border-[#e6ded2] bg-white/90 backdrop-blur-md space-y-4">
              <div>
                <label className="block text-[11px] font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  Delivery Destination (India)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 clay-input text-xs font-medium text-stone-800"
                />
              </div>

              {/* Price Breakdown in Rupees (₹) */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Selected Dishes Subtotal</span>
                  <span className="font-bold text-stone-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Express Thermal Delivery</span>
                  <span className="font-bold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[10px] font-black border border-emerald-200">
                        COMPLIMENTARY (Over ₹300)
                      </span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-bold text-stone-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-900 pt-2.5 border-t border-stone-200">
                  <span className="font-serif">Grand Total</span>
                  <span className="text-emerald-900 text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Authentication & Role Status Callouts */}
              {!user && (
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Sign in as a Customer to confirm delivery destination and dispatch your order.</span>
                </div>
              )}

              {user && user.role !== 'ROLE_CUSTOMER' && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-xs text-rose-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-800">
                    <Lock className="w-4 h-4 text-rose-700 flex-shrink-0" />
                    <span>Food Ordering Restricted</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-700">
                    You are signed in as an <strong>{user.role === 'ROLE_ADMIN' ? 'Admin' : 'Restaurant Owner'}</strong>. Only customer accounts can place food orders. Admins and Owners are dedicated to overall process control and restaurant menu management.
                  </p>
                  <button
                    onClick={() => {
                      onOpenAuth();
                    }}
                    className="mt-1 text-[11px] font-black text-rose-900 underline hover:text-rose-950 block"
                  >
                    Switch to Customer Profile (1-Click) →
                  </button>
                </div>
              )}

              {/* Order Button (Protected strictly for Customers) */}
              {user ? (
                user.role === 'ROLE_CUSTOMER' ? (
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full py-3.5 px-4 clay-btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50 group"
                  >
                    <span>{loading ? 'Transmitting Order...' : `Pay & Place Order • ₹${total.toFixed(2)}`}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-full bg-stone-200 text-stone-500 font-bold text-xs cursor-not-allowed shadow-none"
                  >
                    Ordering Reserved for Customer Accounts
                  </button>
                )
              ) : (
                <button
                  onClick={() => {
                    showToast('Please sign in or select a customer profile to place an order.', 'info');
                    onOpenAuth();
                  }}
                  className="w-full py-3.5 px-4 clay-btn-primary bg-gradient-to-r from-stone-900 to-emerald-950 hover:from-stone-800 hover:to-emerald-900 flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <Lock className="w-4 h-4 text-gold-300" />
                  <span>Sign In as Customer to Order (₹{total.toFixed(2)})</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
