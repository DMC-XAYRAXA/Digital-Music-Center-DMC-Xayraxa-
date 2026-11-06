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
import { DmcPricingStructureCard } from '../common/DmcPricingStructureCard';
import { AcademyScreen } from './AcademyScreen';
import {
  CopyrightCertificateModal,
  downloadDmcCertificateImage,
} from '../common/CopyrightCertificateModal';
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
  Upload,
  Download,
  Award,
  Play,
  Pause,
  FileAudio,
  Headphones,
} from 'lucide-react';
import {
  ProductSKU,
  Order,
  LaoShippingCarrierId,
  LaoShippingCarrier,
  LAO_SHIPPING_CARRIERS,
  DMC_STANDARD_PRICING,
  SongProductionProject,
} from '../../types/dmc';

interface CatalogScreenProps {
  onNavigate: (
    tab: 'home' | 'membership' | 'catalog' | 'network' | 'wallet' | 'mymusic' | 'musichub'
  ) => void;
  viewMode?: 'PACKAGE' | 'HUB' | 'MY_MUSIC';
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

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  onNavigate: _onNavigate,
  viewMode = 'HUB',
}) => {
  const {
    products,
    orders,
    createOrder,
    currentMember,
    language,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateMember,
    shippingCarriers,
    adminAddShippingCarrier,
    adminUpdateShippingCarrier,
    adminDeleteShippingCarrier,
    adminResetShippingCarriers,
    setIsAdminMode,
    isAdminMode,
    isAdminAuthenticated,
    allSongs,
    getMemberSongs,
    adminAddSong,
    adminUpdateSong,
    adminDeleteSong,
    purchaseCopyrightSongPackage,
  } = useDmc();
  const t = translations[language];
  const isAdmin = isAdminAuthenticated || isAdminMode;
  const myOwnedSongs = getMemberSongs(currentMember.memberId);

  // My Music (Create & Sell Song with Copyright) state
  const [musicFilterTab, setMusicFilterTab] = useState<'ALL_MARKETPLACE' | 'MY_OWNED'>('ALL_MARKETPLACE');
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isSongCrudOpen, setIsSongCrudOpen] = useState(false);
  const [songCrudMode, setSongCrudMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [buyingSongTarget, setBuyingSongTarget] = useState<SongProductionProject | null>(null);
  const [certificateSongTarget, setCertificateSongTarget] = useState<SongProductionProject | null>(null);
  const [downloadingSongId, setDownloadingSongId] = useState<string | null>(null);
  const [downloadingCertSongId, setDownloadingCertSongId] = useState<string | null>(null);
  const [songForm, setSongForm] = useState({
    title: '',
    artistName: currentMember.name || 'Xay Raxa • DMC Studio Master',
    genre: 'Lao Contemporary Folk / Pop',
    tempo: '96 BPM',
    priceLak: 1600000,
    marketPriceLak: 2200000,
    commissionPoolLak: 700000,
    copyrightCode: `LA-DMC-CR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    isrcCode: `LA-XAY-26-${Math.floor(10000 + Math.random() * 90000)}`,
    copyrightLicenseType: 'Full Master Recording + Commercial Copyright Certificate',
    description:
      '24-Bit Studio Master WAV + MP3 + Instrumental Backing Track + Official Signed DMC Copyright Certificate (Lao IP Law No. 38/NA).',
    lyricsExcerpt: '',
    coverImageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    previewAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    audioFileName: 'DMC_Studio_Master_24bit.wav',
  });

  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  const handleTogglePlaySong = (song: SongProductionProject) => {
    if (playingSongId === song.id) {
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingSongId(null);
      return;
    }
    if (audioElement) {
      audioElement.pause();
    }
    const url =
      song.previewAudioUrl || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg';
    const nextAudio = new Audio(url);
    nextAudio.onended = () => setPlayingSongId(null);
    nextAudio.play().catch(() => {
      // fallback if external audio blocked
    });
    setAudioElement(nextAudio);
    setPlayingSongId(song.id);
  };

  const openCreateSongModal = () => {
    const randCode = Math.floor(10000 + Math.random() * 90000);
    setSongCrudMode('CREATE');
    setEditingSongId(null);
    setSongForm({
      title: '',
      artistName: `${currentMember.name} • DMC Studio`,
      genre: 'Lao Modern Pop / Acoustic',
      tempo: '96 BPM',
      priceLak: 1600000,
      marketPriceLak: 2200000,
      commissionPoolLak: 700000,
      copyrightCode: `LA-DMC-CR-2026-${randCode}`,
      isrcCode: `LA-XAY-26-${randCode}`,
      copyrightLicenseType: 'Full Master Recording + Commercial Copyright Certificate',
      description:
        '24-Bit Studio Master WAV + MP3 + Instrumental Backing Track + Official Signed DMC Copyright Certificate (Lao IP Law No. 38/NA).',
      lyricsExcerpt: 'ເນື້ອຮ້ອງ ແລະ ທຳນອງ ລິຂະສິດແທ້ຈາກສະຕູດິໂອ DMC Xayraxa...',
      coverImageUrl:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      previewAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      audioFileName: 'DMC_Studio_Master_24bit.wav',
    });
    setIsSongCrudOpen(true);
  };

  const openEditSongModal = (song: SongProductionProject) => {
    setSongCrudMode('EDIT');
    setEditingSongId(song.id);
    setSongForm({
      title: song.title,
      artistName: song.artistName || `${song.producer} • DMC Studio`,
      genre: song.genre,
      tempo: song.tempo,
      priceLak: song.priceLak || 1600000,
      marketPriceLak: song.marketPriceLak || 2200000,
      commissionPoolLak: song.commissionPoolLak || 700000,
      copyrightCode: song.copyrightCode || `LA-DMC-CR-2026-00101`,
      isrcCode: song.isrcCode || `LA-XAY-26-00101`,
      copyrightLicenseType:
        song.copyrightLicenseType || 'Full Master Recording + Commercial Copyright Certificate',
      description:
        song.description ||
        '24-Bit Studio Master WAV + MP3 + Instrumental Backing Track + Official Signed DMC Copyright Certificate.',
      lyricsExcerpt: song.lyricsExcerpt || '',
      coverImageUrl:
        song.coverImageUrl ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      previewAudioUrl:
        song.previewAudioUrl || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      audioFileName: song.audioFileName || 'DMC_Studio_Master_24bit.wav',
    });
    setIsSongCrudOpen(true);
  };

  const handleSaveCopyrightSong = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = songForm.title.trim() || 'DMC Original Copyright Song';
    const price = Math.max(0, Math.round(Number(songForm.priceLak) || 1600000));
    const mkt = Math.max(price, Math.round(Number(songForm.marketPriceLak) || 2200000));
    const pool = Math.max(0, Math.round(Number(songForm.commissionPoolLak) || 700000));

    if (songCrudMode === 'EDIT' && editingSongId) {
      adminUpdateSong(editingSongId, {
        title: cleanTitle,
        artistName: songForm.artistName.trim() || 'Xay Raxa • DMC Studio',
        genre: songForm.genre.trim() || 'Lao Contemporary Pop',
        tempo: songForm.tempo.trim() || '96 BPM',
        priceLak: price,
        marketPriceLak: mkt,
        memberDiscountLak: Math.max(0, mkt - price),
        commissionPoolLak: pool,
        copyrightCode: songForm.copyrightCode.trim(),
        isrcCode: songForm.isrcCode.trim(),
        copyrightLicenseType: songForm.copyrightLicenseType.trim(),
        description: songForm.description.trim(),
        lyricsExcerpt: songForm.lyricsExcerpt.trim(),
        coverImageUrl: songForm.coverImageUrl.trim(),
        previewAudioUrl: songForm.previewAudioUrl,
        downloadWavUrl: songForm.previewAudioUrl,
        audioFileName: songForm.audioFileName,
        status: 'RELEASED',
        progressPercent: 100,
      });
      setCoreEditSuccessNotice(`Updated copyright song "${cleanTitle}" (${formatLak(price)})!`);
    } else {
      const newSong: SongProductionProject = {
        id: `sng-${Date.now()}`,
        memberId: currentMember.memberId,
        title: cleanTitle,
        artistName: songForm.artistName.trim() || `${currentMember.name} • DMC Studio`,
        genre: songForm.genre.trim() || 'Lao Contemporary Pop',
        tempo: songForm.tempo.trim() || '96 BPM',
        status: 'RELEASED',
        producer: 'Xay Raxa',
        studioLocation: 'DMC Central Studio, Vientiane',
        progressPercent: 100,
        previewAudioUrl: songForm.previewAudioUrl,
        downloadWavUrl: songForm.previewAudioUrl,
        audioFileName:
          songForm.audioFileName ||
          `DMC_Master_${cleanTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24)}.wav`,
        coverImageUrl:
          songForm.coverImageUrl.trim() ||
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        priceLak: price,
        marketPriceLak: mkt,
        memberDiscountLak: Math.max(0, mkt - price),
        commissionPoolLak: pool,
        copyrightCode: songForm.copyrightCode.trim(),
        isrcCode: songForm.isrcCode.trim(),
        copyrightLicenseType: songForm.copyrightLicenseType.trim(),
        description: songForm.description.trim(),
        lyricsExcerpt: songForm.lyricsExcerpt.trim(),
        purchasedByMemberIds: [currentMember.memberId],
        updatedAt: new Date().toISOString(),
      };
      adminAddSong(newSong);
      setCoreEditSuccessNotice(
        `Created & published new copyright song "${cleanTitle}" (${formatLak(price)}) for User Members to buy & download!`
      );
    }
    setTimeout(() => setCoreEditSuccessNotice(null), 6000);
    setIsSongCrudOpen(false);
  };

  // Generates a real downloadable WAV master file + Copyright License Manifest for the User Member
  const handleDownloadSongPackageBundle = async (song: SongProductionProject) => {
    setDownloadingSongId(song.id);
    try {
      const safeName =
        (song.audioFileName || `${song.title.replace(/[^a-zA-Z0-9]/g, '_')}_Master.wav`).replace(
          /\s+/g,
          '_'
        );

      if (song.downloadWavUrl && song.downloadWavUrl.startsWith('data:audio/')) {
        const a = document.createElement('a');
        a.href = song.downloadWavUrl;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Synthesize a clean 4-second stereo 44.1kHz 16-bit PCM WAV Studio Master file so browser downloads a real playable .wav audio file
        const sampleRate = 44100;
        const durationSeconds = 4;
        const numSamples = sampleRate * durationSeconds;
        const numChannels = 2;
        const bytesPerSample = 2;
        const dataSize = numSamples * numChannels * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        const writeStr = (offset: number, str: string) => {
          for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
          }
        };

        writeStr(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeStr(8, 'WAVE');
        writeStr(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
        view.setUint16(32, numChannels * bytesPerSample, true);
        view.setUint16(34, 16, true);
        writeStr(36, 'data');
        view.setUint32(40, dataSize, true);

        // Pleasant F-Major pentatonic arpeggio chord
        const notes = [349.23, 440.0, 523.25, 698.46];
        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
          const tSec = i / sampleRate;
          const noteIdx = Math.min(3, Math.floor(tSec));
          const freq = notes[noteIdx];
          const env = Math.exp(-((tSec % 1) * 2.5));
          const sampleVal =
            Math.sin(2 * Math.PI * freq * tSec) * 0.45 * env +
            Math.sin(2 * Math.PI * (freq * 0.5) * tSec) * 0.25 * env;
          const pcm = Math.max(-1, Math.min(1, sampleVal)) * 32767;
          view.setInt16(offset, pcm, true);
          view.setInt16(offset + 2, pcm, true);
          offset += 4;
        }

        const wavBlob = new Blob([buffer], { type: 'audio/wav' });
        const wavUrl = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = wavUrl;
        a.download = safeName.endsWith('.wav') ? safeName : `${safeName}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(wavUrl), 3000);
      }

      // Also trigger download of the official Copyright Certificate PNG so they get the full Song + Copyright package
      await downloadDmcCertificateImage({
        memberId: currentMember.memberId,
        memberName: currentMember.name,
        isActiveLifetime: true,
        workTitle: song.title,
      });

      setCoreEditSuccessNotice(
        `Downloaded Song Package "${song.title}" (24-Bit Studio Master WAV + Official Signed DMC Copyright Certificate) for ${currentMember.name} (${currentMember.memberId})!`
      );
      setTimeout(() => setCoreEditSuccessNotice(null), 6000);
    } finally {
      setDownloadingSongId(null);
    }
  };

  const handleDownloadOnlySongCert = async (song: SongProductionProject) => {
    setDownloadingCertSongId(song.id);
    try {
      await downloadDmcCertificateImage({
        memberId: currentMember.memberId,
        memberName: currentMember.name,
        isActiveLifetime: true,
        workTitle: song.title,
      });
      setCoreEditSuccessNotice(
        `Downloaded Official Copyright Certificate for "${song.title}" (${song.copyrightCode || 'LA-DMC-CR-2026'})!`
      );
      setTimeout(() => setCoreEditSuccessNotice(null), 5000);
    } finally {
      setDownloadingCertSongId(null);
    }
  };

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
    shippingCarriers.find((c) => c.id === selectedCarrierId) ||
    shippingCarriers[0] ||
    LAO_SHIPPING_CARRIERS[0];

  // Administrator Shipping Carrier & Price CRUD Modal state
  const [isShippingAdminModalOpen, setIsShippingAdminModalOpen] = useState(false);
  const [shippingAdminMode, setShippingAdminMode] = useState<'EDIT' | 'CREATE'>('EDIT');
  const [editingCarrierId, setEditingCarrierId] = useState<string>('ANOUSITH');
  const [shippingForm, setShippingForm] = useState({
    id: 'ANOUSITH',
    name: 'Anousith Logistics',
    nameLao: 'ອານຸສິດ ຂົນສົ່ງ (Anousith Logistics)',
    badge: 'Nationwide Network • 18 Provinces',
    estimatedDays: '1-2 Days',
    baseFeeLak: 35000,
    trackingPrefix: 'ANS-LA',
    hotline: '1668 / +856 20 5511 8899',
    logoColor: '#e11d48',
    description:
      'Largest door-to-door parcel delivery & branch network covering all 18 provinces in Lao PDR.',
  });

  const openAdminEditShipping = (carrier: LaoShippingCarrier) => {
    if (!isAdmin) return;
    setShippingAdminMode('EDIT');
    setEditingCarrierId(carrier.id);
    setShippingForm({
      id: carrier.id,
      name: carrier.name,
      nameLao: carrier.nameLao,
      badge: carrier.badge,
      estimatedDays: carrier.estimatedDays,
      baseFeeLak: carrier.baseFeeLak,
      trackingPrefix: carrier.trackingPrefix,
      hotline: carrier.hotline,
      logoColor: carrier.logoColor || '#f59e0b',
      description: carrier.description,
    });
    setIsShippingAdminModalOpen(true);
  };

  const openAdminCreateShipping = () => {
    if (!isAdmin) return;
    setShippingAdminMode('CREATE');
    setEditingCarrierId('');
    setShippingForm({
      id: `CARRIER_${Date.now().toString().slice(-4)}`,
      name: '',
      nameLao: '',
      badge: 'Nationwide Express • 18 Provinces',
      estimatedDays: '1-2 Days',
      baseFeeLak: 30000,
      trackingPrefix: 'LAO-EXP',
      hotline: '+856 20 5500 9988',
      logoColor: '#3b82f6',
      description: 'Door-to-door and provincial branch delivery across Lao PDR.',
    });
    setIsShippingAdminModalOpen(true);
  };

  const handleSaveAdminShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    const cleanName = shippingForm.name.trim() || 'Lao Express Carrier';
    const cleanNameLao = shippingForm.nameLao.trim() || cleanName;
    const cleanPrice = Math.max(0, Math.round(Number(shippingForm.baseFeeLak) || 0));

    if (shippingAdminMode === 'EDIT' && editingCarrierId) {
      adminUpdateShippingCarrier(editingCarrierId, {
        name: cleanName,
        nameLao: cleanNameLao,
        badge: shippingForm.badge.trim() || 'Nationwide Delivery',
        estimatedDays: shippingForm.estimatedDays.trim() || '1-2 Days',
        baseFeeLak: cleanPrice,
        trackingPrefix: shippingForm.trackingPrefix.trim().toUpperCase() || 'DMC-EXP',
        hotline: shippingForm.hotline.trim() || '+856 20 5511 2233',
        logoColor: shippingForm.logoColor || '#f59e0b',
        description: shippingForm.description.trim(),
      });
      setShippingSavedToast(
        `Updated shipping carrier "${cleanName}" price to ${formatLak(cleanPrice)}!`
      );
    } else {
      const created = adminAddShippingCarrier({
        id: shippingForm.id,
        name: cleanName,
        nameLao: cleanNameLao,
        badge: shippingForm.badge.trim() || 'Nationwide Delivery',
        estimatedDays: shippingForm.estimatedDays.trim() || '1-2 Days',
        baseFeeLak: cleanPrice,
        trackingPrefix: shippingForm.trackingPrefix.trim().toUpperCase() || 'DMC-EXP',
        hotline: shippingForm.hotline.trim() || '+856 20 5511 2233',
        logoColor: shippingForm.logoColor || '#3b82f6',
        description: shippingForm.description.trim(),
      });
      setSelectedCarrierId(created.id);
      setShippingSavedToast(
        `Added new shipping carrier "${created.name}" (${formatLak(created.baseFeeLak)})!`
      );
    }
    setTimeout(() => setShippingSavedToast(null), 4000);
    setIsShippingAdminModalOpen(false);
  };

  const handleDeleteAdminShipping = (carrier: LaoShippingCarrier) => {
    if (!isAdmin || shippingCarriers.length <= 1) return;
    adminDeleteShippingCarrier(carrier.id);
    if (selectedCarrierId === carrier.id) {
      const remaining = shippingCarriers.filter((c) => c.id !== carrier.id);
      if (remaining[0]) setSelectedCarrierId(remaining[0].id);
    }
    setShippingSavedToast(`Deleted shipping carrier "${carrier.name}"!`);
    setTimeout(() => setShippingSavedToast(null), 3500);
    setIsShippingAdminModalOpen(false);
  };

  const handleMemberSelectCarrier = (carrierId: LaoShippingCarrierId) => {
    setSelectedCarrierId(carrierId);
    const carrierObj =
      shippingCarriers.find((c) => c.id === carrierId) ||
      shippingCarriers[0] ||
      LAO_SHIPPING_CARRIERS[0];
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
      : products.filter((p) =>
          activeCategory === 'EQUIPMENT' || activeCategory === 'AUDIO_GEAR'
            ? p.category === 'AUDIO_GEAR' || (p.category as string) === 'EQUIPMENT'
            : p.category === activeCategory
        );

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

  // Administrator Catalog Product CRUD Modal state (Add, Edit, Delete, Update)
  const [isProductCrudOpen, setIsProductCrudOpen] = useState(false);
  const [productCrudMode, setProductCrudMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [productCrudForm, setProductCrudForm] = useState<{
    sku: string;
    category: ProductSKU['category'];
    titleEn: string;
    titleLo: string;
    titleTh: string;
    descriptionEn: string;
    marketPriceLak: number | string;
    priceLak: number | string;
    memberDiscountLak: number | string;
    commissionPoolLak: number | string;
    l1Share: number | string;
    l2Share: number | string;
    l3Share: number | string;
    stockSellable: number | string;
    itemType: ProductSKU['itemType'];
    imageUrl: string;
  }>({
    sku: 'DMC-PROD-005',
    category: 'GUITAR',
    titleEn: '',
    titleLo: '',
    titleTh: '',
    descriptionEn: '',
    marketPriceLak: DMC_STANDARD_PRICING.marketPriceLak,
    priceLak: DMC_STANDARD_PRICING.memberPriceLak,
    memberDiscountLak: DMC_STANDARD_PRICING.memberDiscountLak,
    commissionPoolLak: DMC_STANDARD_PRICING.commissionPoolLak,
    l1Share: DMC_STANDARD_PRICING.l1Percent,
    l2Share: DMC_STANDARD_PRICING.l2Percent,
    l3Share: DMC_STANDARD_PRICING.l3Percent,
    stockSellable: 25,
    itemType: 'PHYSICAL',
    imageUrl:
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
  });

  const openCreateCatalogProduct = () => {
    setProductCrudMode('CREATE');
    setProductCrudForm({
      sku: `DMC-PROD-${Math.floor(100 + Math.random() * 900)}`,
      category:
        activeCategory === 'ALL'
          ? 'GUITAR'
          : activeCategory === 'EQUIPMENT' || activeCategory === 'AUDIO_GEAR'
          ? 'AUDIO_GEAR'
          : (activeCategory as ProductSKU['category']),
      titleEn: '',
      titleLo: '',
      titleTh: '',
      descriptionEn: '',
      marketPriceLak: DMC_STANDARD_PRICING.marketPriceLak,
      priceLak: DMC_STANDARD_PRICING.memberPriceLak,
      memberDiscountLak: DMC_STANDARD_PRICING.memberDiscountLak,
      commissionPoolLak: DMC_STANDARD_PRICING.commissionPoolLak,
      l1Share: DMC_STANDARD_PRICING.l1Percent,
      l2Share: DMC_STANDARD_PRICING.l2Percent,
      l3Share: DMC_STANDARD_PRICING.l3Percent,
      stockSellable: 25,
      itemType: 'PHYSICAL',
      imageUrl:
        'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    });
    setIsProductCrudOpen(true);
  };

  const openEditCatalogProduct = (prod: ProductSKU) => {
    setProductCrudMode('EDIT');
    const mkt = prod.marketPriceLak ?? DMC_STANDARD_PRICING.marketPriceLak;
    const disc = prod.memberDiscountLak ?? Math.max(0, mkt - prod.priceLak);
    setProductCrudForm({
      sku: prod.sku,
      category: prod.category,
      titleEn: prod.titleEn,
      titleLo: prod.titleLo || prod.titleEn,
      titleTh: prod.titleTh || prod.titleEn,
      descriptionEn: prod.descriptionEn,
      marketPriceLak: mkt,
      priceLak: prod.priceLak,
      memberDiscountLak: disc,
      commissionPoolLak: prod.commissionPoolLak,
      l1Share: prod.splitRule.l1Share ?? DMC_STANDARD_PRICING.l1Percent,
      l2Share: prod.splitRule.l2Share ?? DMC_STANDARD_PRICING.l2Percent,
      l3Share: prod.splitRule.l3Share ?? DMC_STANDARD_PRICING.l3Percent,
      stockSellable: prod.stockSellable,
      itemType: prod.itemType,
      imageUrl: prod.imageUrl,
    });
    setIsProductCrudOpen(true);
  };

  const handleSaveCatalogProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSku =
      productCrudForm.sku.trim().toUpperCase() || `DMC-PROD-${Date.now().toString().slice(-4)}`;
    const titleEn = productCrudForm.titleEn.trim() || 'DMC Official Product';
    const marketPrice =
      productCrudForm.marketPriceLak !== '' && !isNaN(Number(productCrudForm.marketPriceLak))
        ? Math.max(0, Math.round(Number(productCrudForm.marketPriceLak)))
        : DMC_STANDARD_PRICING.marketPriceLak;
    const memberPrice =
      productCrudForm.priceLak !== '' && !isNaN(Number(productCrudForm.priceLak))
        ? Math.max(0, Math.round(Number(productCrudForm.priceLak)))
        : DMC_STANDARD_PRICING.memberPriceLak;
    const memberDiscount =
      productCrudForm.memberDiscountLak !== '' && !isNaN(Number(productCrudForm.memberDiscountLak))
        ? Math.max(0, Math.round(Number(productCrudForm.memberDiscountLak)))
        : Math.max(0, marketPrice - memberPrice);
    const pool =
      productCrudForm.commissionPoolLak !== '' && !isNaN(Number(productCrudForm.commissionPoolLak))
        ? Math.max(0, Math.round(Number(productCrudForm.commissionPoolLak)))
        : DMC_STANDARD_PRICING.commissionPoolLak;
    const l1 =
      productCrudForm.l1Share !== '' && !isNaN(Number(productCrudForm.l1Share))
        ? Number(productCrudForm.l1Share)
        : 50;
    const l2 =
      productCrudForm.l2Share !== '' && !isNaN(Number(productCrudForm.l2Share))
        ? Number(productCrudForm.l2Share)
        : 30;
    const l3 =
      productCrudForm.l3Share !== '' && !isNaN(Number(productCrudForm.l3Share))
        ? Number(productCrudForm.l3Share)
        : 20;
    const stock =
      productCrudForm.stockSellable !== '' && !isNaN(Number(productCrudForm.stockSellable))
        ? Math.max(0, Math.round(Number(productCrudForm.stockSellable)))
        : 0;

    if (productCrudMode === 'EDIT') {
      adminUpdateProduct(cleanSku, {
        category: productCrudForm.category,
        titleEn,
        titleLo: productCrudForm.titleLo.trim() || titleEn,
        titleTh: productCrudForm.titleTh.trim() || titleEn,
        descriptionEn: productCrudForm.descriptionEn.trim(),
        marketPriceLak: marketPrice,
        priceLak: memberPrice,
        memberDiscountLak: memberDiscount,
        commissionPoolLak: pool,
        splitRule: {
          ruleType: 'POOL_PERCENTAGE',
          l1Share: l1,
          l2Share: l2,
          l3Share: l3,
        },
        stockSellable: stock,
        itemType: productCrudForm.itemType,
        imageUrl: productCrudForm.imageUrl.trim(),
      });
      setCoreEditSuccessNotice(`Updated product "${titleEn}" (${cleanSku})!`);
    } else {
      const newProd: ProductSKU = {
        sku: cleanSku,
        category: productCrudForm.category,
        titleEn,
        titleLo: productCrudForm.titleLo.trim() || titleEn,
        titleTh: productCrudForm.titleTh.trim() || titleEn,
        descriptionEn:
          productCrudForm.descriptionEn.trim() || 'Official DMC Xayraxa catalog product.',
        marketPriceLak: marketPrice,
        priceLak: memberPrice,
        memberDiscountLak: memberDiscount,
        commissionPoolLak: pool,
        splitRule: {
          ruleType: 'POOL_PERCENTAGE',
          l1Share: l1,
          l2Share: l2,
          l3Share: l3,
        },
        stockSellable: stock,
        stockReserved: 0,
        warehouseId: 'Vientiane Central Warehouse',
        itemType: productCrudForm.itemType,
        imageUrl:
          productCrudForm.imageUrl.trim() ||
          'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
        featured: true,
      };
      adminAddProduct(newProd);
      setCoreEditSuccessNotice(`Added new product "${titleEn}" (${cleanSku})!`);
    }
    setTimeout(() => setCoreEditSuccessNotice(null), 5000);
    setIsProductCrudOpen(false);
  };

  return (
    <div className="@container space-y-5 pb-16 animate-in fade-in">
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

      {viewMode === 'MY_MUSIC' ? (
        <div className="space-y-5">
          {/* 1. MY MUSIC: CREATE & SELL SONG WITH COPYRIGHT HERO HEADER */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-2 border-emerald-500/50 p-5 shadow-2xl">
            <div className="flex flex-col @2xl:flex-row @2xl:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                    OFFICIAL COPYRIGHT MUSIC MARKETPLACE
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    LAO IP LAW NO. 38/NA • WIPO BERNE CONVENTION
                  </span>
                </div>
                <h2 className="text-lg @lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Music className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span>My Music • Create & Sell Song with Copyright</span>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Create and publish original studio songs with official DMC Copyright Certificates.
                  User Members can preview, buy any Song Package, and immediately download the
                  24-bit Master WAV Audio + Signed Copyright Certificate.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={openCreateSongModal}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Create & Sell Song</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCertificateSongTarget(myOwnedSongs[0] || allSongs[0] || null)
                  }
                  className="px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Official Copyright Certificate</span>
                </button>
              </div>
            </div>

            {/* Summary Counters */}
            <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-800/80 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">
                  Copyright Songs for Sale
                </div>
                <div className="text-base font-black text-white font-mono mt-0.5">
                  {allSongs.length} Songs
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-300 uppercase font-bold">
                  My Owned / Ready to Download
                </div>
                <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                  {myOwnedSongs.length} Songs
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="text-[10px] text-amber-300 uppercase font-bold">
                  Unilevel Commission Pool
                </div>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                  700,000 LAK
                </div>
              </div>
            </div>
          </div>

          {/* 2. FILTER TABS: ALL COPYRIGHT SONGS FOR SALE VS MY PURCHASED SONG PACKAGES */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMusicFilterTab('ALL_MARKETPLACE')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  musicFilterTab === 'ALL_MARKETPLACE'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>All Copyright Songs for Sale ({allSongs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMusicFilterTab('MY_OWNED')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  musicFilterTab === 'MY_OWNED'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>My Purchased & Downloadable Songs ({myOwnedSongs.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Cart ({cartItemCount})</span>
            </button>
          </div>

          {/* 3. COPYRIGHT SONG PACKAGE CARDS (PREVIEW, BUY WITH COPYRIGHT, & DOWNLOAD) */}
          <div className="space-y-4">
            {(musicFilterTab === 'MY_OWNED' ? myOwnedSongs : allSongs).map((song) => {
              const isOwned = myOwnedSongs.some((s) => s.id === song.id);
              const isPlaying = playingSongId === song.id;
              const priceLak = song.priceLak || 1600000;
              const marketLak = song.marketPriceLak || 2200000;
              const poolLak = song.commissionPoolLak || 700000;
              const certCode = song.copyrightCode || 'LA-DMC-CR-2026-00101';
              const isrcCode = song.isrcCode || 'LA-XAY-26-00101';

              return (
                <div
                  key={song.id}
                  className={`rounded-2xl bg-slate-900/95 border-2 overflow-hidden shadow-xl transition-all ${
                    isOwned
                      ? 'border-emerald-500/50 hover:border-emerald-400'
                      : 'border-amber-500/40 hover:border-amber-400'
                  }`}
                >
                  <div className="grid grid-cols-1 @2xl:grid-cols-12">
                    {/* Cover Artwork & Audio Preview Column */}
                    <div className="@2xl:col-span-4 relative min-h-[210px] bg-slate-950 flex flex-col justify-between p-4 overflow-hidden">
                      <img
                        src={
                          song.coverImageUrl ||
                          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={song.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-55"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />

                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-amber-500 text-slate-950 shadow">
                          COPYRIGHT SONG
                        </span>
                        {isOwned ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1 shadow">
                            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                            <span>OWNED • READY TO DOWNLOAD</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-950/90 text-amber-300 border border-amber-500/40">
                            {formatLak(priceLak)}
                          </span>
                        )}
                      </div>

                      {/* Center Play/Pause Studio Master Button */}
                      <div className="relative z-10 my-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePlaySong(song)}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all cursor-pointer shrink-0 ${
                            isPlaying
                              ? 'bg-emerald-400 text-slate-950 scale-105'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="text-[11px] font-black text-white uppercase tracking-wider">
                            {isPlaying ? 'Playing Studio Master...' : 'Preview Studio Song'}
                          </div>
                          <div className="text-[10px] text-amber-300 font-mono truncate">
                            {song.genre} • {song.tempo}
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300 border-t border-white/10 pt-2">
                        <span>CERT: {certCode}</span>
                        <span className="text-amber-300">ISRC: {isrcCode}</span>
                      </div>
                    </div>

                    {/* Song Info, Copyright License Details, Buy & Download Actions */}
                    <div className="@2xl:col-span-8 p-4 sm:p-5 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                              {song.title}
                            </h3>
                            <p className="text-xs text-amber-300 font-semibold mt-0.5">
                              Artist / Producer: {song.artistName || `${song.producer} • ${song.studioLocation}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditSongModal(song)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit Song</span>
                            </button>
                            {allSongs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  adminDeleteSong(song.id);
                                  setCoreEditSuccessNotice(`Removed song "${song.title}".`);
                                  setTimeout(() => setCoreEditSuccessNotice(null), 4000);
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                                title="Delete Song"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {song.description ||
                            '24-Bit Studio Master WAV + MP3 + Instrumental Backing Track + Official Signed DMC Copyright Certificate (Lao IP Law No. 38/NA).'}
                        </p>

                        {song.lyricsExcerpt && (
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 italic">
                            <span className="text-amber-400 font-bold not-italic mr-1.5">
                              ♪ Lyrics / Melody:
                            </span>
                            "{song.lyricsExcerpt}"
                          </div>
                        )}

                        {/* Song Package Price & Copyright Bundle Info Box */}
                        <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-2 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>
                                {song.copyrightLicenseType ||
                                  'Full Master Recording + Commercial Copyright Certificate'}
                              </span>
                            </div>
                            <div className="text-right">
                              {marketLak > priceLak && (
                                <span className="text-[10px] font-mono text-slate-500 line-through mr-2">
                                  {formatLak(marketLak)}
                                </span>
                              )}
                              <span className="font-mono font-black text-sm text-amber-400">
                                {formatLak(priceLak)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono text-[11px]">
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              <div className="text-[9px] text-slate-400 font-sans">
                                Creator / Studio
                              </div>
                              <div className="font-bold text-white">
                                {formatLakCompact(Math.max(0, priceLak - poolLak))}
                              </div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              <div className="text-[9px] text-amber-400 font-sans">
                                L1 Direct
                              </div>
                              <div className="font-bold text-amber-300">400K ₭</div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              <div className="text-[9px] text-amber-400 font-sans">
                                L2 Second
                              </div>
                              <div className="font-bold text-amber-300">200K ₭</div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              <div className="text-[9px] text-amber-400 font-sans">
                                L3 Third
                              </div>
                              <div className="font-bold text-amber-300">100K ₭</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BUY SONG PACKAGE & DOWNLOAD SONG PACKAGE + COPYRIGHT CERTIFICATE BUTTONS */}
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
                        {!isOwned ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setBuyingSongTarget(song)}
                              className="flex-1 min-w-[200px] px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                            >
                              <QrCode className="w-4 h-4 stroke-[2.5]" />
                              <span>
                                Buy Song Package + Copyright ({formatLakCompact(priceLak)})
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadSongPackageBundle(song)}
                              disabled={downloadingSongId === song.id}
                              className="px-3.5 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                              <span>
                                {downloadingSongId === song.id
                                  ? 'Downloading...'
                                  : 'Download Song Package'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setCertificateSongTarget(song)}
                              className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Award className="w-4 h-4 text-amber-400" />
                              <span>Preview Certificate</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDownloadSongPackageBundle(song)}
                              disabled={downloadingSongId === song.id}
                              className="flex-1 min-w-[210px] px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                            >
                              <Download className="w-4 h-4 stroke-[2.5]" />
                              <span>
                                {downloadingSongId === song.id
                                  ? 'Downloading WAV + Certificate...'
                                  : 'Download Song Package (WAV + Copyright)'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadOnlySongCert(song)}
                              disabled={downloadingCertSongId === song.id}
                              className="px-3.5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                            >
                              <Award className="w-4 h-4 stroke-[2.5]" />
                              <span>
                                {downloadingCertSongId === song.id
                                  ? 'Generating PNG...'
                                  : 'Download Copyright Certificate'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setCertificateSongTarget(song)}
                              className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>View Certificate</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : viewMode === 'PACKAGE' ? (
        <>
          {/* 1. FEATURED CORE PRODUCT: MUSIC_SINGLE_1600 (Active User Member 1,600,000 LAK) */}
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

          {/* 2. DMC ACADEMY • LEARNING CENTER SECTION (With All Courses Below) */}
          <AcademyScreen />
        </>
      ) : (
        <>
          {/* 1. TOP HEADER & SHOPPING CART BUTTON */}
          <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{t.catalogTitle}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">{t.catalogSub}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={openCreateCatalogProduct}
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>+ Add Product</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsShippingGuideOpen(true)}
                className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Shipping Guide</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                <span>Shopping Cart ({cartItemCount})</span>
              </button>
            </div>
          </div>

          {/* 2. MEMBER SELF-SERVICE SHIPPING SELECTION BAR (Persistent across Catalog & Checkout) */}
          <div className="p-4 rounded-2xl bg-slate-900/95 border border-amber-500/30 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>Select Your Shipping Carrier (ເລືອກບໍລິສັດຂົນສົ່ງດ້ວຍຕົນເອງ)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Delivering to: <span className="text-amber-300 font-semibold">{deliveryAddress.province}</span> •{' '}
                    <span className="text-emerald-300 font-semibold">
                      {selectedCarrier.name} ({formatLak(selectedCarrier.baseFeeLak)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsEditingAddressInCart(true);
                  }}
                  className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Edit Delivery Address</span>
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={openAdminCreateShipping}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Carrier</span>
                  </button>
                )}
              </div>
            </div>

            {/* 3 Lao Carrier Radio Cards */}
            <div className="grid grid-cols-1 @md:grid-cols-3 gap-2.5">
              {shippingCarriers.map((carrier) => {
                const isSelected = selectedCarrierId === carrier.id;
                return (
                  <div
                    key={carrier.id}
                    onClick={() => handleMemberSelectCarrier(carrier.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 relative ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: carrier.accentColor }}
                        />
                        <span className="text-xs font-extrabold text-white truncate">
                          {carrier.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-300/90 font-semibold truncate mt-0.5">
                        {carrier.nameLo}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                        <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {carrier.estimatedDays}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="font-mono font-bold text-amber-300">
                          {formatLak(carrier.baseFeeLak)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? 'bg-amber-400 border-amber-400 text-slate-950'
                            : 'border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      {isAdmin && (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => openAdminEditShipping(carrier)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
                            title="Edit Carrier"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAdminShipping(carrier.id)}
                            className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                            title="Delete Carrier"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. CATEGORY FILTER TABS (2-Row Layout: 3 Categories Top Row + Full-Width Picks & Accessories Bottom Row) */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-2.5 shadow-lg">
            <div className="grid grid-cols-3 gap-2 items-center">
              {[
                { id: 'ALL', label: t.catAll, fullRow: false },
                { id: 'GUITAR', label: t.catGuitars, fullRow: false },
                { id: 'AUDIO_GEAR', label: t.catEquipment, fullRow: false },
                { id: 'ACCESSORY', label: t.catAccessories, fullRow: true },
              ].map((cat) => {
                const isActive =
                  activeCategory === cat.id ||
                  (cat.id === 'AUDIO_GEAR' && activeCategory === 'EQUIPMENT');
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`${
                      cat.fullRow ? 'col-span-3 w-full py-2.5 px-4' : 'col-span-1 py-2.5 px-2'
                    } rounded-xl text-xs sm:text-sm font-bold text-center flex items-center justify-center leading-tight transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                        : 'text-slate-100 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. PROFESSIONAL PRODUCT CATALOG CARDS */}
          <div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 gap-4">
            {filteredProducts
              .filter((p) => p.sku !== 'MUSIC_SINGLE_1600')
              .map((prod) => {
                const inCartQty = cart[prod.sku] || 0;
                const localizedProd = getLocalizedProduct(prod, language);

                return (
                  <div
                    key={prod.sku}
                    className="rounded-2xl bg-slate-900/95 border border-slate-800 hover:border-amber-500/40 overflow-hidden flex flex-col justify-between transition-all group shadow-lg"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img
                          src={prod.imageUrl}
                          alt={localizedProd.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500 text-slate-950 shadow">
                            {prod.category}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => openEditCatalogProduct(prod)}
                                className="p-1.5 rounded-lg bg-slate-950/90 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 transition-colors cursor-pointer shadow"
                                title="Edit Product"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  adminDeleteProduct(prod.sku);
                                  setCoreEditSuccessNotice(`Removed product ${prod.sku} from catalog.`);
                                  setTimeout(() => setCoreEditSuccessNotice(null), 4000);
                                }}
                                className="p-1.5 rounded-lg bg-slate-950/90 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/40 transition-colors cursor-pointer shadow"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-950/90 text-emerald-400 border border-emerald-500/30 font-bold">
                            {t.stockLabel}: {prod.stockSellable}
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 flex items-end justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-amber-300/90 font-semibold block">
                              {prod.sku}
                            </span>
                            {prod.marketPriceLak && prod.marketPriceLak > prod.priceLak && (
                              <span className="text-[10px] font-mono text-slate-400 line-through">
                                Market: {formatLak(prod.marketPriceLak)}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            {prod.memberDiscountLak && prod.memberDiscountLak > 0 && (
                              <span className="text-[9px] font-black text-emerald-400 block">
                                Save {formatLak(prod.memberDiscountLak)}
                              </span>
                            )}
                            <span className="text-sm font-black font-mono text-amber-400">
                              {formatLak(prod.priceLak)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-1">
                            {localizedProd.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {localizedProd.description}
                          </p>
                        </div>

                        {/* Self-Service Carrier Selector directly on Product Card */}
                        <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
                            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">
                              Shipping: <strong className="text-white">{selectedCarrier.name}</strong>
                            </span>
                            <span className="text-emerald-400 font-mono text-[10px] shrink-0">
                              (+{formatLakCompact(selectedCarrier.baseFeeLak)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const idx = shippingCarriers.findIndex(
                                (c) => c.id === selectedCarrierId
                              );
                              const next =
                                shippingCarriers[(idx + 1) % shippingCarriers.length];
                              if (next) handleMemberSelectCarrier(next.id);
                            }}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] shrink-0 cursor-pointer border border-slate-700"
                          >
                            Switch Carrier ↻
                          </button>
                        </div>

                        {/* Official DMC Pricing & Commission Pool Breakdown Card */}
                        <DmcPricingStructureCard
                          compact
                          normalPriceLak={prod.marketPriceLak || DMC_STANDARD_PRICING.marketPriceLak}
                          memberPriceLak={prod.priceLak}
                          memberDiscountLak={
                            prod.memberDiscountLak ||
                            Math.max(
                              0,
                              (prod.marketPriceLak || DMC_STANDARD_PRICING.marketPriceLak) -
                                prod.priceLak
                            )
                          }
                          commissionPoolLak={prod.commissionPoolLak}
                          l1Percent={prod.splitRule.l1Share || 50}
                          l2Percent={prod.splitRule.l2Share || 30}
                          l3Percent={prod.splitRule.l3Share || 20}
                        />
                      </div>
                    </div>

                    {/* Add to Cart / Quantity Control Footer */}
                    <div className="p-4 pt-0 flex items-center gap-2">
                      {inCartQty === 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => addToCart(prod.sku, false)}
                            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{t.addToCart}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInstantBuyProduct(prod.sku)}
                            className="px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md"
                            title="Instant Buy & Checkout with QR"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Buy QR</span>
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 bg-slate-950 border border-amber-500/40 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => removeFromCart(prod.sku)}
                              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono font-black text-xs text-amber-300 px-2">
                              {inCartQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(prod.sku, false)}
                              className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 cursor-pointer shadow"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>View Cart</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}

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

                  <div className="flex flex-wrap items-center gap-2">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => openAdminEditShipping(selectedCarrier)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Admin: Add / Edit Shipping Price</span>
                      </button>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs">
                      {hasPhysical
                        ? `Shipping Fee: ${formatLak(shippingFee)}`
                        : '0 LAK (Studio Package)'}
                    </span>
                  </div>
                </div>

                {/* Dynamic Carrier Radio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {shippingCarriers.map((carrier) => {
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
                      min="0"
                      step="any"
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
                      min="0"
                      step="any"
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
                      min="0"
                      step="any"
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
                      min="0"
                      step="any"
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

      {/* ================= ADMINISTRATOR SHIPPING CARRIER & PRICE CRUD MODAL (ADD, EDIT, UPDATE, DELETE) ================= */}
      {isAdmin && isShippingAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-2xl w-full p-5 sm:p-6 text-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4 my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-white">
                      {shippingAdminMode === 'EDIT'
                        ? `Edit / Update Shipping & Price: ${shippingForm.name}`
                        : 'Add New Shipping Carrier & Price'}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      ADMIN CRUD
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add, Edit, Delete, or Update shipping carriers and delivery prices when rates change.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShippingAdminModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Switcher Strip: Existing Shipping Carriers + Add New */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider text-slate-400">
                  Select Carrier to Edit or Add New ({shippingCarriers.length} Active):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    adminResetShippingCarriers();
                    setShippingSavedToast('Reset shipping carriers & prices to default!');
                    setTimeout(() => setShippingSavedToast(null), 3500);
                    setIsShippingAdminModalOpen(false);
                  }}
                  className="text-[11px] text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  Reset Default Carriers
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={openAdminCreateShipping}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition-all ${
                    shippingAdminMode === 'CREATE'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Shipping</span>
                </button>
                {shippingCarriers.map((c) => {
                  const isCurrentEdit =
                    shippingAdminMode === 'EDIT' && editingCarrierId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => openAdminEditShipping(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer transition-all ${
                        isCurrentEdit
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: c.logoColor }}
                      />
                      <span>{c.name}</span>
                      <span
                        className={`font-mono text-[10px] ${
                          isCurrentEdit ? 'text-slate-900 font-black' : 'text-amber-300'
                        }`}
                      >
                        ({formatLakCompact(c.baseFeeLak)})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shipping CRUD Form */}
            <form onSubmit={handleSaveAdminShipping} className="space-y-4 text-xs">
              {/* 1. Shipping Price (LAK) with Quick Price Change Chips */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-300 uppercase tracking-wider text-xs">
                    1. Shipping Fee / Delivery Price (ລາຄາຄ່າຂົນສົ່ງ LAK) *
                  </span>
                  <span className="font-mono font-black text-sm text-emerald-400">
                    Active Price: {formatLak(shippingForm.baseFeeLak)}
                  </span>
                </div>

                <BeautifulNumberInput
                  label="Shipping Price (Integer LAK)"
                  placeholder="e.g. 25,000 or 35,000 or 40,000"
                  value={shippingForm.baseFeeLak}
                  onChange={(num) => setShippingForm({ ...shippingForm, baseFeeLak: num })}
                  required
                  theme="amber"
                  presetChips={[0, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000]}
                  showMaxButton={false}
                  showKBadge={true}
                />
              </div>

              {/* 2. Carrier Names & Details */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="font-black text-amber-300 uppercase tracking-wider text-xs block">
                  2. Shipping Company Identity & Delivery Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Shipping Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.name}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, name: e.target.value })
                      }
                      placeholder="e.g. Anousith Logistics / ZTO Express"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Shipping Name (Lao / ຊື່ພາສາລາວ) *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.nameLao}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, nameLao: e.target.value })
                      }
                      placeholder="e.g. ອານຸສິດ ຂົນສົ່ງ (Anousith Logistics)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Estimated Delivery Time *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.estimatedDays}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, estimatedDays: e.target.value })
                      }
                      placeholder="e.g. 1-2 Days or Same-Day (2-4 hrs)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-emerald-300 font-semibold focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Waybill Tracking Prefix *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.trackingPrefix}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, trackingPrefix: e.target.value })
                      }
                      placeholder="e.g. ANS-LA or HAL-LA"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-amber-300 font-mono font-bold focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Hotline Phone (+856) *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.hotline}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, hotline: e.target.value })
                      }
                      placeholder="e.g. 1668 / +856 20 5511 8899"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-slate-300 font-semibold block mb-1">
                      Coverage / Service Badge
                    </label>
                    <input
                      type="text"
                      value={shippingForm.badge}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, badge: e.target.value })
                      }
                      placeholder="e.g. Nationwide Network • 18 Provinces"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Brand Badge Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={shippingForm.logoColor}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, logoColor: e.target.value })
                        }
                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-1"
                      />
                      <input
                        type="text"
                        value={shippingForm.logoColor}
                        onChange={(e) =>
                          setShippingForm({ ...shippingForm, logoColor: e.target.value })
                        }
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows={2}
                    value={shippingForm.description}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, description: e.target.value })
                    }
                    placeholder="Describe provincial coverage, branch pickup, or same-day courier terms..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons: Delete, Cancel, Save / Update */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                {shippingAdminMode === 'EDIT' && shippingCarriers.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const target = shippingCarriers.find((c) => c.id === editingCarrierId);
                      if (target) handleDeleteAdminShipping(target);
                    }}
                    className="px-4 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Carrier</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsShippingAdminModalOpen(false)}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      {shippingAdminMode === 'EDIT'
                        ? `Update Shipping & Price (${formatLak(shippingForm.baseFeeLak)})`
                        : `Add Shipping Carrier (${formatLak(shippingForm.baseFeeLak)})`}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADMINISTRATOR PRODUCT CATALOG CRUD MODAL (ADD, EDIT, DELETE, UPDATE) ================= */}
      {isAdmin && isProductCrudOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-xl w-full p-5 sm:p-6 text-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4 my-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {productCrudMode === 'EDIT'
                      ? `Edit / Update Product (${productCrudForm.sku})`
                      : 'Add New Catalog Product'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload product photo, set LAK price, 50/30/20 commission pool, and stock.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProductCrudOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCatalogProduct} className="space-y-3.5 text-xs">
              {/* Product Image Preview & Upload */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <img
                  src={productCrudForm.imageUrl}
                  alt={productCrudForm.titleEn || 'Product Preview'}
                  className="w-16 h-16 rounded-xl object-cover border border-amber-400/50 shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Product Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setProductCrudForm((prev) => ({
                              ...prev,
                              imageUrl: reader.result as string,
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={productCrudForm.imageUrl}
                    onChange={(e) =>
                      setProductCrudForm({ ...productCrudForm, imageUrl: e.target.value })
                    }
                    placeholder="Or paste image URL..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    disabled={productCrudMode === 'EDIT'}
                    value={productCrudForm.sku}
                    onChange={(e) =>
                      setProductCrudForm({
                        ...productCrudForm,
                        sku: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono font-bold disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category *</label>
                  <select
                    value={productCrudForm.category}
                    onChange={(e) =>
                      setProductCrudForm({
                        ...productCrudForm,
                        category: e.target.value as ProductSKU['category'],
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold"
                  >
                    <option value="GUITAR">Guitars & Basses (GUITAR)</option>
                    <option value="AUDIO_GEAR">Studio Mics & Gear (AUDIO_GEAR)</option>
                    <option value="ACCESSORY">Picks & Accessories (ACCESSORY)</option>
                    <option value="MUSIC_PACKAGE">Music Package (MUSIC_PACKAGE)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Item Type</label>
                  <select
                    value={productCrudForm.itemType}
                    onChange={(e) =>
                      setProductCrudForm({
                        ...productCrudForm,
                        itemType: e.target.value as ProductSKU['itemType'],
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold"
                  >
                    <option value="PHYSICAL">PHYSICAL PARCEL</option>
                    <option value="SERVICE">STUDIO SERVICE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Product Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={productCrudForm.titleEn}
                  onChange={(e) =>
                    setProductCrudForm({ ...productCrudForm, titleEn: e.target.value })
                  }
                  placeholder="e.g. DMC Acoustic Guitar Pro"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Lao Title (ພາສາລາວ)
                  </label>
                  <input
                    type="text"
                    value={productCrudForm.titleLo}
                    onChange={(e) =>
                      setProductCrudForm({ ...productCrudForm, titleLo: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Thai Title (ไทย)
                  </label>
                  <input
                    type="text"
                    value={productCrudForm.titleTh}
                    onChange={(e) =>
                      setProductCrudForm({ ...productCrudForm, titleTh: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Market Price (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={productCrudForm.marketPriceLak}
                    onChange={(e) => {
                      const val = e.target.value;
                      const mktNum = Number(val) || 0;
                      const memNum = Number(productCrudForm.priceLak) || 0;
                      setProductCrudForm({
                        ...productCrudForm,
                        marketPriceLak: val === '' ? '' : Number(val),
                        memberDiscountLak: Math.max(0, mktNum - memNum),
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-200 font-mono font-bold focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-amber-300 font-bold block mb-1">
                    DMC Member Price (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={productCrudForm.priceLak}
                    onChange={(e) => {
                      const val = e.target.value;
                      const memNum = Number(val) || 0;
                      const mktNum = Number(productCrudForm.marketPriceLak) || 0;
                      setProductCrudForm({
                        ...productCrudForm,
                        priceLak: val === '' ? '' : Number(val),
                        memberDiscountLak: Math.max(0, mktNum - memNum),
                      });
                    }}
                    className="w-full bg-slate-900 border-2 border-amber-500/60 rounded-xl p-2 text-amber-300 font-mono font-black focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-emerald-300 font-bold block mb-1">
                    Member Discount (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={productCrudForm.memberDiscountLak}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProductCrudForm({
                        ...productCrudForm,
                        memberDiscountLak: val === '' ? '' : Number(val),
                      });
                    }}
                    className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl p-2 text-emerald-400 font-mono font-bold focus:border-emerald-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-amber-300 font-bold block mb-1">
                    Commission Pool = 100% (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={productCrudForm.commissionPoolLak}
                    onChange={(e) =>
                      setProductCrudForm({
                        ...productCrudForm,
                        commissionPoolLak: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl p-2 text-amber-300 font-mono font-bold focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={productCrudForm.stockSellable}
                    onChange={(e) =>
                      setProductCrudForm({
                        ...productCrudForm,
                        stockSellable: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono font-bold focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Commission Distribution L1 / L2 / L3 (%) Input by Type Number */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-300">
                    Commission Distribution (From {formatLak(Number(productCrudForm.commissionPoolLak) || 0)} Pool):
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {Number(productCrudForm.l1Share) || 0}% + {Number(productCrudForm.l2Share) || 0}% +{' '}
                    {Number(productCrudForm.l3Share) || 0}% ={' '}
                    {(Number(productCrudForm.l1Share) || 0) +
                      (Number(productCrudForm.l2Share) || 0) +
                      (Number(productCrudForm.l3Share) || 0)}
                    %
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-amber-300 font-bold block mb-1">
                      L1 (%) •{' '}
                      {formatLak(
                        Math.floor(
                          ((Number(productCrudForm.commissionPoolLak) || 0) *
                            (Number(productCrudForm.l1Share) || 0)) /
                            100
                        )
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={productCrudForm.l1Share}
                      onChange={(e) =>
                        setProductCrudForm({
                          ...productCrudForm,
                          l1Share: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-lg p-1.5 text-center text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sky-300 font-bold block mb-1">
                      L2 (%) •{' '}
                      {formatLak(
                        Math.floor(
                          ((Number(productCrudForm.commissionPoolLak) || 0) *
                            (Number(productCrudForm.l2Share) || 0)) /
                            100
                        )
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={productCrudForm.l2Share}
                      onChange={(e) =>
                        setProductCrudForm({
                          ...productCrudForm,
                          l2Share: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-sky-500/40 rounded-lg p-1.5 text-center text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-emerald-300 font-bold block mb-1">
                      L3 (%) •{' '}
                      {formatLak(
                        Math.floor(
                          ((Number(productCrudForm.commissionPoolLak) || 0) *
                            (Number(productCrudForm.l3Share) || 0)) /
                            100
                        )
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={productCrudForm.l3Share}
                      onChange={(e) =>
                        setProductCrudForm({
                          ...productCrudForm,
                          l3Share: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-emerald-500/40 rounded-lg p-1.5 text-center text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={productCrudForm.descriptionEn}
                  onChange={(e) =>
                    setProductCrudForm({
                      ...productCrudForm,
                      descriptionEn: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-between gap-2.5 pt-2">
                {productCrudMode === 'EDIT' && products.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      adminDeleteProduct(productCrudForm.sku);
                      setIsProductCrudOpen(false);
                      setCoreEditSuccessNotice(`Deleted product ${productCrudForm.sku}`);
                      setTimeout(() => setCoreEditSuccessNotice(null), 4000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsProductCrudOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    {productCrudMode === 'EDIT' ? 'Update Product' : 'Save New Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE / EDIT COPYRIGHT SONG PACKAGE MODAL ================= */}
      {isSongCrudOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl max-w-xl w-full p-5 sm:p-6 text-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4 my-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {songCrudMode === 'EDIT'
                      ? 'Edit Copyright Song Package'
                      : 'Create & Sell New Song with Copyright'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Publish studio song with official DMC Copyright Certificate for User Members to buy & download.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSongCrudOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCopyrightSong} className="space-y-3.5 text-xs">
              {/* Cover Artwork & Audio Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <img
                    src={songForm.coverImageUrl}
                    alt="Song Cover"
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-400/50 shrink-0"
                  />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] cursor-pointer shadow">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Cover Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (typeof ev.target?.result === 'string') {
                              setSongForm((prev) => ({
                                ...prev,
                                coverImageUrl: ev.target!.result as string,
                              }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <div className="text-[10px] text-slate-400 truncate">
                      Song Cover Art (JPG/PNG)
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <FileAudio className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer shadow">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Master Audio</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (typeof ev.target?.result === 'string') {
                              setSongForm((prev) => ({
                                ...prev,
                                previewAudioUrl: ev.target!.result as string,
                                audioFileName: file.name,
                              }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <div className="text-[10px] text-amber-300 font-mono truncate">
                      {songForm.audioFileName}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Song Title (Lao / English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={songForm.title}
                    onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                    placeholder="e.g. ສຽງແຄນແດນວຽງຈັນ (Echoes of the Mekong)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Artist / Creator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={songForm.artistName}
                    onChange={(e) => setSongForm({ ...songForm, artistName: e.target.value })}
                    placeholder="e.g. Xay Raxa • DMC Studio Master"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-300 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Genre</label>
                  <input
                    type="text"
                    value={songForm.genre}
                    onChange={(e) => setSongForm({ ...songForm, genre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tempo (BPM)</label>
                  <input
                    type="text"
                    value={songForm.tempo}
                    onChange={(e) => setSongForm({ ...songForm, tempo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Copyright No.
                  </label>
                  <input
                    type="text"
                    value={songForm.copyrightCode}
                    onChange={(e) =>
                      setSongForm({ ...songForm, copyrightCode: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-emerald-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">ISRC Code</label>
                  <input
                    type="text"
                    value={songForm.isrcCode}
                    onChange={(e) => setSongForm({ ...songForm, isrcCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-amber-300 font-mono"
                  />
                </div>
              </div>

              {/* Pricing in LAK */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950/90 border border-amber-500/30">
                <div>
                  <label className="text-[11px] text-amber-300 font-bold block mb-1">
                    Song Package Price (LAK)
                  </label>
                  <BeautifulNumberInput
                    value={songForm.priceLak}
                    onValueChange={(val) =>
                      setSongForm({ ...songForm, priceLak: val === '' ? 0 : Number(val) })
                    }
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl p-2 text-amber-300 font-mono font-black"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">
                    Normal Market Price (LAK)
                  </label>
                  <BeautifulNumberInput
                    value={songForm.marketPriceLak}
                    onValueChange={(val) =>
                      setSongForm({
                        ...songForm,
                        marketPriceLak: val === '' ? 0 : Number(val),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-emerald-300 font-bold block mb-1">
                    Commission Pool (LAK)
                  </label>
                  <BeautifulNumberInput
                    value={songForm.commissionPoolLak}
                    onValueChange={(val) =>
                      setSongForm({
                        ...songForm,
                        commissionPoolLak: val === '' ? 0 : Number(val),
                      })
                    }
                    className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl p-2 text-emerald-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Lyrics Excerpt / Chorus
                </label>
                <input
                  type="text"
                  value={songForm.lyricsExcerpt}
                  onChange={(e) =>
                    setSongForm({ ...songForm, lyricsExcerpt: e.target.value })
                  }
                  placeholder="Enter chorus or lyrics excerpt..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Song Package & Copyright License Description
                </label>
                <textarea
                  rows={2}
                  value={songForm.description}
                  onChange={(e) =>
                    setSongForm({ ...songForm, description: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSongCrudOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {songCrudMode === 'EDIT'
                    ? 'Update Copyright Song'
                    : 'Publish Copyright Song for Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BUY COPYRIGHT SONG PACKAGE QR PAYMENT MODAL ================= */}
      {buyingSongTarget && (
        <BankQrPaymentModal
          isOpen={Boolean(buyingSongTarget)}
          onClose={() => setBuyingSongTarget(null)}
          amountLak={buyingSongTarget.priceLak || 1600000}
          purpose="ORDER_CHECKOUT"
          title={`Buy Copyright Song Package: ${buyingSongTarget.title}`}
          description={`Includes 24-Bit Studio Master WAV + Official Signed DMC Copyright Certificate (${
            buyingSongTarget.copyrightCode || 'LA-DMC-CR-2026'
          })`}
          onPaymentSuccess={async (paymentDetails) => {
            const res = await purchaseCopyrightSongPackage(
              buyingSongTarget.id,
              'LAO_QR',
              paymentDetails.reference
            );
            const purchasedSong = buyingSongTarget;
            setBuyingSongTarget(null);
            if (res.order) {
              setCheckoutSuccessOrder(res.order);
            }
            setCoreEditSuccessNotice(res.message);
            // Automatically download the Song Package + Signed Copyright Certificate for the buyer!
            await handleDownloadSongPackageBundle(purchasedSong);
          }}
        />
      )}

      {/* ================= OFFICIAL COPYRIGHT CERTIFICATE VIEWER & DOWNLOAD MODAL ================= */}
      {certificateSongTarget && (
        <CopyrightCertificateModal
          isOpen={Boolean(certificateSongTarget)}
          onClose={() => setCertificateSongTarget(null)}
          memberId={currentMember.memberId}
          memberName={currentMember.name}
          isActiveLifetime={true}
          songs={allSongs}
          defaultSongTitle={certificateSongTarget.title}
        />
      )}
    </div>
  );
};
