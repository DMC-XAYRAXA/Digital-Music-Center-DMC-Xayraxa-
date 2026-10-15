/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 03 - PRODUCT CATALOG & MUSIC PACKAGE
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations, formatLak, formatLakSymbol, formatLakCompact, getLocalizedProduct } from '../../utils/i18n';
import { BeautifulNumberInput } from '../common/BeautifulNumberInput';
import { BankQrPaymentModal } from '../common/BankQrPaymentModal';
import { 
  Music, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  Package, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Clock,
  MapPin,
  X,
  Pencil,
  Save,
  Sliders
} from 'lucide-react';
import { ProductSKU, Order, LaoShippingCarrierId, LAO_SHIPPING_CARRIERS } from '../../types/dmc';

interface CatalogScreenProps {
  onNavigate: (tab: 'home' | 'membership' | 'catalog' | 'network' | 'wallet') => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ onNavigate }) => {
  const { products, orders, createOrder, currentMember, language, adminUpdateProduct, setIsAdminMode, isAdminMode, isAdminAuthenticated } = useDmc();
  const t = translations[language];
  const isAdmin = isAdminAuthenticated || isAdminMode;

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<{ [sku: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBankQrModalOpen, setIsBankQrModalOpen] = useState(false);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<Order | null>(null);

  // Direct Core Product MUSIC_SINGLE_1600 Editor Modal state
  const [isEditingCoreProduct, setIsEditingCoreProduct] = useState(false);
  const [coreEditSuccessNotice, setCoreEditSuccessNotice] = useState<string | null>(null);

  // Checkout form
  const [deliveryAddress, setDeliveryAddress] = useState({
    recipientName: currentMember.name,
    phone: currentMember.phone,
    province: 'Vientiane Capital',
    district: 'Chanthabouly',
    village: 'Ban Sihom',
  });
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('BCEL_ONE');
  const [selectedCarrierId, setSelectedCarrierId] = useState<LaoShippingCarrierId>('ANOUSITH');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const selectedCarrier = LAO_SHIPPING_CARRIERS.find(c => c.id === selectedCarrierId) || LAO_SHIPPING_CARRIERS[0];

  // Cart operations
  const addToCart = (sku: string) => {
    setCart(prev => ({
      ...prev,
      [sku]: (prev[sku] || 0) + 1,
    }));
  };

  const removeFromCart = (sku: string) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[sku] > 1) {
        copy[sku] -= 1;
      } else {
        delete copy[sku];
      }
      return copy;
    });
  };

  const clearCart = () => setCart({});

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const cartDetails = Object.entries(cart).map(([sku, qty]) => {
    const prod = products.find(p => p.sku === sku)!;
    return {
      product: prod,
      quantity: qty,
      subtotal: prod.priceLak * qty,
    };
  });

  const cartSubtotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  const hasPhysical = cartDetails.some(item => item.product.itemType === 'PHYSICAL');
  const shippingFee = hasPhysical ? selectedCarrier.baseFeeLak : 0;
  const cartTotal = cartSubtotal + shippingFee;

  // Instant Buy for Music Package
  const handleInstantBuyMusic = () => {
    setCart({ MUSIC_SINGLE_1600: 1 });
    setIsCheckoutOpen(true);
  };

  const isQrPaymentMethod = paymentMethod === 'BCEL_ONE' || paymentMethod === 'LAO_QR' || paymentMethod === 'BANK_TRANSFER';

  // Handle Checkout Action: open QR payment modal if QR method selected
  const handleStartPayment = async () => {
    if (isQrPaymentMethod) {
      setIsBankQrModalOpen(true);
      return;
    }
    await executeFinalizeOrder();
  };

  const executeFinalizeOrder = async (_paymentRef?: string) => {
    setIsProcessingPayment(true);
    const items = Object.entries(cart).map(([sku, qty]) => ({ sku, quantity: qty }));

    try {
      const created = await createOrder(items, paymentMethod, deliveryAddress, selectedCarrierId);
      setCart({});
      setIsCheckoutOpen(false);
      setIsBankQrModalOpen(false);
      setCheckoutSuccessOrder(created);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const filteredProducts = activeCategory === 'ALL'
    ? products
    : products.filter(p => p.category === activeCategory);

  const featuredMusic = products.find(p => p.sku === 'MUSIC_SINGLE_1600') || products[0];

  const [coreEditForm, setCoreEditForm] = useState({
    titleEn: featuredMusic.titleEn,
    titleLo: featuredMusic.titleLo,
    titleTh: featuredMusic.titleTh,
    descriptionEn: featuredMusic.descriptionEn,
    priceLak: featuredMusic.priceLak,
    commissionPoolLak: featuredMusic.commissionPoolLak,
    dmcBudget: featuredMusic.splitRule.dmcBudget || 900000,
    l1Share: featuredMusic.splitRule.l1Share || 400000,
    l2Share: featuredMusic.splitRule.l2Share || 200000,
    l3Share: featuredMusic.splitRule.l3Share || 100000,
    stockSellable: featuredMusic.stockSellable,
    warehouseId: featuredMusic.warehouseId,
    imageUrl: featuredMusic.imageUrl,
  });

  const handleOpenCoreEdit = () => {
    setCoreEditForm({
      titleEn: featuredMusic.titleEn,
      titleLo: featuredMusic.titleLo,
      titleTh: featuredMusic.titleTh,
      descriptionEn: featuredMusic.descriptionEn,
      priceLak: featuredMusic.priceLak,
      commissionPoolLak: featuredMusic.commissionPoolLak,
      dmcBudget: featuredMusic.splitRule.dmcBudget || 900000,
      l1Share: featuredMusic.splitRule.l1Share || 400000,
      l2Share: featuredMusic.splitRule.l2Share || 200000,
      l3Share: featuredMusic.splitRule.l3Share || 100000,
      stockSellable: featuredMusic.stockSellable,
      warehouseId: featuredMusic.warehouseId,
      imageUrl: featuredMusic.imageUrl,
    });
    setIsEditingCoreProduct(true);
  };

  const handleSaveCoreProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const l1 = Number(coreEditForm.l1Share);
    const l2 = Number(coreEditForm.l2Share);
    const l3 = Number(coreEditForm.l3Share);
    const dmc = Number(coreEditForm.dmcBudget);
    const pool = l1 + l2 + l3;

    adminUpdateProduct('MUSIC_SINGLE_1600', {
      titleEn: coreEditForm.titleEn,
      titleLo: coreEditForm.titleLo,
      titleTh: coreEditForm.titleTh,
      descriptionEn: coreEditForm.descriptionEn,
      priceLak: Number(coreEditForm.priceLak),
      commissionPoolLak: pool,
      splitRule: {
        ruleType: 'FIXED_MUSIC',
        l1Share: l1,
        l2Share: l2,
        l3Share: l3,
        dmcBudget: dmc,
      },
      stockSellable: Number(coreEditForm.stockSellable),
      warehouseId: coreEditForm.warehouseId,
      imageUrl: coreEditForm.imageUrl,
    });
    setIsEditingCoreProduct(false);
    setCoreEditSuccessNotice(`Core product MUSIC_SINGLE_1600 successfully saved! Price: ${formatLak(Number(coreEditForm.priceLak))}, Entitlement & Unilevel splits updated.`);
    setTimeout(() => setCoreEditSuccessNotice(null), 6000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner & Cart Floating Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>{t.catalogScreenTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.catalogScreenSub}
          </p>
        </div>

        {cartItemCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.cart} ({cartItemCount} • {formatLak(cartTotal)})</span>
          </button>
        )}
      </div>

      {coreEditSuccessNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Core Product Updated</div>
              <p className="text-slate-300 mt-0.5">{coreEditSuccessNotice}</p>
            </div>
          </div>
          <button onClick={() => setCoreEditSuccessNotice(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {checkoutSuccessOrder && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-emerald-200">
                Payment Settled & Order Confirmed! (Ref: {checkoutSuccessOrder.id})
              </div>
              <p className="mt-1 text-slate-300 leading-relaxed">
                Total: <strong>{formatLak(checkoutSuccessOrder.totalLak)}</strong> settled via {checkoutSuccessOrder.paymentMethod}. Commission awards have been processed atomically into the unilevel engine.
              </p>
              {checkoutSuccessOrder.items.some(i => i.sku === 'MUSIC_SINGLE_1600') && (
                <div className="mt-2 text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.qualifiedCongratulations}</span>
                </div>
              )}
              {checkoutSuccessOrder.carrierName && (
                <div className="mt-2 p-2 rounded-lg bg-slate-900/60 border border-emerald-500/20 text-slate-300 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Carrier: <strong className="text-white">{checkoutSuccessOrder.carrierName}</strong></span>
                  </div>
                  {checkoutSuccessOrder.trackingNumber && (
                    <span className="font-mono text-amber-300 font-bold text-[11px]">
                      Tracking: {checkoutSuccessOrder.trackingNumber}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setCheckoutSuccessOrder(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FEATURED CORE PRODUCT: MUSIC_SINGLE_1600 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 border-2 border-amber-500/40 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Music className="w-48 h-48 text-amber-400" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                {t.officialCorePackageBadge}
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold">
                MUSIC_SINGLE_1600
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {getLocalizedProduct(featuredMusic, language).title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {getLocalizedProduct(featuredMusic, language).description}
              </p>
            </div>

            {/* Candidate Split Disclosure (Mandatory Table from PDF Section 5 & 7) */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-2 text-xs">
              <div className="font-semibold text-amber-300 flex items-center justify-between">
                <span>{t.commissionSplitDisclosure}</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-white">{formatLak(featuredMusic.priceLak)}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    {formatLakCompact(featuredMusic.priceLak)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">DMC Studio</div>
                  <div className="font-bold text-slate-200 mt-0.5">{formatLak(featuredMusic.splitRule.dmcBudget || 900000)}</div>
                </div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-sans">L1 Direct</div>
                  <div className="font-bold text-amber-300 mt-0.5">{formatLak(featuredMusic.splitRule.l1Share || 400000)}</div>
                </div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-sans">L2 Second</div>
                  <div className="font-bold text-amber-300 mt-0.5">{formatLak(featuredMusic.splitRule.l2Share || 200000)}</div>
                </div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-sans">L3 Third</div>
                  <div className="font-bold text-amber-300 mt-0.5">{formatLak(featuredMusic.splitRule.l3Share || 100000)}</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                *{t.unallocatedNotice}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleInstantBuyMusic}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{t.buyMusicNow} ({formatLak(featuredMusic.priceLak)})</span>
              </button>

              <button
                onClick={() => addToCart('MUSIC_SINGLE_1600')}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
              >
                {t.addToCart}
              </button>

              {/* Admin Quick Edit Button — ADMINISTRATOR ONLY */}
              {isAdmin && (
                <button
                  onClick={handleOpenCoreEdit}
                  className="px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-2 transition-colors cursor-pointer shadow-sm ml-auto"
                  title="Administrator Only: Edit price, song entitlement description, and candidate unilevel splits"
                >
                  <Pencil className="w-4 h-4 text-amber-400" />
                  <span>{t.editCoreProduct}</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-amber-500/30 aspect-video shadow-2xl">
              <img
                src={featuredMusic.imageUrl}
                alt="DMC Recording Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
                <div className="text-xs text-white">
                  <span className="font-bold block">DMC Central Studio, Vientiane</span>
                  <span className="text-[11px] text-amber-400">Professional Studio Console & Live Acoustic Room</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
        {[
          { id: 'ALL', label: t.catAll },
          { id: 'GUITAR', label: t.catGuitar },
          { id: 'AUDIO_GEAR', label: t.catAudio },
          { id: 'ACCESSORY', label: t.catAccessory },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts
          .filter(p => p.sku !== 'MUSIC_SINGLE_1600')
          .map(product => {
            const inCartQty = cart[product.sku] || 0;
            const locProd = getLocalizedProduct(product, language);
            return (
              <div
                key={product.sku}
                className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all p-4 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={product.imageUrl}
                      alt={locProd.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
                      {t.stockLabel}: {product.stockSellable}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-amber-400 uppercase">
                      {product.sku}
                    </div>
                    <h4 className="font-bold text-sm text-white mt-0.5 line-clamp-1">
                      {locProd.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {locProd.description}
                    </p>
                  </div>

                  {/* SKU Commission Pool Info (Rev 2.6 50/30/20 default) */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{t.poolLabel}:</span>
                      <span className="font-mono font-bold text-amber-300">{formatLak(product.commissionPoolLak)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      50/30/20: L1 {formatLak(Math.round(product.commissionPoolLak * 0.5))} • L2 {formatLak(Math.round(product.commissionPoolLak * 0.3))} • L3 {formatLak(Math.round(product.commissionPoolLak * 0.2))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400">{t.price}</div>
                    <div className="text-base font-black text-white">
                      {formatLak(product.priceLak)}
                    </div>
                  </div>

                  {inCartQty > 0 ? (
                    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => removeFromCart(product.sku)}
                        className="p-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold px-2">{inCartQty}</span>
                      <button
                        onClick={() => addToCart(product.sku)}
                        className="p-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.sku)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* RECENT ORDERS LIST */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>{t.orderHistoryTitle}</span>
          </h3>
          <span className="text-xs text-slate-400">Asia/Vientiane Logistics</span>
        </div>

        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2.5 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300">{order.id}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{order.paymentMethod}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  order.status === 'DELIVERED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : order.status === 'SHIPPED'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1">
                {order.items.map(item => (
                  <div key={item.orderLineId} className="flex justify-between text-slate-300">
                    <span>{item.quantity}x {item.title}</span>
                    <span className="font-mono">{formatLak(item.totalLak)}</span>
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Carrier: <strong>{order.carrierName}</strong></span>
                  <span className="font-mono">Tracking: <strong>{order.trackingNumber}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CART DRAWER / MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Your Shopping Cart</span>
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {cartDetails.map(item => (
                <div
                  key={item.product.sku}
                  className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{item.product.titleEn}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formatLak(item.product.priceLak)} each
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.sku)}
                      className="p-1 rounded bg-slate-700 text-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold px-1.5">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.product.sku)}
                      className="p-1 rounded bg-slate-700 text-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-amber-300 ml-2 w-24 text-right">
                      {formatLak(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono">{formatLak(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping & Delivery (Lao Express)</span>
                <span className="font-mono">{hasPhysical ? formatLak(shippingFee) : '0 LAK (Service)'}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800">
                <span>Total Quote</span>
                <span className="font-mono text-amber-300">{formatLak(cartTotal)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL & PAYMENT SIMULATOR */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Checkout & Settlement Simulator</span>
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Delivery address */}
            <div className="space-y-3 text-xs">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Delivery & Contact Details</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Recipient Name"
                  value={deliveryAddress.recipientName}
                  onChange={e => setDeliveryAddress({ ...deliveryAddress, recipientName: e.target.value })}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={deliveryAddress.phone}
                  onChange={e => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Province"
                  value={deliveryAddress.province}
                  onChange={e => setDeliveryAddress({ ...deliveryAddress, province: e.target.value })}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="District"
                  value={deliveryAddress.district}
                  onChange={e => setDeliveryAddress({ ...deliveryAddress, district: e.target.value })}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Village"
                  value={deliveryAddress.village}
                  onChange={e => setDeliveryAddress({ ...deliveryAddress, village: e.target.value })}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            {/* Lao Shipping Carrier Selector */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="font-semibold text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Lao Shipping Carrier</span>
                </div>
                {hasPhysical && (
                  <span className="text-[11px] text-amber-400 font-mono font-bold">
                    Fee: {formatLak(shippingFee)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {LAO_SHIPPING_CARRIERS.map(carrier => {
                  const isSelected = selectedCarrierId === carrier.id;
                  return (
                    <button
                      key={carrier.id}
                      type="button"
                      onClick={() => setSelectedCarrierId(carrier.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-xs text-white">
                            {carrier.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {carrier.nameLao}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                        <span className="text-[9px] font-semibold text-emerald-400">
                          {carrier.estimatedDays}
                        </span>
                        <span className="font-mono font-bold text-amber-300 text-[10px]">
                          {hasPhysical ? formatLak(carrier.baseFeeLak) : '0 LAK (Service)'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="font-semibold text-slate-300">
                Payment Channel (Lao PDR Settlement)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'BCEL_ONE', label: 'BCEL One QR Pay' },
                  { id: 'LAO_QR', label: 'Lao QR (Universal)' },
                  { id: 'BANK_TRANSFER', label: 'Bank Transfer' },
                  { id: 'CREDIT_CARD', label: 'Credit Card / Visa' },
                ].map(meth => (
                  <button
                    key={meth.id}
                    type="button"
                    onClick={() => setPaymentMethod(meth.id as any)}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between ${
                      paymentMethod === meth.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{meth.label}</span>
                    {paymentMethod === meth.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Notice Banner */}
            {isQrPaymentMethod && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-[10px] shadow">
                    {paymentMethod === 'BCEL_ONE' ? 'BCEL' : 'LAO QR'}
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                      <span>{paymentMethod === 'BCEL_ONE' ? 'BCEL OnePay Instant QR' : 'Lao QR Universal (LAPNet)'}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                        {formatLakCompact(cartTotal)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Supports BCEL One, LDB Trust, JDB YesPay, VietinBank Lao
                    </div>
                  </div>
                </div>
                <QrCode className="w-5 h-5 text-amber-400 shrink-0" />
              </div>
            )}

            {/* Order Total & Settlement Button */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Amount Due:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{formatLak(cartTotal)}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {isQrPaymentMethod
                  ? 'Clicking Scan & Pay generates your official Lao Bank QR Code for mobile banking settlement.'
                  : 'Clicking Confirm simulates provider-signed payment settlement callback, immediately triggering the unilevel commission engine.'}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                disabled={isProcessingPayment}
                onClick={handleStartPayment}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <span>Settling Payment...</span>
                ) : isQrPaymentMethod ? (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Scan & Pay {formatLak(cartTotal)}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay {formatLak(cartTotal)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAO BANK QR PAYMENT MODAL */}
      <BankQrPaymentModal
        isOpen={isBankQrModalOpen}
        onClose={() => setIsBankQrModalOpen(false)}
        amountLak={cartTotal}
        purpose="ORDER_CHECKOUT"
        title={paymentMethod === 'BCEL_ONE' ? 'BCEL OnePay QR Checkout' : 'Lao QR Universal Settlement'}
        description={`Scan using BCEL One, LDB Trust, or any Lao mobile banking app to settle ${formatLak(cartTotal)}.`}
        onPaymentSuccess={details => {
          executeFinalizeOrder(details.reference);
        }}
      />

      {/* ================= EDIT CORE PRODUCT (MUSIC_SINGLE_1600) MODAL ================= */}
      {isEditingCoreProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">
                      Edit Core Product: MUSIC_SINGLE_1600
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Core Package
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure package price, song-production entitlement text, and 3-level unilevel sponsor allocations.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingCoreProduct(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoreProduct} className="space-y-4 text-xs">
              {/* Section 1: Pricing & Entitlement Description */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    1. Price & Entitlement Specification
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    SKU: MUSIC_SINGLE_1600
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <BeautifulNumberInput
                      label="Package Price (Integer LAK)"
                      placeholder="e.g. 1,600,000 or 1.6m"
                      value={coreEditForm.priceLak}
                      onChange={num => setCoreEditForm({ ...coreEditForm, priceLak: num })}
                      required
                      theme="amber"
                      presetChips={[500000, 1000000, 1600000, 2000000]}
                      showMaxButton={false}
                      showKBadge={true}
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Studio / Warehouse Location
                    </label>
                    <input
                      type="text"
                      required
                      value={coreEditForm.warehouseId}
                      onChange={e => setCoreEditForm({ ...coreEditForm, warehouseId: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Song-Production Entitlement & Service Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={coreEditForm.descriptionEn}
                    onChange={e => setCoreEditForm({ ...coreEditForm, descriptionEn: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none leading-relaxed"
                    placeholder="one song-production entitlement per verified qualifying initial purchase. Includes full studio time, arrangement, vocal mastering, audio stems, and streaming upload."
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Displays across Member Portal, Catalog, and Studio Production Hub.
                  </span>
                </div>
              </div>

              {/* Section 2: Multilingual Package Titles */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block">
                  2. Multilingual Titles
                </span>

                <div className="space-y-2">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">English Title</label>
                    <input
                      type="text"
                      required
                      value={coreEditForm.titleEn}
                      onChange={e => setCoreEditForm({ ...coreEditForm, titleEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Lao Title (ພາສາລາວ)</label>
                      <input
                        type="text"
                        value={coreEditForm.titleLo}
                        onChange={e => setCoreEditForm({ ...coreEditForm, titleLo: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Thai Title (ไทย)</label>
                      <input
                        type="text"
                        value={coreEditForm.titleTh}
                        onChange={e => setCoreEditForm({ ...coreEditForm, titleTh: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Revenue & Commission Candidate Splits (Table 5 & 7) */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    3. Candidate Allocation & Unilevel Split (Rev 2.6)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Integer LAK per qualifying purchase
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">DMC Studio Budget</label>
                    <input
                      type="number"
                      step="10000"
                      value={coreEditForm.dmcBudget}
                      onChange={e => setCoreEditForm({ ...coreEditForm, dmcBudget: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold text-xs"
                    />
                    <span className="text-[9px] text-slate-400 block">Default: 900,000 LAK</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <label className="text-[10px] text-amber-400 block font-semibold">L1 Direct Share</label>
                    <input
                      type="number"
                      step="10000"
                      value={coreEditForm.l1Share}
                      onChange={e => setCoreEditForm({ ...coreEditForm, l1Share: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-2 text-amber-300 font-mono font-bold text-xs"
                    />
                    <span className="text-[9px] text-amber-400/80 block">Default: 400,000 LAK</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <label className="text-[10px] text-amber-400 block font-semibold">L2 Second Share</label>
                    <input
                      type="number"
                      step="10000"
                      value={coreEditForm.l2Share}
                      onChange={e => setCoreEditForm({ ...coreEditForm, l2Share: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-2 text-amber-300 font-mono font-bold text-xs"
                    />
                    <span className="text-[9px] text-amber-400/80 block">Default: 200,000 LAK</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <label className="text-[10px] text-amber-400 block font-semibold">L3 Third Share</label>
                    <input
                      type="number"
                      step="10000"
                      value={coreEditForm.l3Share}
                      onChange={e => setCoreEditForm({ ...coreEditForm, l3Share: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-2 text-amber-300 font-mono font-bold text-xs"
                    />
                    <span className="text-[9px] text-amber-400/80 block">Default: 100,000 LAK</span>
                  </div>
                </div>

                {/* Audit sum reconciliation preview */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-slate-400">
                    Unilevel Pool (L1+L2+L3): <strong className="text-amber-300">{formatLak(Number(coreEditForm.l1Share) + Number(coreEditForm.l2Share) + Number(coreEditForm.l3Share))}</strong>
                  </span>
                  <span className="text-slate-400">
                    Total Sum (Studio + Pool): <strong className="text-white">{formatLak(Number(coreEditForm.dmcBudget) + Number(coreEditForm.l1Share) + Number(coreEditForm.l2Share) + Number(coreEditForm.l3Share))}</strong>
                  </span>
                </div>
              </div>

              {/* Section 4: Image & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Sellable Capacity / Stock</label>
                  <input
                    type="number"
                    value={coreEditForm.stockSellable}
                    onChange={e => setCoreEditForm({ ...coreEditForm, stockSellable: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={coreEditForm.imageUrl}
                    onChange={e => setCoreEditForm({ ...coreEditForm, imageUrl: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Quick jump to Web Admin Portal */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span>Also accessible via Web Admin Portal under the Products tab.</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCoreProduct(false);
                    setIsAdminMode(true);
                  }}
                  className="text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
                >
                  <span>Open Full Admin Portal</span>
                </button>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditingCoreProduct(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg"
                >
                  Save Changes to Core Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
