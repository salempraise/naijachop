/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { MealCustomizerModal } from './components/MealCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { ReceiptModal } from './components/ReceiptModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { PhpXamppModal } from './components/PhpXamppModal';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';

import {
  INITIAL_FOOD_ITEMS,
  DELIVERY_ZONES,
  DISCOUNT_CODES,
  SAMPLE_ORDERS,
} from './data/sampleFoods';
import {
  FoodItem,
  CartItem,
  Order,
  OrderStatus,
  User,
  DiscountCode,
  PaymentMethod,
} from './types';

export default function App() {
  // --- Global State ---
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('naijachop_foods');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('naijachop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('naijachop_orders');
    return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('naijachop_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedCity, setSelectedCity] = useState<string>('Victoria Island / Ikoyi');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Modals State ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingMeal, setCustomizingMeal] = useState<FoodItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingOrderInfo, setPendingOrderInfo] = useState<{
    orderRef: string;
    amount: number;
    customerEmail: string;
    gateway: PaymentMethod;
    pendingOrder: Order;
  } | null>(null);

  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrderRef, setTrackerOrderRef] = useState<string | undefined>(undefined);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPhpXamppOpen, setIsPhpXamppOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('naijachop_foods', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('naijachop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('naijachop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('naijachop_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('naijachop_user');
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Cart Operations ---
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.foodItem.id === item.foodItem.id &&
          i.selectedProtein?.name === item.selectedProtein?.name &&
          i.notes === item.notes
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                totalPrice: (i.quantity + item.quantity) * i.unitPrice,
              }
            : i
        );
      }
      return [...prev, item];
    });
    showToast(`Added ${item.foodItem.name} to tray!`);
  };

  const handleQuickAdd = (food: FoodItem) => {
    const newItem: CartItem = {
      id: `${food.id}-${Date.now()}`,
      foodItem: food,
      quantity: 1,
      selectedProtein: food.proteinOptions?.[0],
      selectedExtras: [],
      unitPrice: food.price,
      totalPrice: food.price,
    };
    handleAddToCart(newItem);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? {
                  ...item,
                  quantity: newQty,
                  totalPrice: newQty * item.unitPrice,
                }
              : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleApplyDiscount = (code: string) => {
    const coupon = DISCOUNT_CODES.find((c) => c.code === code && c.active);
    if (!coupon) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
    const subtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0);
    if (subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `This coupon requires a minimum feast order of ₦${coupon.minOrder.toLocaleString()}.`,
      };
    }
    setAppliedDiscount(coupon);
    return {
      success: true,
      message: `Success! ${coupon.percentage}% discount applied.`,
    };
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
  };

  // --- Checkout & Payment Flow ---
  const handleLaunchPayment = (orderData: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    notes: string;
    paymentMethod: PaymentMethod;
  }) => {
    const zone = DELIVERY_ZONES.find((z) => z.city === orderData.city) || DELIVERY_ZONES[0];
    const deliveryFee = zone.fee;
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    let discountAmount = 0;
    if (appliedDiscount && subtotal >= appliedDiscount.minOrder) {
      const calc = (subtotal * appliedDiscount.percentage) / 100;
      discountAmount = Math.min(calc, appliedDiscount.maxDiscount);
    }

    const total = Math.max(0, subtotal + deliveryFee - discountAmount);
    const orderRef = `NC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderRef,
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email,
      deliveryAddress: orderData.address,
      city: orderData.city,
      state: orderData.state,
      deliveryNotes: orderData.notes,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      discount: discountAmount,
      discountCode: appliedDiscount?.code,
      total,
      totalKobo: total * 100,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'Pending Payment',
      transactionRef: '',
      createdAt: 'Just now',
      estimatedDeliveryMinutes: zone.estimatedMinutes,
      driverInfo: {
        name: 'Emeka Okoro',
        phone: '+234 803 123 4567',
        vehicle: 'Bajaj Boxer Motorcycle',
        plateNumber: 'LAG-492-XY',
        rating: 4.9,
      },
    };

    setPendingOrderInfo({
      orderRef,
      amount: total,
      customerEmail: orderData.email,
      gateway: orderData.paymentMethod,
      pendingOrder: newOrder,
    });

    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (transactionRef: string) => {
    if (!pendingOrderInfo) return;

    const confirmedOrder: Order = {
      ...pendingOrderInfo.pendingOrder,
      paymentStatus: 'verified',
      orderStatus: 'Payment Confirmed',
      transactionRef,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setOrders((prev) => [confirmedOrder, ...prev]);
    setCartItems([]);
    setAppliedDiscount(null);
    setIsPaymentOpen(false);
    setActiveReceiptOrder(confirmedOrder);
    showToast(`Payment verified! Order ref: ${confirmedOrder.orderRef}`);
  };

  // --- Order Status Management (Admin & Tracker) ---
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    showToast(`Order status updated to: ${newStatus}`);
  };

  const handleUpdateFoodItem = (updated: FoodItem) => {
    setFoodItems((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleAddFoodItem = (newMeal: FoodItem) => {
    setFoodItems((prev) => [newMeal, ...prev]);
    showToast(`Added ${newMeal.name} to menu!`);
  };

  const handleDeleteFoodItem = (id: string) => {
    setFoodItems((prev) => prev.filter((f) => f.id !== id));
    showToast('Meal removed from menu.');
  };

  const handleTrackOrderFromReceipt = (ref: string) => {
    setActiveReceiptOrder(null);
    setTrackerOrderRef(ref);
    setIsTrackerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col text-[#1c140e]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-60 bg-[#1c140e] text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xl border border-[#3e2e22] animate-in fade-in slide-in-from-top-2 duration-150">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <Header
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPhpXampp={() => setIsPhpXamppOpen(true)}
        onOpenTracker={() => {
          setTrackerOrderRef(orders[0]?.orderRef);
          setIsTrackerOpen(true);
        }}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully.');
        }}
        selectedCity={selectedCity}
        onSelectCityClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero
        onOrderNow={() => {
          const el = document.getElementById('menu-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreSpecials={() => {
          setSearchQuery('');
          const el = document.getElementById('menu-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Menu Section */}
      <MenuSection
        foodItems={foodItems}
        onSelectFood={(meal) => setCustomizingMeal(meal)}
        onQuickAdd={handleQuickAdd}
        searchQuery={searchQuery}
      />

      {/* How it Works & Reviews */}
      <HowItWorks />

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <MealCustomizerModal
        meal={customizingMeal}
        onClose={() => setCustomizingMeal(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        appliedDiscount={appliedDiscount}
        onApplyDiscount={handleApplyDiscount}
        onRemoveDiscount={handleRemoveDiscount}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        selectedCity={selectedCity}
        appliedDiscount={appliedDiscount}
        currentUser={currentUser}
        onLaunchPayment={handleLaunchPayment}
      />

      {pendingOrderInfo && (
        <PaymentGatewayModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          orderRef={pendingOrderInfo.orderRef}
          amount={pendingOrderInfo.amount}
          customerEmail={pendingOrderInfo.customerEmail}
          gateway={pendingOrderInfo.gateway}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      <ReceiptModal
        order={activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
        onTrackOrder={handleTrackOrderFromReceipt}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        initialOrderRef={trackerOrderRef}
        onViewReceipt={(ord) => {
          setIsTrackerOpen(false);
          setActiveReceiptOrder(ord);
        }}
      />

      <ChatbotDrawer
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpen={() => setIsChatbotOpen(true)}
        foodItems={foodItems}
        onAddToCart={handleAddToCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenTracker={() => {
          setTrackerOrderRef(orders[0]?.orderRef);
          setIsTrackerOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome, ${user.name}!`);
        }}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        foodItems={foodItems}
        discountCodes={DISCOUNT_CODES}
        currentUser={currentUser}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateFoodItem={handleUpdateFoodItem}
        onAddFoodItem={handleAddFoodItem}
        onDeleteFoodItem={handleDeleteFoodItem}
        onViewReceipt={(ord) => {
          setIsAdminOpen(false);
          setActiveReceiptOrder(ord);
        }}
      />

      <PhpXamppModal
        isOpen={isPhpXamppOpen}
        onClose={() => setIsPhpXamppOpen(false)}
      />
    </div>
  );
}
