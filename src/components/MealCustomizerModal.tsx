import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Clock, Check, Sparkles } from 'lucide-react';
import { FoodItem, FoodOption, CartItem } from '../types';

interface MealCustomizerModalProps {
  meal: FoodItem | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const MealCustomizerModal: React.FC<MealCustomizerModalProps> = ({
  meal,
  onClose,
  onAddToCart,
}) => {
  if (!meal) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedProtein, setSelectedProtein] = useState<FoodOption | undefined>(
    meal.proteinOptions && meal.proteinOptions.length > 0 ? meal.proteinOptions[0] : undefined
  );
  const [selectedExtras, setSelectedExtras] = useState<FoodOption[]>([]);
  const [selectedSpice, setSelectedSpice] = useState(meal.spiceLevel);
  const [notes, setNotes] = useState('');

  const toggleExtra = (extra: FoodOption) => {
    const exists = selectedExtras.some((e) => e.name === extra.name);
    if (exists) {
      setSelectedExtras(selectedExtras.filter((e) => e.name !== extra.name));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const proteinPrice = selectedProtein ? selectedProtein.price : 0;
  const extrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = meal.price + proteinPrice + extrasPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const cartItem: CartItem = {
      id: `${meal.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      foodItem: meal,
      quantity,
      selectedProtein,
      selectedExtras,
      notes: notes.trim() ? `${selectedSpice} Heat. ${notes}` : `${selectedSpice} Heat`,
      unitPrice,
      totalPrice,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e7ded5] my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-neutral-900">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="text-xs font-semibold text-[#ffb74d] uppercase tracking-wider">
              {meal.category}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">{meal.name}</h2>
            <div className="flex items-center gap-3 text-xs text-neutral-300 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {meal.preparationTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#ff7043]" /> {meal.spiceLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <p className="text-sm text-[#5d4d42] leading-relaxed">{meal.description}</p>

          {/* Protein Options (if any) */}
          {meal.proteinOptions && meal.proteinOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
                  Select Protein / Meat <span className="text-[#e65100]">*</span>
                </label>
                <span className="text-[11px] text-neutral-500">Pick 1</span>
              </div>
              <div className="space-y-2">
                {meal.proteinOptions.map((protein) => {
                  const isSelected = selectedProtein?.name === protein.name;
                  return (
                    <div
                      key={protein.name}
                      onClick={() => setSelectedProtein(protein)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#e65100] bg-[#fff8f2] text-[#1c140e]'
                          : 'border-[#e7ded5] hover:bg-[#faf7f2] text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#e65100] bg-[#e65100]'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{protein.name}</span>
                      </div>
                      <span className="tabular-nums font-semibold">
                        {protein.price > 0 ? `+₦${protein.price.toLocaleString()}` : 'Included'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra Addons (Sides, Plantain, Coleslaw) */}
          {meal.extraOptions && meal.extraOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
                  Add Tasty Sides & Extras
                </label>
                <span className="text-[11px] text-neutral-500">Optional</span>
              </div>
              <div className="space-y-2">
                {meal.extraOptions.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.name === extra.name);
                  return (
                    <div
                      key={extra.name}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#008751] bg-[#f0f9f4] text-[#1c140e]'
                          : 'border-[#e7ded5] hover:bg-[#faf7f2] text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                            isChecked
                              ? 'border-[#008751] bg-[#008751] text-white'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{extra.name}</span>
                      </div>
                      <span className="tabular-nums font-semibold text-[#008751]">
                        +₦{extra.price.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level Adjustment */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
              Pepper & Heat Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Mild', 'Medium', 'Hot', 'Extra Hot (Pepper Soup Style)'] as const).map(
                (spice) => (
                  <button
                    key={spice}
                    type="button"
                    onClick={() => setSelectedSpice(spice)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      selectedSpice === spice
                        ? 'border-[#e65100] bg-[#fff3e0] text-[#c94500]'
                        : 'border-[#e7ded5] text-neutral-700 hover:bg-[#faf7f2]'
                    }`}
                  >
                    {spice.replace(' (Pepper Soup Style)', ' 🔥')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Kitchen Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
              Kitchen Special Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Extra pepper on the side, no onion in sauce..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
            />
          </div>
        </div>

        {/* Modal Footer with Quantity and Add Button */}
        <div className="p-4 sm:p-6 bg-[#faf7f2] border-t border-[#e7ded5] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#d6c7b8] rounded-lg bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-xs font-bold tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-6 bg-[#e65100] hover:bg-[#c94500] text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-between cursor-pointer"
          >
            <span>Add to Tray</span>
            <span className="tabular-nums font-extrabold">₦{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
