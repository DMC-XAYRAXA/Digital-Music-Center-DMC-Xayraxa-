/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * BEAUTIFUL NUMBER INPUT COMPONENT ("use K" smart inbox)
 * Features:
 * - Direct parsing of 'k' / 'K' (e.g., 500k -> 500,000 LAK) and 'm' / 'M' (1.6m -> 1,600,000 LAK)
 * - Beautiful Lao Kip (₭ / LAK) currency adornments
 * - Live compact "K" indicator badge inside the input box (e.g. "500K ₭")
 * - Live formatted readable breakdown with commas
 * - Quick "use K" preset buttons (+50K, +100K, +500K, +1,000K, MAX)
 * - Responsive clean focus ring and zero ugly native browser spin-buttons
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Plus, ArrowUpRight } from 'lucide-react';
import { parseAmountWithK, formatLakCompact, formatLak } from '../../utils/i18n';

export interface BeautifulNumberInputProps {
  value: number | string;
  onChange: (numericValue: number, textValue: string) => void;
  label?: string;
  helperLabel?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  showKBadge?: boolean;
  showPresets?: boolean;
  presetChips?: number[];
  showMaxButton?: boolean;
  theme?: 'amber' | 'emerald' | 'blue';
  className?: string;
  id?: string;
  name?: string;
}

export const BeautifulNumberInput: React.FC<BeautifulNumberInputProps> = ({
  value,
  onChange,
  label,
  helperLabel,
  placeholder = 'e.g. 500,000 or 500k',
  min = 0,
  max,
  step = 10000,
  required = false,
  disabled = false,
  autoFocus = false,
  showKBadge = true,
  showPresets = true,
  presetChips,
  showMaxButton = true,
  theme = 'amber',
  className = '',
  id,
  name,
}) => {
  // Local display text to allow users to type freely ("500k", "1,600k", etc.)
  const numericVal = typeof value === 'number' ? value : parseAmountWithK(value);
  const [displayText, setDisplayText] = useState<string>(() => {
    if (value === '' || value === undefined || value === null) return '';
    if (typeof value === 'number') {
      return value === 0 ? '' : value.toLocaleString('en-US');
    }
    return String(value);
  });

  // Keep display text in sync when external numeric value changes significantly
  useEffect(() => {
    if (value === '' || value === undefined || value === null) {
      if (displayText !== '') setDisplayText('');
      return;
    }
    const parsed = parseAmountWithK(displayText);
    if (parsed !== numericVal) {
      setDisplayText(numericVal === 0 ? '' : numericVal.toLocaleString('en-US'));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayText(raw);
    const parsed = parseAmountWithK(raw);
    onChange(parsed, raw);
  };

  const handleBlur = () => {
    // When leaving input, format cleanly if valid number
    const parsed = parseAmountWithK(displayText);
    if (!isNaN(parsed) && parsed > 0) {
      // Clamp to min/max if required
      let clamped = parsed;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      setDisplayText(clamped.toLocaleString('en-US'));
      onChange(clamped, clamped.toString());
    } else if (displayText.trim() === '') {
      setDisplayText('');
      onChange(0, '');
    }
  };

  const handleClear = () => {
    setDisplayText('');
    onChange(0, '');
  };

  const applyIncrement = (delta: number) => {
    const current = parseAmountWithK(displayText);
    let next = (current || 0) + delta;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    setDisplayText(next.toLocaleString('en-US'));
    onChange(next, next.toString());
  };

  const applyPreset = (amount: number) => {
    let next = amount;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    setDisplayText(next.toLocaleString('en-US'));
    onChange(next, next.toString());
  };

  // Color schemes
  const colorThemes = {
    amber: {
      borderFocus: 'focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      textAccent: 'text-amber-400',
      chipHover: 'hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-amber-300',
      activeChip: 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold',
    },
    emerald: {
      borderFocus: 'focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      textAccent: 'text-emerald-400',
      chipHover: 'hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-300',
      activeChip: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold',
    },
    blue: {
      borderFocus: 'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
      badgeBg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
      textAccent: 'text-blue-400',
      chipHover: 'hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300',
      activeChip: 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-bold',
    },
  };

  const themeStyle = colorThemes[theme] || colorThemes.amber;

  // Default presets if none provided: tailored for Lao Kip (100K, 200K, 500K, 1,000K, 1,600K)
  const defaultPresets = presetChips || [100000, 200000, 500000, 1000000, 1600000];

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Top Label & Helper */}
      {(label || helperLabel) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <label htmlFor={id} className="text-slate-300 font-medium flex items-center gap-1.5">
              <span>{label}</span>
              {required && <span className="text-red-400">*</span>}
            </label>
          )}
          {helperLabel && (
            <span className="text-[10px] text-slate-400 font-mono">
              {helperLabel}
            </span>
          )}
        </div>
      )}

      {/* Main Beautiful Input Box */}
      <div
        className={`relative flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl transition-all shadow-inner overflow-hidden ${themeStyle.borderFocus} ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {/* Left Currency Symbol & Tag */}
        <div className="flex items-center gap-1 pl-3.5 pr-2 py-3 border-r border-slate-800 text-slate-400 select-none shrink-0 bg-slate-950/40">
          <span className="text-sm font-black text-amber-400 font-mono">₭</span>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">KIP</span>
        </div>

        {/* Input Field */}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="text"
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={displayText}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-full bg-transparent px-3 py-3 text-white font-mono text-sm sm:text-base font-bold placeholder:text-slate-500 placeholder:text-xs placeholder:font-normal focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {/* Right Section: Compact 'K' badge & Clear Button */}
        <div className="flex items-center gap-1.5 pr-3 shrink-0">
          {/* Live 'use K' compact badge */}
          {showKBadge && numericVal > 0 && (
            <div
              className={`px-2 py-0.5 rounded-full border text-[11px] font-mono font-bold select-none transition-all flex items-center gap-1 ${themeStyle.badgeBg}`}
              title="Compact K representation"
            >
              <Sparkles className="w-2.5 h-2.5 opacity-70" />
              <span>{formatLakCompact(numericVal)}</span>
            </div>
          )}

          {/* Clear Button */}
          {displayText && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Helper Bar & Live Reading */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
        {numericVal > 0 ? (
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[10px] text-slate-500">Live:</span>
            <span className="font-mono font-bold text-emerald-400">{formatLak(numericVal)}</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-amber-300 font-semibold">{formatLakCompact(numericVal)}</span>
          </div>
        ) : (
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <span>Tip: type <strong>"500k"</strong> or <strong>"1.6m"</strong> directly</span>
          </div>
        )}

        {/* Min / Max Info */}
        <div className="text-[10px] text-slate-500 font-mono ml-auto">
          {min > 0 && <span>Min: {formatLakCompact(min)}</span>}
          {min > 0 && max !== undefined && <span> • </span>}
          {max !== undefined && <span>Max: {formatLakCompact(max)}</span>}
        </div>
      </div>

      {/* Quick "Use K" Preset Chips */}
      {showPresets && !disabled && (
        <div className="pt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-0.5">
            Quick K:
          </span>

          {/* Quick preset chips */}
          {defaultPresets.map(preset => {
            const isSelected = numericVal === preset;
            const chipLabel = formatLakCompact(preset, { showSymbol: false }) + ' ₭';
            return (
              <button
                key={preset}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                  isSelected
                    ? themeStyle.activeChip
                    : `bg-slate-800/80 border-slate-700/70 text-slate-300 ${themeStyle.chipHover}`
                }`}
              >
                {chipLabel}
              </button>
            );
          })}

          {/* Max Button */}
          {showMaxButton && max !== undefined && max > 0 && (
            <button
              type="button"
              onClick={() => applyPreset(max)}
              className="px-2 py-0.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-[10px] font-mono transition-all cursor-pointer flex items-center gap-0.5"
            >
              <span>MAX</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          )}

          {/* Quick Increments */}
          <button
            type="button"
            onClick={() => applyIncrement(100000)}
            className="px-1.5 py-0.5 rounded-lg border border-slate-700/60 bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors flex items-center gap-0.5"
            title="Add 100,000 LAK (+100K)"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>100K</span>
          </button>
          <button
            type="button"
            onClick={() => applyIncrement(500000)}
            className="px-1.5 py-0.5 rounded-lg border border-slate-700/60 bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors flex items-center gap-0.5"
            title="Add 500,000 LAK (+500K)"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>500K</span>
          </button>
        </div>
      )}
    </div>
  );
};
