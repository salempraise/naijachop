import React, { useState } from 'react';
import { X, Shield, Plus, Edit2, Trash2, CheckCircle, Clock, DollarSign, Package, AlertCircle, Eye } from 'lucide-react';
import { FoodItem, Order, OrderStatus, DiscountCode, User } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  foodItems: FoodItem[];
  discountCodes: DiscountCode[];
  currentUser: User | null;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateFoodItem: (item: FoodItem) => void;
  onAddFoodItem: (item: FoodItem) => void;
  onDeleteFoodItem: (id: string) => void;
  onViewReceipt: (order: Order) => void;
}

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Pending Payment',
  'Payment Confirmed',
  'Order Accepted',
  'Preparing Food',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  orders,
  foodItems,
  discountCodes,
  currentUser,
  onUpdateOrderStatus,
  onUpdateFoodItem,
  onAddFoodItem,
  onDeleteFoodItem,
  onViewReceipt,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'payments' | 'discounts'>('orders');
  const [showAddMealModal, setShowAddMealModal] = useState(false);

  // New Meal form states
  const [newMealName, setNewMealName] = useState('');
  const [newMealCategory, setNewMealCategory] = useState<FoodItem['category']>('Rice Dishes');
  const [newMealPrice, setNewMealPrice] = useState('4500');
  const [newMealDesc, setNewMealDesc] = useState('');
  const [newMealSpice, setNewMealSpice] = useState<FoodItem['spiceLevel']>('Medium');

  // Metrics
  const totalOrders = orders.length;
  const verifiedRevenue = orders
    .filter((o) => o.paymentStatus === 'verified')
    .reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(
    (o) =>
      o.orderStatus !== 'Delivered' &&
      o.orderStatus !== 'Cancelled' &&
      o.orderStatus !== 'Pending Payment'
  ).length;

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName.trim() || !newMealPrice) return;

    const priceNum = parseInt(newMealPrice, 10);
    const newDish: FoodItem = {
      id: `nc-custom-${Date.now()}`,
      name: newMealName.trim(),
      category: newMealCategory,
      price: priceNum,
      priceKobo: priceNum * 100,
      description: newMealDesc.trim() || 'Freshly made Nigerian delicacy.',
      image: foodItems[0]?.image || '/src/assets/images/meal_party_jollof_1793101497248.jpg',
      preparationTime: '25-35 mins',
      spiceLevel: newMealSpice,
      isAvailable: true,
      rating: 5.0,
      isSpecial: false,
    };

    onAddFoodItem(newDish);
    setShowAddMealModal(false);
    setNewMealName('');
    setNewMealDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Top Operations Header */}
        <div className="p-5 bg-[#1c140e] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e65100] text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                NaijaChop Operations & Kitchen Dispatch
              </h2>
              <div className="text-xs text-neutral-400">
                Staff: <span className="text-[#ffb74d] font-semibold">{currentUser?.name || 'Administrator'}</span> · RBAC Enforced
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#faf7f2] border-b border-[#e7ded5]">
          <div className="p-3.5 bg-white rounded-xl border border-[#ede4d8] shadow-2xs">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase">Verified Revenue</span>
            <div className="text-xl font-black text-[#008751] mt-0.5 tabular-nums">
              ₦{verifiedRevenue.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#ede4d8] shadow-2xs">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase">Active In Kitchen</span>
            <div className="text-xl font-black text-[#e65100] mt-0.5 tabular-nums">
              {activeOrdersCount} orders
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#ede4d8] shadow-2xs">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase">Total Orders</span>
            <div className="text-xl font-black text-[#1c140e] mt-0.5 tabular-nums">
              {totalOrders}
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#ede4d8] shadow-2xs">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase">Active Menu Items</span>
            <div className="text-xl font-black text-[#1c140e] mt-0.5 tabular-nums">
              {foodItems.filter((f) => f.isAvailable).length}
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#ede4d8] bg-white px-5 text-xs font-bold gap-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#e65100] text-[#e65100]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Orders & Live Dispatch ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'menu'
                ? 'border-[#e65100] text-[#e65100]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Food Menu Manager ({foodItems.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'payments'
                ? 'border-[#e65100] text-[#e65100]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Payment Gateway Audit
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'discounts'
                ? 'border-[#e65100] text-[#e65100]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Discount Coupons
          </button>
        </div>

        {/* Tab 1: Orders Dispatch Table */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="border border-[#e7ded5] rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#faf7f2] border-b border-[#ede4d8] text-[#736357] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Ref</th>
                    <th className="p-3">Customer & Address</th>
                    <th className="p-3">Dishes Ordered</th>
                    <th className="p-3">Total (₦)</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Order Status (Live Update)</th>
                    <th className="p-3 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede4d8]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-mono font-bold text-[#1c140e] whitespace-nowrap">
                        {ord.orderRef}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-[#1c140e]">{ord.customerName}</div>
                        <div className="text-[11px] text-neutral-500">{ord.phone}</div>
                        <div className="text-[11px] text-neutral-600 truncate max-w-[180px]">
                          {ord.deliveryAddress}, {ord.city}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-[11px] text-neutral-700">
                          {ord.items.map((it) => `${it.quantity}x ${it.foodItem.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="p-3 font-extrabold text-[#1c140e] tabular-nums whitespace-nowrap">
                        ₦{ord.total.toLocaleString()}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                            ord.paymentStatus === 'verified'
                              ? 'bg-[#e8f5e9] text-[#008751]'
                              : 'bg-[#fff3e0] text-[#e65100]'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-2 py-1 text-xs rounded-md border border-[#d6c7b8] bg-white font-semibold text-neutral-800 cursor-pointer focus:ring-1 focus:ring-[#e65100]"
                        >
                          {ORDER_STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onViewReceipt(ord)}
                          className="p-1.5 hover:bg-[#faf7f2] rounded-md text-[#e65100] transition-colors cursor-pointer"
                          title="View Verified Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Menu Manager */}
        {activeTab === 'menu' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
                  Available Nigerian Food Catalog
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Update dish availability, toggle stock, edit prices, or add new native meals.
                </p>
              </div>
              <button
                onClick={() => setShowAddMealModal(true)}
                className="py-2 px-3 bg-[#e65100] hover:bg-[#c94500] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Meal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foodItems.map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 rounded-xl border border-[#e7ded5] bg-white flex gap-3 items-center justify-between shadow-2xs"
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#1c140e] truncate">{meal.name}</h4>
                    <div className="text-[11px] text-neutral-500">
                      {meal.category} · {meal.spiceLevel}
                    </div>
                    <div className="text-xs font-extrabold text-[#e65100] tabular-nums mt-0.5">
                      ₦{meal.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateFoodItem({
                          ...meal,
                          isAvailable: !meal.isAvailable,
                        })
                      }
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                        meal.isAvailable
                          ? 'bg-green-100 text-[#008751] hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {meal.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>
                    <button
                      onClick={() => onDeleteFoodItem(meal.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Payment Audit */}
        {activeTab === 'payments' && (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="border border-[#e7ded5] rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#faf7f2] border-b border-[#ede4d8] text-[#736357] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order Ref</th>
                    <th className="p-3">Gateway Tx Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount (₦)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede4d8]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-mono font-bold text-[#1c140e]">{ord.orderRef}</td>
                      <td className="p-3 font-mono text-[11px] text-neutral-500">
                        {ord.transactionRef || 'pstk_test_demo'}
                      </td>
                      <td className="p-3">{ord.email}</td>
                      <td className="p-3 uppercase font-medium">{ord.paymentMethod}</td>
                      <td className="p-3 font-extrabold text-[#008751] tabular-nums">
                        ₦{ord.total.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-[#e8f5e9] text-[#008751]">
                          VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Discount Codes */}
        {activeTab === 'discounts' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {discountCodes.map((code) => (
                <div
                  key={code.code}
                  className="p-4 rounded-xl border border-[#e7ded5] bg-white shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#fff3e0] text-[#e65100] font-mono font-black text-sm">
                      {code.code}
                    </span>
                    <span className="text-xs font-bold text-[#008751]">
                      {code.percentage}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">{code.description}</p>
                  <div className="text-[11px] text-neutral-400">
                    Min order: ₦{code.minOrder.toLocaleString()} · Max cap: ₦{code.maxDiscount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Meal Submodal */}
        {showAddMealModal && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-2xl border space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-bold text-[#1c140e]">Add New Nigerian Dish</h3>
                <button
                  onClick={() => setShowAddMealModal(false)}
                  className="text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateMeal} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Meal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fisherman Soup with Semovita"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Category</label>
                    <select
                      value={newMealCategory}
                      onChange={(e) => setNewMealCategory(e.target.value as any)}
                      className="w-full px-2 py-1.5 border rounded-lg"
                    >
                      <option value="Rice Dishes">Rice Dishes</option>
                      <option value="Soups & Swallows">Soups & Swallows</option>
                      <option value="Grills & Suya">Grills & Suya</option>
                      <option value="Street Bites">Street Bites</option>
                      <option value="Drinks & Cocktails">Drinks & Cocktails</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Price in Naira (₦)</label>
                    <input
                      type="number"
                      required
                      value={newMealPrice}
                      onChange={(e) => setNewMealPrice(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Spice Heat</label>
                  <select
                    value={newMealSpice}
                    onChange={(e) => setNewMealSpice(e.target.value as any)}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Hot">Hot</option>
                    <option value="Extra Hot (Pepper Soup Style)">Extra Hot 🔥</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Description of ingredients, origin, cooking method..."
                    value={newMealDesc}
                    onChange={(e) => setNewMealDesc(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#e65100] text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Dish to Menu
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
