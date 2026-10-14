import React, { useState } from 'react';
import { 
  Truck, 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Package, 
  Search, 
  Navigation, 
  ExternalLink,
  ShieldCheck,
  Star,
  Copy,
  ChevronRight
} from 'lucide-react';
import { 
  LaoShippingCarrierId, 
  LaoShippingCarrier, 
  LAO_SHIPPING_CARRIERS 
} from '../../types/dmc';
import { formatLak } from '../../utils/i18n';
import { useDmc } from '../../context/DmcContext';

interface LaoShippingCarrierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCarrierId?: LaoShippingCarrierId;
  initialTrackingCode?: string;
}

interface TrackingCheckpoint {
  time: string;
  location: string;
  status: string;
  description: string;
  isComplete: boolean;
  isCurrent: boolean;
}

export const LaoShippingCarrierModal: React.FC<LaoShippingCarrierModalProps> = ({
  isOpen,
  onClose,
  initialCarrierId = 'ANOUSITH',
  initialTrackingCode = ''
}) => {
  const { currentMember, language } = useDmc();
  const [selectedCarrierId, setSelectedCarrierId] = useState<LaoShippingCarrierId>(initialCarrierId);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRACKING' | 'COVERAGE'>('OVERVIEW');
  const [trackingInput, setTrackingInput] = useState<string>(initialTrackingCode || 'ANS-LA-882190');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [preferredSavedNotice, setPreferredSavedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCarrier = LAO_SHIPPING_CARRIERS.find(c => c.id === selectedCarrierId) || LAO_SHIPPING_CARRIERS[0];

  const getCarrierDisplayName = (carrier: LaoShippingCarrier) => {
    if (language === 'lo') return carrier.nameLao;
    if (language === 'th' && carrier.nameTh) return carrier.nameTh;
    if (language === 'vi' && carrier.nameVi) return carrier.nameVi;
    if (language === 'zh' && carrier.nameZh) return carrier.nameZh;
    if (language === 'ko' && carrier.nameKo) return carrier.nameKo;
    return carrier.name;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSetPreferredCarrier = (carrierId: LaoShippingCarrierId) => {
    setSelectedCarrierId(carrierId);
    setPreferredSavedNotice(`Saved ${selectedCarrier.name} as your preferred shipping carrier!`);
    setTimeout(() => setPreferredSavedNotice(null), 3000);
  };

  // Mock tracking steps based on prefix
  const getTrackingSteps = (code: string): TrackingCheckpoint[] => {
    const isLocal = code.startsWith('DMC-LOCAL') || selectedCarrierId === 'LOCAL_DELIVERY';
    const isHal = code.startsWith('HAL-LA') || selectedCarrierId === 'HAL_EXPRESS';

    if (isLocal) {
      return [
        {
          time: 'Today 14:15 Asia/Vientiane',
          location: 'DMC Central Studios, Dongdok Campus',
          status: 'Order Dispatched',
          description: 'Package verified, barcoded and assigned to Vientiane motor rider.',
          isComplete: true,
          isCurrent: false
        },
        {
          time: 'Today 14:40 Asia/Vientiane',
          location: 'Lane Xang Ave / Xaysetha Hub',
          status: 'Rider In Transit',
          description: 'Courier Rider (Somxay K., Plate: ວຽງຈັນ ກຂ-8812) en route.',
          isComplete: true,
          isCurrent: true
        },
        {
          time: 'Estimated 15:30 Asia/Vientiane',
          location: 'Recipient Address (Vientiane Capital)',
          status: 'Out for Delivery',
          description: 'Direct door-to-door handoff with recipient verification.',
          isComplete: false,
          isCurrent: false
        }
      ];
    }

    if (isHal) {
      return [
        {
          time: 'Yesterday 17:30 Asia/Vientiane',
          location: 'DMC Logistics Center, Vientiane Hub',
          status: 'Parcel Picked Up',
          description: 'HAL Express cargo team collected parcel for Route 13 priority shipment.',
          isComplete: true,
          isCurrent: false
        },
        {
          time: 'Today 06:45 Asia/Vientiane',
          location: 'HAL Highway 13 Central Sorting Depot',
          status: 'Inter-Provincial Hub Transit',
          description: 'Loaded onto express container truck departing for provincial transfer.',
          isComplete: true,
          isCurrent: true
        },
        {
          time: 'Estimated Tomorrow 10:00 Asia/Vientiane',
          location: 'Destination Branch Depot',
          status: 'Arrived at Destination Hub',
          description: 'Parcel ready for local courier dispatch or counter pickup.',
          isComplete: false,
          isCurrent: false
        }
      ];
    }

    // Default Anousith Logistics
    return [
      {
        time: 'Yesterday 16:00 Asia/Vientiane',
        location: 'DMC Fulfillment Center Dongdok, Vientiane',
        status: 'Electronic Shipment Data Received',
        description: 'Anousith Logistics tracking manifest generated: ' + code,
        isComplete: true,
        isCurrent: false
      },
      {
        time: 'Yesterday 19:20 Asia/Vientiane',
        location: 'Anousith Central Gateway Depot (Phontong)',
        status: 'Sorted at Central Hub',
        description: 'Automated optical sorting complete; packaged for nationwide transport.',
        isComplete: true,
        isCurrent: false
      },
      {
        time: 'Today 08:30 Asia/Vientiane',
        location: 'Provincial Delivery Station',
        status: 'Out for Delivery',
        description: 'Driver assigned for door-to-door handoff with cash-on-delivery validation.',
        isComplete: true,
        isCurrent: true
      },
      {
        time: 'Pending Delivery',
        location: 'Recipient Doorstep',
        status: 'Final Delivery Confirmation',
        description: 'Recipient signature and delivery scan in progress.',
        isComplete: false,
        isCurrent: false
      }
    ];
  };

  const trackingSteps = getTrackingSteps(trackingInput);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 text-slate-100">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Lao Shipping Carriers & Express Logistics
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  3 Carriers
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official logistics network across all 18 provinces in Lao PDR & Vientiane Capital
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Carrier Selector Bar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800">
          <div className="grid grid-cols-3 gap-2">
            {LAO_SHIPPING_CARRIERS.map(carrier => {
              const isSelected = selectedCarrierId === carrier.id;
              return (
                <button
                  key={carrier.id}
                  onClick={() => setSelectedCarrierId(carrier.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: carrier.logoColor }}
                    />
                    {isSelected && (
                      <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-white truncate">
                    {carrier.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {carrier.estimatedDays} • {formatLak(carrier.baseFeeLak)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Tabs: Overview, Live Tracking, Provincial Coverage */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Carrier Details
          </button>
          <button
            onClick={() => setActiveTab('TRACKING')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'TRACKING'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Parcel</span>
          </button>
          <button
            onClick={() => setActiveTab('COVERAGE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'COVERAGE'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>18 Provinces Network</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {preferredSavedNotice && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{preferredSavedNotice}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4 text-xs">
              {/* Carrier Feature Card */}
              <div 
                className="p-4 sm:p-5 rounded-2xl border bg-gradient-to-br from-slate-850 to-slate-900 relative overflow-hidden"
                style={{ borderColor: `${selectedCarrier.logoColor}55` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase text-white shadow-sm"
                        style={{ backgroundColor: selectedCarrier.logoColor }}
                      >
                        {selectedCarrier.id.replace('_', ' ')}
                      </span>
                      <span className="text-amber-400 font-mono text-[11px] font-bold">
                        Prefix: {selectedCarrier.trackingPrefix}-XXXXXX
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white">
                      {getCarrierDisplayName(selectedCarrier)}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                      {selectedCarrier.description}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Standard Base Fee</div>
                    <div className="text-base sm:text-lg font-black text-amber-400 font-mono">
                      {formatLak(selectedCarrier.baseFeeLak)}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center sm:justify-end gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{selectedCarrier.estimatedDays}</span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Strip */}
                <div className="mt-4 pt-3.5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[9px] text-slate-400 block font-medium">Service Coverage</span>
                    <strong className="text-white text-xs block mt-0.5 truncate">{selectedCarrier.badge}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[9px] text-slate-400 block font-medium">Delivery Guarantee</span>
                    <strong className="text-emerald-400 text-xs block mt-0.5">{selectedCarrier.estimatedDays}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[9px] text-slate-400 block font-medium">Official Hotline</span>
                    <strong className="text-amber-300 text-xs block mt-0.5 font-mono truncate">{selectedCarrier.hotline}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[9px] text-slate-400 block font-medium">Door-to-Door</span>
                    <strong className="text-white text-xs block mt-0.5">Cash on Delivery (COD)</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSetPreferredCarrier(selectedCarrier.id)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Set as My Default Carrier</span>
                  </button>

                  <button
                    onClick={() => {
                      setTrackingInput(`${selectedCarrier.trackingPrefix}-${Math.floor(100000 + Math.random() * 900000)}`);
                      setActiveTab('TRACKING');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demo Tracking</span>
                  </button>

                  <a
                    href={`tel:${selectedCarrier.hotline.split('/')[0].trim().replace(/[^0-9+]/g, '')}`}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Hotline ({selectedCarrier.hotline.split('/')[0].trim()})</span>
                  </a>
                </div>
              </div>

              {/* All 3 Carriers Side-by-Side Comparison */}
              <div className="space-y-2">
                <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Comprehensive Lao Carrier Comparison</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {LAO_SHIPPING_CARRIERS.map(c => (
                    <div 
                      key={c.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        selectedCarrierId === c.id 
                          ? 'bg-slate-800/90 border-amber-500 shadow-md' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: c.logoColor }}
                        />
                        <span className="font-mono text-[10px] text-amber-400 font-bold">{c.trackingPrefix}</span>
                      </div>
                      <div className="font-bold text-xs text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.nameLao}</div>
                      
                      <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Speed:</span>
                          <span className="text-emerald-400 font-medium">{c.estimatedDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Base Fee:</span>
                          <span className="text-amber-300 font-mono font-bold">{formatLak(c.baseFeeLak)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Hotline:</span>
                          <span className="text-slate-200 font-mono">{c.hotline.split('/')[0].trim()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedCarrierId(c.id)}
                        className={`w-full mt-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          selectedCarrierId === c.id
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {selectedCarrierId === c.id ? 'Viewing' : 'Select'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TRACKING */}
          {activeTab === 'TRACKING' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                <span className="font-bold text-white block">Look Up Parcel Tracking Code</span>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={e => setTrackingInput(e.target.value.toUpperCase())}
                      placeholder="e.g. ANS-LA-882190 or HAL-LA-551029"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-amber-400 uppercase"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!trackingInput.trim()) {
                        setTrackingInput(`${selectedCarrier.trackingPrefix}-884910`);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Track
                  </button>
                </div>

                {/* Quick sample chips */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-slate-400">Sample codes:</span>
                  {[
                    { label: 'Anousith (18 Prov.)', code: 'ANS-LA-882190', id: 'ANOUSITH' },
                    { label: 'HAL Express (Route 13)', code: 'HAL-LA-773192', id: 'HAL_EXPRESS' },
                    { label: 'Local Rider (Vientiane)', code: 'DMC-LOCAL-501122', id: 'LOCAL_DELIVERY' }
                  ].map(s => (
                    <button
                      key={s.code}
                      onClick={() => {
                        setTrackingInput(s.code);
                        setSelectedCarrierId(s.id as LaoShippingCarrierId);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[10px] border border-slate-700 cursor-pointer"
                    >
                      {s.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking Result Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Package Waybill</span>
                    <h5 className="font-mono text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                      <span>{trackingInput}</span>
                      <button
                        onClick={() => handleCopy(trackingInput)}
                        className="text-slate-400 hover:text-white"
                        title="Copy tracking code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </h5>
                    <span className="text-[11px] text-slate-300 mt-0.5 block">
                      Carrier: <strong className="text-white">{selectedCarrier.name}</strong> ({selectedCarrier.nameLao})
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                    IN TRANSIT
                  </span>
                </div>

                {/* Vertical Checkpoints Timeline */}
                <div className="space-y-4 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {trackingSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Checkpoint Dot */}
                      <div 
                        className={`absolute -left-5 top-0.5 w-3 h-3 rounded-full border-2 ${
                          step.isCurrent
                            ? 'bg-amber-400 border-amber-300 ring-4 ring-amber-400/20 animate-pulse'
                            : step.isComplete
                            ? 'bg-emerald-500 border-emerald-400'
                            : 'bg-slate-800 border-slate-700'
                        }`}
                      />

                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className={`font-bold text-xs ${step.isCurrent ? 'text-amber-400' : 'text-white'}`}>
                            {step.status}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{step.location}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 18 PROVINCES COVERAGE */}
          {activeTab === 'COVERAGE' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>All 18 Provinces of Lao PDR Connected</span>
                </h5>
                <p className="text-slate-300 leading-relaxed text-xs">
                  DMC Xayraxa fulfills music merchandise, physical albums, master audio drives, audio hardware, and official merchandise across all 18 administrative provinces of Lao PDR using verified carriers.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Vientiane Capital', nameLao: 'ນະຄອນຫຼວງວຽງຈັນ', hub: 'Central Hub Dongdok', carrier: 'All 3 Carriers' },
                  { name: 'Luang Prabang', nameLao: 'ແຂວງຫຼວງພະບາງ', hub: 'Northern Hub', carrier: 'Anousith / HAL' },
                  { name: 'Champasak (Pakse)', nameLao: 'ແຂວງຈຳປາສັກ', hub: 'Southern Gateway', carrier: 'Anousith / HAL' },
                  { name: 'Savannakhet', nameLao: 'ແຂວງສະຫວັນນະເຂດ', hub: 'Route 9 Hub', carrier: 'Anousith / HAL' },
                  { name: 'Khammouane (Thakhek)', nameLao: 'ແຂວງຄຳມ່ວນ', hub: 'Central Hub', carrier: 'Anousith / HAL' },
                  { name: 'Vientiane Province (Phonhong)', nameLao: 'ແຂວງວຽງຈັນ', hub: 'Phonhong Depot', carrier: 'Anousith / HAL' },
                  { name: 'Oudomxay (Muang Xay)', nameLao: 'ແຂວງອຸດົມໄຊ', hub: 'North Central Depot', carrier: 'Anousith' },
                  { name: 'Bokeo (Houayxay)', nameLao: 'ແຂວງບໍ່ແກ້ວ', hub: 'Golden Triangle Station', carrier: 'Anousith' },
                  { name: 'Luang Namtha', nameLao: 'ແຂວງຫຼວງນ້ຳທາ', hub: 'Border Hub Boten', carrier: 'Anousith' },
                  { name: 'Phongsaly', nameLao: 'ແຂວງຜົ້ງສາລີ', hub: 'Highland Station', carrier: 'Anousith' },
                  { name: 'Houaphanh (Sam Neua)', nameLao: 'ແຂວງຫົວພັນ', hub: 'Eastern Mountain Depot', carrier: 'Anousith' },
                  { name: 'Xieng Khouang (Phonsavan)', nameLao: 'ແຂວງຊຽງຂວາງ', hub: 'Plain of Jars Hub', carrier: 'Anousith' },
                  { name: 'Bolikhamxay (Paksan)', nameLao: 'ແຂວງບໍລິຄຳໄຊ', hub: 'Paksan Depot', carrier: 'Anousith / HAL' },
                  { name: 'Salavan', nameLao: 'ແຂວງສາລະວັນ', hub: 'Plateau Station', carrier: 'Anousith' },
                  { name: 'Sekong', nameLao: 'ແຂວງເຊກອງ', hub: 'Southern Hills', carrier: 'Anousith' },
                  { name: 'Attapeu', nameLao: 'ແຂວງອັດຕະປື', hub: 'Southern Border Depot', carrier: 'Anousith' },
                  { name: 'Xaisomboun', nameLao: 'ແຂວງໄຊສົມບູນ', hub: 'Mountain Hub Anouvong', carrier: 'Anousith' },
                  { name: 'Xayabury', nameLao: 'ແຂວງໄຊຍະບູລີ', hub: 'West Mekong Depot', carrier: 'Anousith' }
                ].map((prov, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-white text-[11px] truncate">{prov.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{prov.nameLao}</div>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                      <span className="text-amber-400 font-medium">{prov.carrier}</span>
                      <span className="text-slate-500">{prov.hub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Selected: <strong className="text-white">{selectedCarrier.name}</strong> ({selectedCarrier.hotline.split('/')[0].trim()})
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
