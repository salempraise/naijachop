import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, Sparkles, ShoppingBag, ArrowRight, Phone } from 'lucide-react';
import { ChatMessage, FoodItem, CartItem } from '../types';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  foodItems: FoodItem[];
  onAddToCart: (item: CartItem) => void;
  onOpenCheckout: () => void;
  onOpenTracker: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'bot',
    text: "Kedu! Bawo ni! Sannu! Welcome to NaijaChop! 🇳🇬 I am your food ordering assistant. What authentic Nigerian meal are you craving today?",
    timestamp: 'Just now',
    quickActions: [
      { label: 'Party Jollof Rice (₦4,500)', action: 'order_jollof' },
      { label: 'Egusi & Pounded Yam (₦5,800)', action: 'order_egusi' },
      { label: 'Fiery Beef Suya (₦3,800)', action: 'order_suya' },
      { label: 'Delivery Areas & Times', action: 'faq_delivery' },
      { label: 'Speak to Human Support', action: 'human_support' },
    ],
  },
];

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  foodItems,
  onAddToCart,
  onOpenCheckout,
  onOpenTracker,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      processBotResponse(text);
      setIsTyping(false);
    }, 600);
  };

  const processBotResponse = (input: string) => {
    const lower = input.toLowerCase();

    // 1. Jollof intent
    if (lower.includes('jollof') || lower.includes('rice') || lower.includes('order_jollof')) {
      const jollof = foodItems.find((f) => f.name.toLowerCase().includes('jollof')) || foodItems[0];
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "Our smoky party jollof with grilled peppered chicken and caramelized plantain is our #1 best seller! How many plates should I dish up for you?",
          timestamp: 'Just now',
          foodRecommendation: jollof,
          quickActions: [
            {
              label: 'Add 1 Plate (₦4,500)',
              action: 'add_dish',
              payload: { food: jollof, qty: 1 },
            },
            {
              label: 'Add 2 Plates (₦9,000)',
              action: 'add_dish',
              payload: { food: jollof, qty: 2 },
            },
            { label: 'Pair with Chilled Zobo', action: 'add_zobo' },
          ],
        },
      ]);
      return;
    }

    // 2. Egusi & Swallow intent
    if (
      lower.includes('egusi') ||
      lower.includes('yam') ||
      lower.includes('soup') ||
      lower.includes('swallow') ||
      lower.includes('order_egusi')
    ) {
      const egusi = foodItems.find((f) => f.name.toLowerCase().includes('egusi')) || foodItems[1];
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "A solid choice! Rich Egusi soup with stockfish, assorted meat, and smooth fluffy pounded yam. Shall I add 1 portion to your tray?",
          timestamp: 'Just now',
          foodRecommendation: egusi,
          quickActions: [
            {
              label: 'Add to Tray (₦5,800)',
              action: 'add_dish',
              payload: { food: egusi, qty: 1 },
            },
            { label: 'Add Extra Swallow (+₦1,000)', action: 'custom_swallow' },
          ],
        },
      ]);
      return;
    }

    // 3. Suya & Grills intent
    if (lower.includes('suya') || lower.includes('grill') || lower.includes('order_suya')) {
      const suya = foodItems.find((f) => f.name.toLowerCase().includes('suya')) || foodItems[2];
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "Authentic Northern beef suya seasoned with raw Kano yaji pepper spice, red onions, and ripe tomatoes. Sizzling hot off the coals!",
          timestamp: 'Just now',
          foodRecommendation: suya,
          quickActions: [
            {
              label: 'Add Suya (₦3,800)',
              action: 'add_dish',
              payload: { food: suya, qty: 1 },
            },
            { label: 'Add Chapman Drink (₦2,200)', action: 'add_drink' },
          ],
        },
      ]);
      return;
    }

    // 4. Drinks / Zobo / Chapman
    if (lower.includes('drink') || lower.includes('zobo') || lower.includes('chapman') || lower.includes('add_zobo')) {
      const drink = foodItems.find((f) => f.category === 'Drinks & Cocktails') || foodItems[3];
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "Nothing quenches the thirst like ice-cold hibiscus Zobo and Nigerian Chapman with aromatic bitters! Added to recommendation.",
          timestamp: 'Just now',
          foodRecommendation: drink,
          quickActions: [
            {
              label: 'Add Drinks (₦2,200)',
              action: 'add_dish',
              payload: { food: drink, qty: 1 },
            },
            { label: 'Proceed to Checkout', action: 'go_checkout' },
          ],
        },
      ]);
      return;
    }

    // 5. Delivery FAQ
    if (lower.includes('delivery') || lower.includes('time') || lower.includes('area') || lower.includes('faq_delivery')) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "🚚 Delivery Information:\n• Lagos: Island (VI, Ikoyi, Lekki) & Mainland (Ikeja, Surulere, Yaba, Gbagada) in 30-45 mins.\n• Abuja: Wuse 2, Maitama, Jabi in 35-50 mins.\n• Port Harcourt & Ibadan hubs active daily from 9:00 AM to 11:00 PM.",
          timestamp: 'Just now',
          quickActions: [
            { label: 'Order Party Jollof', action: 'order_jollof' },
            { label: 'Track Existing Order', action: 'track_order' },
          ],
        },
      ]);
      return;
    }

    // 6. Track order
    if (lower.includes('track') || lower.includes('where is my order') || lower.includes('status') || lower.includes('track_order')) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "You can track your live kitchen and courier status in real-time. Would you like me to open the Live Order Tracker?",
          timestamp: 'Just now',
          quickActions: [
            { label: 'Open Live Order Tracker', action: 'open_tracker' },
            { label: 'Ask Another Question', action: 'faq_delivery' },
          ],
        },
      ]);
      return;
    }

    // 7. Human Support
    if (lower.includes('human') || lower.includes('agent') || lower.includes('support') || lower.includes('human_support')) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "📞 Our dispatch and customer care center is ready! You can reach our Lagos dispatch lead on +234 800 NAIJACHOP (0800 6245 22467) or WhatsApp +234 803 123 4567.",
          timestamp: 'Just now',
          quickActions: [
            { label: 'Back to Food Menu', action: 'order_jollof' },
            { label: 'Track Order', action: 'track_order' },
          ],
        },
      ]);
      return;
    }

    // Default polite response
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "I can help you select authentic dishes, add them to your food tray, or check delivery coverage. What would you like to explore?",
        timestamp: 'Just now',
        quickActions: [
          { label: 'Party Jollof Rice', action: 'order_jollof' },
          { label: 'Egusi & Pounded Yam', action: 'order_egusi' },
          { label: 'Northern Beef Suya', action: 'order_suya' },
          { label: 'Track Order', action: 'track_order' },
        ],
      },
    ]);
  };

  const handleActionClick = (action: string, payload?: any) => {
    if (action === 'add_dish' && payload?.food) {
      const cartItem: CartItem = {
        id: `${payload.food.id}-${Date.now()}`,
        foodItem: payload.food,
        quantity: payload.qty || 1,
        selectedProtein: payload.food.proteinOptions?.[0],
        selectedExtras: [],
        unitPrice: payload.food.price,
        totalPrice: payload.food.price * (payload.qty || 1),
      };
      onAddToCart(cartItem);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-added-${Date.now()}`,
          sender: 'bot',
          text: `Done! ${payload.qty}x ${payload.food.name} added to your tray. Would you like to add a drink or proceed to checkout?`,
          timestamp: 'Just now',
          quickActions: [
            { label: 'Add Chilled Zobo (₦2,200)', action: 'add_zobo' },
            { label: 'Proceed to Checkout 💳', action: 'go_checkout' },
            { label: 'Add More Food', action: 'order_jollof' },
          ],
        },
      ]);
      return;
    }

    if (action === 'go_checkout') {
      onOpenCheckout();
      return;
    }

    if (action === 'track_order' || action === 'open_tracker') {
      onOpenTracker();
      return;
    }

    // Default handle as user message query
    handleSend(action);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 py-3 px-4 bg-[#1c140e] hover:bg-black text-white text-xs font-bold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#3e2e22]"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#e65100]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#008751]" />
          </div>
          <span className="hidden sm:inline">NaijaChop Assistant</span>
        </button>
      )}

      {/* Floating Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-96 max-h-[580px] h-[550px] bg-white rounded-2xl shadow-2xl border border-[#e7ded5] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#1c140e] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e65100] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">NaijaChop Assistant</h3>
                <div className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span>Online · Victoria Island Hub</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#faf7f2]/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#e65100] text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                    NC
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#e65100] text-white rounded-br-xs'
                        : 'bg-white text-[#1c140e] border border-[#e7ded5] shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Food Recommendation Card */}
                  {msg.foodRecommendation && (
                    <div className="p-2.5 bg-white rounded-xl border border-[#ede4d8] shadow-2xs flex gap-2.5 items-center">
                      <img
                        src={msg.foodRecommendation.image}
                        alt={msg.foodRecommendation.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#1c140e] truncate">
                          {msg.foodRecommendation.name}
                        </div>
                        <div className="text-[#e65100] font-extrabold tabular-nums">
                          ₦{msg.foodRecommendation.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((qa, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(qa.action, qa.payload)}
                          className="py-1 px-2.5 bg-white hover:bg-[#fff3e0] text-[#1c140e] hover:text-[#c94500] border border-[#d6c7b8] rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-neutral-400 text-[11px] pl-8">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                <span>NaijaChop is replying...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#e7ded5]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about meals, egusi, delivery..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
              />
              <button
                type="submit"
                className="p-2 bg-[#e65100] hover:bg-[#c94500] text-white rounded-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
