import React, { useState, useMemo } from 'react';
import { Plus, Flame, Clock, Star, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';

interface MenuSectionProps {
  foodItems: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
  onQuickAdd: (food: FoodItem) => void;
  searchQuery: string;
}

const CATEGORIES = [
  'All Dishes',
  'Rice Dishes',
  'Soups & Swallows',
  'Grills & Suya',
  'Street Bites',
  'Drinks & Cocktails',
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  foodItems,
  onSelectFood,
  onQuickAdd,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Dishes');
  const [selectedSpice, setSelectedSpice] = useState<string>('All');

  const filteredFoods = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Dishes' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpice =
        selectedSpice === 'All' || item.spiceLevel === selectedSpice;

      return matchesCategory && matchesSearch && matchesSpice;
    });
  }, [foodItems, selectedCategory, searchQuery, selectedSpice]);

  return (
    <section id="menu-section" className="py-12 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#e65100] mb-1">
              Authentic Kitchen Fresh
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c140e] tracking-tight">
              Explore Nigerian Specialties
            </h2>
          </div>

          {/* Spice Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Heat Level:</span>
            <select
              value={selectedSpice}
              onChange={(e) => setSelectedSpice(e.target.value)}
              className="py-1 px-2.5 rounded-md border border-[#d6c7b8] bg-white text-xs font-semibold text-neutral-700 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
            >
              <option value="All">All Spices</option>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium Heat</option>
              <option value="Hot">Hot</option>
              <option value="Extra Hot (Pepper Soup Style)">Extra Hot 🔥</option>
            </select>
          </div>
        </div>

        {/* Interactive Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1c140e] text-white shadow-xs'
                  : 'bg-white text-neutral-700 border border-[#e7ded5] hover:bg-[#f5ede2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results Alert if active */}
        {searchQuery && (
          <div className="mb-6 text-xs text-neutral-600">
            Showing results for <strong className="text-[#1c140e]">"{searchQuery}"</strong> ({filteredFoods.length} meals found)
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredFoods.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-[#e7ded5] p-8">
            <p className="text-base font-semibold text-neutral-800">No dishes matched your criteria</p>
            <p className="text-xs text-neutral-500 mt-1">Try switching categories or clearing your search keywords.</p>
            <button
              onClick={() => {
                setSelectedCategory('All Dishes');
                setSelectedSpice('All');
              }}
              className="mt-4 px-4 py-2 bg-[#e65100] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFoods.map((meal) => (
              <div
                key={meal.id}
                className="group flex flex-col bg-white rounded-xl border border-[#e7ded5] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                {/* Product Image Frame */}
                <div
                  className="relative aspect-4/3 overflow-hidden bg-neutral-100 cursor-pointer"
                  onClick={() => onSelectFood(meal)}
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Special Tag or Preparation Time */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {meal.isSpecial && (
                      <span className="bg-[#e65100] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Special</span>
                      </span>
                    )}
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{meal.preparationTime}</span>
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-white/95 text-[#1c140e] text-[11px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{meal.rating}</span>
                  </div>
                </div>

                {/* Card Body & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Zero-Pill Clean Metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-[#736357] mb-1.5 font-medium">
                      <span>{meal.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-[#e65100]" />
                        <span>{meal.spiceLevel}</span>
                      </span>
                      {meal.calories && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{meal.calories} kcal</span>
                        </>
                      )}
                    </div>

                    <h3
                      onClick={() => onSelectFood(meal)}
                      className="text-base font-bold text-[#1c140e] group-hover:text-[#e65100] transition-colors cursor-pointer leading-snug line-clamp-1"
                    >
                      {meal.name}
                    </h3>

                    <p className="text-xs text-[#5d4d42] mt-1.5 line-clamp-2 leading-relaxed">
                      {meal.description}
                    </p>
                  </div>

                  {/* Card Footer: Price & Add Action */}
                  <div className="pt-4 mt-4 border-t border-[#f0e8de] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-neutral-400">Price</div>
                      <div className="text-base sm:text-lg font-extrabold text-[#1c140e] tabular-nums">
                        ₦{meal.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectFood(meal)}
                        className="py-1.5 px-3 text-xs font-semibold text-neutral-700 bg-[#faf7f2] hover:bg-[#ede5d8] rounded-md transition-colors cursor-pointer"
                      >
                        Customize
                      </button>
                      <button
                        onClick={() => onQuickAdd(meal)}
                        className="p-2 bg-[#e65100] hover:bg-[#c94500] text-white rounded-md shadow-xs transition-transform active:scale-90 cursor-pointer"
                        title="Quick Add 1 plate"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
