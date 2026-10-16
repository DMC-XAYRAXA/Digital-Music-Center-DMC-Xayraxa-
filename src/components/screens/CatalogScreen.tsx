/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 03 - PRODUCT CATALOG, MUSIC PACKAGE & PROFESSIONAL POP-UP SHOPPING CART
 * With Member Self-Service Lao Shipping Carrier & 18-Province Delivery Selector
 */

import React, { useState, useEffect } from 'react';
import { useDmc } from '../../context/DmcContext';
import {
  translations,
  formatLak,
  formatLakCompact,
  getLocalizedProduct,
} from '../../utils/i18n';
import { BeautifulNumberInput } from '../common/BeautifulNumberInput';
import { BankQrPaymentModal } from '../common/BankQrPaymentModal';
import { LaoShippingCarrierModal } from '../common/LaoShippingCarrierModal';
import { DmcOfficialLogo } from '../common/DmcLogo';
import {
  Music,
  ShoppingBag,
  ShoppingCart,
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
  Clock,
  MapPin,
  X,
  Pencil,
  Phone,
  User,
  Building2,
  Navigation,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  ProductSKU,
  Order,
  LaoShippingCarrierId,
  LAO_SHIPPING_CARRIERS,
} from '../../types/dmc';

interface CatalogScreenProps {
  onNavigate: (tab: 'home' | 'membership' | 'catalog' | 'network' | 'wallet') => void;
}

const LAO_18_PROVINCES = [
  'ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital)',
  'ແຂວງຫຼວງພະບາງ (Luang Prabang)',
  'ແຂວງຈຳປາສັກ - ປາກເຊ (Champasak / Pakse)',
  'ແຂວງສະຫວັນນະເຂດ (Savannakhet)',
  'ແຂວງຄຳມ່ວນ - ທ່າແຂກ (Khammouane / Thakhek)',
  'ແຂວງວຽງຈັນ - ໂພນໂຮງ (Vientiane Province)',
  'ແຂວງບໍລິຄຳໄຊ - ປາກຊັນ (Bolikhamxay / Paksan)',
  'ແຂວງອຸດົມໄຊ (Oudomxay)',
  'ແຂວງບໍ່ແກ້ວ - ຫ້ວຍຊາຍ (Bokeo / Houayxay)',
  'ແຂວງຫຼວງນ້ຳທາ (Luang Namtha)',
  'ແຂວງໄຊຍະບູລີ (Xayaboury)',
  'ແຂວງຊຽງຂວາງ - ໂພນສະຫວັນ (Xieng Khouang)',
  'ແຂວງຫົວພັນ - ຊຳເໜືອ (Houaphanh)',
  'ແຂວງຜົ້ງສາລີ (Phongsaly)',
  'ແຂວງສາລະວັນ (Salavan)',
  'ແຂວງເຊກອງ (Sekong)',
  'ແຂວງອັດຕະປື (Attapeu)',
  'ແຂວງໄຊສົມບູນ (Xaysomboun)',
];

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ onNavigate: _onNavigate }) => {
  const {
    products,
    orders,
    createOrder,
    currentMember,
    language,
    adminUpdateProduct,
    adminUpdateMember,
    setIsAdminMode,
    isAdminMode,
    isAdminAuthenticated,
  } = useDmc();
  const t = translations[language];
  const isAdmin = isAdminAuthenticated || isAdminMode;

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<{ [sku: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShippingGuideOpen, setIsShippingGuideOpen] = useState(false);
  const [isBankQrModalOpen, setIsBankQrModalOpen] = useState(false);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<Order | null>(null);
  const [shippingSavedToast, setShippingSavedToast] = useState<string | null>(null);

  // Direct Core Product MUSIC_SINGLE_1600 Editor Modal state (Administrator Only)
  const [isEditingCoreProduct, setIsEditingCoreProduct] = useState(false);
  const [coreEditSuccessNotice, setCoreEditSuccessNotice] = useState<string | null>(null);

  // Member Self-Service Shipping & Delivery state (synced with currentMember)
  const [selectedCarrierId, setSelectedCarrierId] = useState<LaoShippingCarrierId>(
    currentMember.preferredCarrierId || 'ANOUSITH'
  );
  const [deliveryAddress, setDeliveryAddress] = useState({
    recipientName: currentMember.deliveryAddress?.recipientName || currentMember.name,
    phone: currentMember.deliveryAddress?.phone || currentMember.phone,
    province:
      currentMember.deliveryAddress?.province || 'ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital)',
    district: currentMember.deliveryAddress?.district || 'Chanthabouly (ຈັນທະບູລີ)',
    village: currentMember.deliveryAddress?.village || 'Ban Sihom / Dongdok',
    note:
      currentMember.deliveryAddress?.note ||
      'Call recipient upon arrival / ໂທຫາຜູ້ຮັບເມື່ອຮອດສາຂາ',
  });
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('BCEL_ONE');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Keep shipping preferences synced when currentMember switches
  useEffect(() => {
    setSelectedCarrierId(currentMember.preferredCarrierId || 'ANOUSITH');
    setDeliveryAddress({
      recipientName: currentMember.deliveryAddress?.recipientName || currentMember.name,
      phone: currentMember.deliveryAddress?.phone || currentMember.phone,
      province:
        currentMember.deliveryAddress?.province || 'ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital)',
      district: currentMember.deliveryAddress?.district || 'Chanthabouly (ຈັນທະບູລີ)',
      village: currentMember.deliveryAddress?.village || 'Ban Sihom / Dongdok',
      note:
        currentMember.deliveryAddress?.note ||
        'Call recipient upon arrival / ໂທຫາຜູ້ຮັບເມື່ອຮອດສາຂາ',
    });
  }, [currentMember.memberId]);

  const selectedCarrier =
    LAO_SHIPPING_CARRIERS.find((c) => c.id === selectedCarrierId) || LAO_SHIPPING_CARRIERS[0];

  const handleMemberSelectCarrier = (carrierId: LaoShippingCarrierId) => {
    setSelectedCarrierId(carrierId);
    const carrierObj =
      LAO_SHIPPING_CARRIERS.find((c) => c.id === carrierId) || LAO_SHIPPING_CARRIERS[0];
    adminUpdateMember(currentMember.memberId, {
      preferredCarrierId: carrierId,
      deliveryAddress,
    });
    setShippingSavedToast(
      `Shipping set to ${carrierObj.name} (${carrierObj.nameLao}) • ${formatLak(
        carrierObj.baseFeeLak
      )}`
    );
    setTimeout(() => setShippingSavedToast(null), 3500);
  };

  const handleSaveMemberDeliveryProfile = () => {
    adminUpdateMember(currentMember.memberId, {
      preferredCarrierId: selectedCarrierId,
      deliveryAddress,
    });
    setShippingSavedToast(
      `Saved default shipping address (${deliveryAddress.province}) & carrier (${selectedCarrier.name})!`
    );
    setTimeout(() => setShippingSavedToast(null), 3500);
  };

  // Cart operations
  const addToCart = (sku: string, openPopup = false) => {
    setCart((prev) => ({
      ...prev,
      [sku]: (prev[sku] || 0) + 1,
    }));
    if (openPopup) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (sku: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[sku] > 1) {
        copy[sku] -= 1;
      } else {
        delete copy[sku];
      }
      return copy;
    });
  };

  const deleteFromCart = (sku: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[sku];
      return copy;
    });
  };

  const clearCart = () => setCart({});

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const cartDetails = Object.entries(cart)
    .map(([sku, qty]) => {
      const prod = products.find((p) => p.sku === sku);
      if (!prod) return null;
      return {
        product: prod,
        quantity: qty,
        subtotal: prod.priceLak * qty,
        poolTotal: prod.commissionPoolLak * qty,
      };
    })
    .filter(Boolean) as {
    product: ProductSKU;
    quantity: number;
    subtotal: number;
    poolTotal: number;
  }[];

  const cartSubtotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCommissionPoolTotal = cartDetails.reduce((sum, item) => sum + item.poolTotal, 0);
  const hasPhysical = cartDetails.some((item) => item.product.itemType === 'PHYSICAL');
  const shippingFee = hasPhysical ? selectedCarrier.baseFeeLak : 0;
  const cartTotal = cartSubtotal + shippingFee;

  // Instant Buy for Music Package or any SKU -> Opens Pop-Up Shopping Cart
  const handleInstantBuyProduct = (sku: string) => {
    setCart((prev) => ({
      ...prev,
      [sku]: Math.max(1, prev[sku] || 0),
    }));
    setIsCartOpen(true);
  };

  const isQrPaymentMethod =
    paymentMethod === 'BCEL_ONE' ||
    paymentMethod === 'LAO_QR' ||
    paymentMethod === 'BANK_TRANSFER';

  // Handle Checkout Action: open QR payment modal if QR method selected
  const handleStartPayment = async () => {
    if (cartDetails.length === 0) return;
    // Save member's selected shipping carrier and delivery address
    adminUpdateMember(currentMember.memberId, {
      preferredCarrierId: selectedCarrierId,
      deliveryAddress,
    });
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
      const created = await createOrder(
        items,
        paymentMethod,
        {
          recipientName: deliveryAddress.recipientName,
          phone: deliveryAddress.phone,
          province: deliveryAddress.province,
          district: deliveryAddress.district,
          village: deliveryAddress.village,
        },
        selectedCarrierId
      );
      setCart({});
      setIsCartOpen(false);
      setIsBankQrModalOpen(false);
      setCheckoutSuccessOrder(created);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const filteredProducts =
    activeCategory === 'ALL'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const featuredMusic = products.find((p) => p.sku === 'MUSIC_SINGLE_1600') || products[0];

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
    if (!isAdmin) return;
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
    setCoreEditSuccessNotice(
      `Core product MUSIC_SINGLE_1600 saved! Price: ${formatLak(
        Number(coreEditForm.priceLak)
      )}, Entitlement & Unilevel splits updated.`
    );
    setTimeout(() => setCoreEditSuccessNotice(null), 6000);
  };

  return (
    <div className="@container space-y-5 pb-16 animate-in fade-in">
      {/* 1. TOP HEADER & SHOPPING CART BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div>
          <h2 className="text-lg @lg:text-xl font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{t.catalogScreenTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.catalogScreenSub}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsShippingGuideOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Shipping Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
            <span>
              {t.cart} ({cartItemCount})
            </span>
            {cartItemCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-[10px]">
                {formatLakCompact(cartTotal)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. MEMBER SELF-SERVICE SHIPPING SELECTION BAR (User Member Can Select Shipping By Themselves) */}
      <div className="rounded-2xl bg-slate-900/95 border border-amber-500/40 p-4 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-1.5">
                <span>Select Your Shipping Carrier (ເລືອກບໍລິສັດຂົນສົ່ງດ້ວຍຕົນເອງ)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Delivering to:{' '}
                <strong className="text-amber-300">{deliveryAddress.province}</strong> •{' '}
                <span className="font-mono text-emerald-400">
                  {selectedCarrier.name} ({formatLak(selectedCarrier.baseFeeLak)})
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Edit Delivery Address</span>
          </button>
        </div>

        {/* 3 Interactive Shipping Carrier Cards */}
        <div className="grid grid-cols-1 @xl:grid-cols-3 gap-2.5">
          {LAO_SHIPPING_CARRIERS.map((carrier) => {
            const isSelected = selectedCarrierId === carrier.id;
            return (
              <button
                key={carrier.id}
                type="button"
                onClick={() => handleMemberSelectCarrier(carrier.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-md ring-1 ring-amber-400/50'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: carrier.logoColor }}
                    />
                    <span className="font-extrabold text-xs text-white truncate">
                      {carrier.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-200/90 font-medium truncate mt-0.5">
                    {carrier.nameLao}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {carrier.estimatedDays}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="font-mono font-bold text-amber-300">
                      {formatLak(carrier.baseFeeLak)}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-amber-400 border-amber-300 text-slate-950'
                      : 'border-slate-700 bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {shippingSavedToast && (
          <div className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{shippingSavedToast}</span>
            </span>
            <button
              type="button"
              onClick={() => setShippingSavedToast(null)}
              className="text-emerald-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* NOTICES */}
      {coreEditSuccessNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Core Product Updated</div>
              <p className="text-slate-300 mt-0.5">{coreEditSuccessNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setCoreEditSuccessNotice(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {checkoutSuccessOrder && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500/50 text-emerald-200 text-xs flex items-start justify-between gap-3 shadow-xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <div className="font-black text-sm text-white">
                Order Confirmed & Dispatched! (Order ID: {checkoutSuccessOrder.id})
              </div>
              <p className="text-slate-200 leading-relaxed">
                Total Settled: <strong className="text-amber-300">{formatLak(checkoutSuccessOrder.totalLak)}</strong> via{' '}
                <strong>{checkoutSuccessOrder.paymentMethod}</strong>. Unilevel commissions have been credited atomically.
              </p>
              {checkoutSuccessOrder.items.some((i) => i.sku === 'MUSIC_SINGLE_1600') && (
                <div className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.qualifiedCongratulations}</span>
                </div>
              )}
              {checkoutSuccessOrder.carrierName && (
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>
                      Shipping Carrier:{' '}
                      <strong className="text-white">{checkoutSuccessOrder.carrierName}</strong>
                    </span>
                  </div>
                  {checkoutSuccessOrder.trackingNumber && (
                    <span className="font-mono text-amber-300 font-bold text-xs">
                      Waybill: {checkoutSuccessOrder.trackingNumber}
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

      {/* 3. FEATURED CORE PRODUCT: MUSIC_SINGLE_1600 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 border-2 border-amber-500/50 p-5 shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 @3xl:grid-cols-12 gap-5 items-center">
          <div className="@3xl:col-span-7 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                {t.officialCorePackageBadge}
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold">
                MUSIC_SINGLE_1600
              </span>
            </div>

            <div>
              <h3 className="text-lg @lg:text-2xl font-black text-white tracking-tight leading-snug">
                {getLocalizedProduct(featuredMusic, language).title}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {getLocalizedProduct(featuredMusic, language).description}
              </p>
            </div>

            {/* Candidate Split Disclosure */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2 text-xs">
              <div className="font-semibold text-amber-300 flex items-center justify-between gap-2">
                <span>{t.commissionSplitDisclosure}</span>
                <span className="font-mono font-black text-white">
                  {formatLak(featuredMusic.priceLak)}
                </span>
              </div>
              <div className="grid grid-cols-2 @lg:grid-cols-4 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-sans">DMC Studio</div>
                  <div className="font-bold text-slate-200 text-[11px] mt-0.5">
                    {formatLakCompact(featuredMusic.splitRule.dmcBudget || 900000)}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-sans">L1 Direct</div>
                  <div className="font-bold text-amber-300 text-[11px] mt-0.5">
                    {formatLakCompact(featuredMusic.splitRule.l1Share || 400000)}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-sans">L2 Second</div>
                  <div className="font-bold text-amber-300 text-[11px] mt-0.5">
                    {formatLakCompact(featuredMusic.splitRule.l2Share || 200000)}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-sans">L3 Third</div>
                  <div className="font-bold text-amber-300 text-[11px] mt-0.5">
                    {formatLakCompact(featuredMusic.splitRule.l3Share || 100000)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleInstantBuyProduct('MUSIC_SINGLE_1600')}
                className="flex-1 min-w-[180px] px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current shrink-0" />
                <span>
                  {t.buyMusicNow} ({formatLakCompact(featuredMusic.priceLak)})
                </span>
              </button>

              <button
                type="button"
                onClick={() => addToCart('MUSIC_SINGLE_1600', true)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.addToCart}</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenCoreEdit}
                  className="px-3.5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.editCoreProduct}</span>
                </button>
              )}
            </div>
          </div>

          <div className="@3xl:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-amber-500/30 aspect-video shadow-2xl">
              <img
                src={featuredMusic.imageUrl}
                alt="DMC Recording Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-3.5">
                <div className="text-xs text-white">
                  <span className="font-bold block">DMC Central Studio, Vientiane</span>
                  <span className="text-[11px] text-amber-400">
                    Professional Studio Console & Live Acoustic Room
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CATEGORY FILTER TABS (Clean Wrap, Zero Ugly Scrollbar) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        {[
          { id: 'ALL', label: t.catAll },
          { id: 'GUITAR', label: t.catGuitar },
          { id: 'AUDIO_GEAR', label: t.catAudio },
          { id: 'ACCESSORY', label: t.catAccessory },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-2 rounded-lg font-bold transition-colors cursor-pointer flex-1 min-w-[110px] text-center ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 5. PROFESSIONAL PRODUCT CATALOG CARDS (Container-Responsive: 1 Column on Mobile Frame, 2-3 Columns on Expanded Desktop) */}
      <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
        {filteredProducts
          .filter((p) => p.sku !== 'MUSIC_SINGLE_1600')
          .map((product) => {
            const inCartQty = cart[product.sku] || 0;
            const locProd = getLocalizedProduct(product, language);
            return (
              <div
                key={product.sku}
                className="rounded-2xl bg-slate-900/95 border border-slate-800 hover:border-amber-500/50 transition-all overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Product Image Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img
                      src={product.imageUrl}
                      alt={locProd.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30" />

                    {/* Top Left Category & SKU */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                        {locProd.categoryBadge}
                      </span>
                    </div>

                    {/* Top Right Stock Count */}
                    <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-emerald-300 border border-slate-700">
                      {t.stockLabel}: {product.stockSellable}
                    </div>

                    {/* Bottom Left SKU & Price */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-300 uppercase">
                        {product.sku}
                      </span>
                      <span className="text-lg font-black text-white font-mono drop-shadow">
                        {formatLak(product.priceLak)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-black text-base text-white leading-snug">
                        {locProd.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {locProd.description}
                      </p>
                    </div>

                    {/* Member Self-Service Shipping Badge on Card */}
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="truncate">
                          <span className="text-slate-400 text-[11px]">Shipping: </span>
                          <strong className="text-white">{selectedCarrier.name}</strong>
                          <span className="text-emerald-400 font-mono text-[11px] ml-1">
                            (+{formatLakCompact(selectedCarrier.baseFeeLak)})
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx =
                            (LAO_SHIPPING_CARRIERS.findIndex((c) => c.id === selectedCarrierId) +
                              1) %
                            LAO_SHIPPING_CARRIERS.length;
                          handleMemberSelectCarrier(LAO_SHIPPING_CARRIERS[nextIdx].id);
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] shrink-0 cursor-pointer border border-slate-700"
                        title="Click to switch Shipping Carrier"
                      >
                        Switch Carrier ↻
                      </button>
                    </div>

                    {/* Unilevel Commission Pool Info */}
                    <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-1">
                      <div className="flex justify-between items-center text-slate-200">
                        <span className="font-semibold">{t.poolLabel} (50/30/20):</span>
                        <span className="font-mono font-bold text-amber-300">
                          {formatLak(product.commissionPoolLak)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        L1: {formatLakCompact(Math.round(product.commissionPoolLak * 0.5))} • L2:{' '}
                        {formatLakCompact(Math.round(product.commissionPoolLak * 0.3))} • L3:{' '}
                        {formatLakCompact(Math.round(product.commissionPoolLak * 0.2))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action Buttons (Full Width, Never Clipped) */}
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  {inCartQty > 0 ? (
                    <>
                      <div className="flex items-center gap-1.5 bg-slate-950 border border-amber-500/40 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.sku)}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-black text-amber-300 px-2.5">
                          {inCartQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(product.sku, false)}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsCartOpen(true)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Open Cart & Shipping</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => addToCart(product.sku, true)}
                        className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                        <span>{t.addToCart}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInstantBuyProduct(product.sku)}
                        className="py-2.5 px-3.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Buy QR</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* FLOATING STICKY SHOPPING CART BAR WHEN CART HAS ITEMS */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="sticky bottom-3 z-30 bg-gradient-to-r from-[#6B0816] via-[#4E0510] to-slate-950 border-2 border-amber-400 rounded-2xl p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow">
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white truncate">
                {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'} • {selectedCarrier.name}
              </div>
              <div className="text-xs font-mono font-bold text-amber-300">
                Total: {formatLak(cartTotal)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
          >
            <span>Open Shopping Cart</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6. RECENT ORDERS & SHIPPING TRACKING HISTORY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>{t.orderHistoryTitle}</span>
          </h3>
          <button
            type="button"
            onClick={() => setIsShippingGuideOpen(true)}
            className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
          >
            Track Waybill →
          </button>
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2.5 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300">{order.id}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">{order.paymentMethod}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    order.status === 'DELIVERED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : order.status === 'SHIPPED'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.orderLineId} className="flex justify-between text-slate-200">
                    <span>
                      {item.quantity}x {item.title}
                    </span>
                    <span className="font-mono font-semibold">{formatLak(item.totalLak)}</span>
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                  <span>
                    Carrier: <strong className="text-white">{order.carrierName}</strong>
                  </span>
                  <span className="font-mono text-amber-300">
                    Tracking: <strong>{order.trackingNumber}</strong>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          PROFESSIONAL POP-UP SHOPPING CART & SELF-SERVICE SHIPPING MODAL
         ===================================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border-2 border-[#C5A059] rounded-3xl max-w-2xl w-full text-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[94vh] my-auto">
            {/* 1. LUXURY HERITAGE HEADER */}
            <div className="bg-gradient-to-r from-[#6B0816] via-[#4E0510] to-[#36030A] px-5 py-4 border-b-2 border-[#C5A059] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <DmcOfficialLogo size={42} rounded="full" withGoldRing={true} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#F9E498] tracking-wide truncate">
                      DMC Shopping Cart & Shipping
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#E5C158] text-[#36030A] font-mono font-black text-[11px] shrink-0">
                      {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-100/85 truncate">
                    Member: <strong>{currentMember.name}</strong> ({currentMember.memberId}) • Self-Service Lao Logistics
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-amber-100 hover:text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close Shopping Cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. SCROLLABLE CART & SHIPPING BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* SECTION A: SHOPPING CART ITEMS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>1. Selected Products in Your Cart</span>
                  </h4>
                  {cartDetails.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear Cart</span>
                    </button>
                  )}
                </div>

                {cartDetails.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
                    <ShoppingCart className="w-10 h-10 text-amber-400/60 mx-auto" />
                    <div>
                      <div className="text-sm font-bold text-white">Your Shopping Cart is Empty</div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Select any product below to add it to your cart and choose your shipping carrier.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cartDetails.map((item) => {
                      const loc = getLocalizedProduct(item.product, language);
                      return (
                        <div
                          key={item.product.sku}
                          className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.product.imageUrl}
                              alt={loc.title}
                              className="w-14 h-14 rounded-xl object-cover border border-amber-500/40 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono font-bold text-amber-400">
                                  {item.product.sku}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">
                                  {item.product.itemType === 'PHYSICAL'
                                    ? 'Physical Parcel'
                                    : 'Studio Service'}
                                </span>
                              </div>
                              <div className="font-bold text-xs sm:text-sm text-white truncate">
                                {loc.title}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {formatLak(item.product.priceLak)} each
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                            {/* Quantity Stepper */}
                            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1">
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.sku)}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-mono font-black text-xs text-amber-300 px-2.5">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => addToCart(item.product.sku, false)}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right min-w-[105px]">
                              <div className="font-mono font-black text-xs sm:text-sm text-amber-300">
                                {formatLak(item.subtotal)}
                              </div>
                              <div className="text-[10px] font-mono text-emerald-400">
                                Pool: {formatLakCompact(item.poolTotal)}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteFromCart(item.product.sku)}
                              className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Quick Add Products Strip inside Cart Modal */}
                <div className="pt-1">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                    + Quick Add Products to Cart:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {products.map((p) => {
                      const inCart = cart[p.sku] || 0;
                      return (
                        <button
                          key={p.sku}
                          type="button"
                          onClick={() => addToCart(p.sku, false)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            inCart > 0
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                              : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200'
                          }`}
                        >
                          <Plus className="w-3 h-3 text-amber-400" />
                          <span className="truncate max-w-[160px]">
                            {getLocalizedProduct(p, language).title}
                          </span>
                          <span className="font-mono text-[10px] text-amber-300">
                            ({formatLakCompact(p.priceLak)})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION B: USER MEMBER SELF-SERVICE SHIPPING SELECTION */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-400" />
                      <span>2. Select Shipping By Yourself (ເລືອກຂົນສົ່ງດ້ວຍຕົນເອງ)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Choose your preferred Lao express courier and provincial destination
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs">
                    {hasPhysical
                      ? `Shipping Fee: ${formatLak(shippingFee)}`
                      : '0 LAK (Studio Package)'}
                  </span>
                </div>

                {/* 3 Carrier Radio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {LAO_SHIPPING_CARRIERS.map((carrier) => {
                    const isSelected = selectedCarrierId === carrier.id;
                    return (
                      <button
                        key={carrier.id}
                        type="button"
                        onClick={() => handleMemberSelectCarrier(carrier.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="flex items-center gap-1.5 font-extrabold text-xs text-white">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: carrier.logoColor }}
                              />
                              <span className="truncate">{carrier.name}</span>
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-amber-200/90 font-medium">
                            {carrier.nameLao}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                            {carrier.badge}
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-emerald-400">
                            {carrier.estimatedDays}
                          </span>
                          <span className="font-mono font-black text-amber-300 text-xs">
                            {hasPhysical ? formatLak(carrier.baseFeeLak) : '0 LAK'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Recipient & 18 Lao Provinces Delivery Form */}
                <div className="pt-2 border-t border-slate-800/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Delivery Recipient & Destination (18 Provinces of Lao PDR)</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveMemberDeliveryProfile}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] cursor-pointer"
                    >
                      Save as My Default Shipping
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Recipient Full Name (ຊື່ຜູ້ຮັບສິນຄ້າ) *
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={deliveryAddress.recipientName}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              recipientName: e.target.value,
                            })
                          }
                          placeholder="Recipient Name"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Mobile Phone (+856 20 ...) *
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={deliveryAddress.phone}
                          onChange={(e) =>
                            setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })
                          }
                          placeholder="+856 20 ..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Province (ແຂວງ / 18 Provinces) *
                      </label>
                      <select
                        value={deliveryAddress.province}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, province: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:border-amber-400 outline-none"
                      >
                        {LAO_18_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        District (ເມືອງ / District) *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.district}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, district: e.target.value })
                        }
                        placeholder="e.g. Chanthabouly"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Village / Branch (ບ້ານ / ສາຂາຂົນສົ່ງ) *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.village}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, village: e.target.value })
                        }
                        placeholder="e.g. Ban Sihom / Branch"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Shipping Branch / Delivery Note (ໝາຍເຫດການຈັດສົ່ງ)
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.note}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, note: e.target.value })
                      }
                      placeholder="e.g. Send to Anousith Dongdok Branch or Door-to-Door delivery"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: PAYMENT METHOD & ORDER TOTAL SUMMARY */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3.5 text-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>3. Payment Method & Order Summary</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'BCEL_ONE', label: 'BCEL One QR' },
                    { id: 'LAO_QR', label: 'Lao QR (All Banks)' },
                    { id: 'BANK_TRANSFER', label: 'Bank Transfer' },
                    { id: 'CREDIT_CARD', label: 'Visa / Master' },
                  ].map((meth) => (
                    <button
                      key={meth.id}
                      type="button"
                      onClick={() => setPaymentMethod(meth.id as Order['paymentMethod'])}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === meth.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{meth.label}</span>
                      {paymentMethod === meth.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Breakdown Lines */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Items Subtotal ({cartItemCount} items):</span>
                    <span className="font-mono font-semibold">{formatLak(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>
                      Shipping ({selectedCarrier.name} — {selectedCarrier.estimatedDays}):
                    </span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {hasPhysical ? formatLak(shippingFee) : '0 LAK (Studio Service)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Unilevel Sponsor Commission Pool (L1/L2/L3):</span>
                    <span className="font-mono text-amber-300">
                      {formatLak(cartCommissionPoolTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline font-black text-base text-white pt-2 border-t border-slate-800">
                    <span>Grand Total Due:</span>
                    <span className="font-mono text-lg text-amber-300">
                      {formatLak(cartTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MODAL FOOTER CTA */}
            <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
              >
                ← Continue Shopping
              </button>

              <button
                type="button"
                disabled={cartDetails.length === 0 || isProcessingPayment}
                onClick={handleStartPayment}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isProcessingPayment ? (
                  <span>Processing Order...</span>
                ) : isQrPaymentMethod ? (
                  <>
                    <QrCode className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm Shipping & Pay QR ({formatLak(cartTotal)})</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm Order & Pay ({formatLak(cartTotal)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAO SHIPPING CARRIERS & LIVE WAYBILL TRACKING GUIDE MODAL */}
      <LaoShippingCarrierModal
        isOpen={isShippingGuideOpen}
        onClose={() => setIsShippingGuideOpen(false)}
        initialCarrierId={selectedCarrierId}
      />

      {/* LAO BANK QR PAYMENT MODAL */}
      <BankQrPaymentModal
        isOpen={isBankQrModalOpen}
        onClose={() => setIsBankQrModalOpen(false)}
        amountLak={cartTotal}
        purpose="ORDER_CHECKOUT"
        title={
          paymentMethod === 'BCEL_ONE'
            ? 'BCEL OnePay QR Checkout'
            : 'Lao QR Universal Settlement'
        }
        description={`Carrier: ${selectedCarrier.name} (${deliveryAddress.province}) • Total: ${formatLak(
          cartTotal
        )}`}
        onPaymentSuccess={(details) => {
          executeFinalizeOrder(details.reference);
        }}
      />

      {/* ================= EDIT CORE PRODUCT (MUSIC_SINGLE_1600) MODAL (ADMIN ONLY) ================= */}
      {isAdmin && isEditingCoreProduct && (
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
                      onChange={(num) => setCoreEditForm({ ...coreEditForm, priceLak: num })}
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
                      onChange={(e) =>
                        setCoreEditForm({ ...coreEditForm, warehouseId: e.target.value })
                      }
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
                    onChange={(e) =>
                      setCoreEditForm({ ...coreEditForm, descriptionEn: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none leading-relaxed"
                  />
                </div>
              </div>

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
                      onChange={(e) =>
                        setCoreEditForm({ ...coreEditForm, titleEn: e.target.value })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">
                        Lao Title (ພາສາລາວ)
                      </label>
                      <input
                        type="text"
                        value={coreEditForm.titleLo}
                        onChange={(e) =>
                          setCoreEditForm({ ...coreEditForm, titleLo: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">
                        Thai Title (ไทย)
                      </label>
                      <input
                        type="text"
                        value={coreEditForm.titleTh}
                        onChange={(e) =>
                          setCoreEditForm({ ...coreEditForm, titleTh: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    3. Candidate Allocation & Unilevel Split (Rev 2.6)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">
                      DMC Studio Budget
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={coreEditForm.dmcBudget}
                      onChange={(e) =>
                        setCoreEditForm({ ...coreEditForm, dmcBudget: Number(e.target.value) })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold text-xs"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <label className="text-[10px] text-amber-400 block font-semibold">
                      L1 Direct Share
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={coreEditForm.l1Share}
                      onChange={(e) =>
                        setCoreEditForm({ ...coreEditForm, l1Share: Number(e.target.value) })
                      }
                      className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-2 text-amber-300 font-mono font-bold text-xs"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <label className="text-[10px] text-amber-400 block font-semibold">
                      L2 Second Share
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={coreEditForm.l2Share}
                      onChange={(e) =>
                        setCoreEditForm({ ...coreEditForm, l2Share: Number(e.target.value) })
                      }
                      className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-2 text-amber-300 font-mono font-bold text-xs"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <label className="text-[10px] text-amber-400 block font-semibold">
                      L3 Third Share
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={coreEditForm.l3Share}
                      onChange={(e) =>
                        setCoreEditForm({ ...coreEditForm, l3Share: Number(e.target.value) })
                      }
                      className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-2 text-amber-300 font-mono font-bold text-xs"
                    />
                  </div>
                </div>
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
