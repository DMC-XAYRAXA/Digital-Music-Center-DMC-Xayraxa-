import React, { useEffect } from 'react';

const CUSTOM_LOGO_STORAGE_KEY = 'dmc_rev26_official_custom_logo_v1';

export const DMC_OFFICIAL_LOGO_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <radialGradient id="dmcYellowBg" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#FFF91A" />
      <stop offset="68%" stop-color="#FFEE00" />
      <stop offset="100%" stop-color="#F5D000" />
    </radialGradient>
    <linearGradient id="dmcRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF2424" />
      <stop offset="48%" stop-color="#E60000" />
      <stop offset="85%" stop-color="#B80000" />
      <stop offset="100%" stop-color="#8A0000" />
    </linearGradient>
    <linearGradient id="dmcBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E64FF" />
      <stop offset="50%" stop-color="#0D47A1" />
      <stop offset="100%" stop-color="#062863" />
    </linearGradient>
    <linearGradient id="dmcGreenBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#15803D" />
      <stop offset="50%" stop-color="#16A34A" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <filter id="dmcDropShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.32" />
    </filter>
  </defs>

  <!-- 1. Vibrant Yellow Background -->
  <rect width="240" height="240" fill="url(#dmcYellowBg)" />

  <!-- 2. Outer Black Crescent Swoosh (Bottom-Left to Right-Middle) -->
  <path
    d="M 38 164 C 30 216, 96 234, 150 206 C 190 185, 215 142, 221 103 C 211 141, 183 178, 143 197 C 95 219, 43 202, 38 164 Z"
    fill="#111111"
  />

  <!-- 3. Secondary Red Outer Ribbon Accent on Right -->
  <path
    d="M 223 73 C 227 122, 199 169, 156 194 C 189 165, 213 122, 216 78 Z"
    fill="url(#dmcRedGrad)"
  />

  <!-- 4. Main Sweeping Red Swoosh (Arcing over DMC & wrapping right side) -->
  <path
    d="M 68 74 C 104 26, 178 10, 204 44 C 225 71, 211 133, 170 169 C 195 130, 201 79, 182 54 C 160 27, 105 42, 73 77 Z"
    fill="url(#dmcRedGrad)"
    filter="url(#dmcDropShadow)"
  />

  <!-- 5. Lower Sweeping Red Crescent (Cradling the Green Bar & Lao script) -->
  <path
    d="M 43 139 C 33 189, 88 221, 147 196 C 179 181, 203 152, 213 121 C 197 148, 173 171, 143 183 C 92 201, 47 178, 43 139 Z"
    fill="url(#dmcRedGrad)"
  />

  <!-- 6. Inner Thin Red Swoosh Highlight above DMC -->
  <path
    d="M 78 76 C 110 42, 156 32, 178 51 C 155 40, 114 49, 82 78 Z"
    fill="#B91C1C"
  />

  <!-- 7. Bold Italic Royal Blue "DMC" (Upper-Right of the R) -->
  <text
    x="156"
    y="74"
    text-anchor="middle"
    fill="url(#dmcBlueGrad)"
    stroke="#FFFFFF"
    stroke-width="0.6"
    font-family="'Arial Black', Impact, sans-serif"
    font-weight="900"
    font-style="italic"
    font-size="29"
    letter-spacing="0.8"
    filter="url(#dmcDropShadow)"
  >DMC</text>

  <!-- 8. Giant 3D Bevelled Red Serif "R" -->
  <g filter="url(#dmcDropShadow)">
    <text
      x="98"
      y="160"
      text-anchor="middle"
      fill="url(#dmcRedGrad)"
      stroke="#7F1D1D"
      stroke-width="1.5"
      font-family="Georgia, 'Times New Roman', Times, serif"
      font-weight="bold"
      font-size="118"
      letter-spacing="-2"
    >R</text>
  </g>

  <!-- 9. Emerald Green Horizontal Bar under the "R" -->
  <rect
    x="52"
    y="168"
    width="150"
    height="9.5"
    rx="1.5"
    fill="url(#dmcGreenBar)"
    stroke="#064E3B"
    stroke-width="0.9"
    filter="url(#dmcDropShadow)"
  />

  <!-- 10. Bold Black Lao Script "ໄຊລາຊາ" below the Green Bar -->
  <text
    x="100"
    y="191"
    text-anchor="middle"
    fill="#09090B"
    font-family="'Noto Sans Lao', 'Phetsarath OT', sans-serif"
    font-weight="900"
    font-size="16"
    letter-spacing="1.2"
  >ໄຊລາຊາ</text>
</svg>`;

export const DMC_OFFICIAL_LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  DMC_OFFICIAL_LOGO_SVG_STRING
)}`;

interface DmcOfficialLogoProps {
  className?: string;
  size?: number;
  rounded?: 'full' | '2xl' | 'xl' | 'none';
  withGoldRing?: boolean;
  onClick?: () => void;
  title?: string;
}

/**
 * Constant Official DMC Xayraxa (ໄຊລາຊາ) Logo Component
 * Always renders the exact official DMC R (ໄຊລາຊາ) emblem (never overwritten by user profile photos):
 * - Vibrant Yellow background (#FFEE00)
 * - Dynamic Red & Black sweeping swooshes wrapping around the right and bottom
 * - Giant 3D bevelled Red Serif "R"
 * - Bold Italic Royal Blue "DMC" above the right shoulder of the "R"
 * - Horizontal Emerald Green bar below the "R"
 * - Bold Black Lao script "ໄຊລາຊາ" underneath the green bar
 */
export const DmcOfficialLogo: React.FC<DmcOfficialLogoProps> = ({
  className = '',
  size = 80,
  rounded = 'full',
  withGoldRing = true,
  onClick,
  title,
}) => {
  // Ensure any previously stored custom override in localStorage is cleared so the Official Logo remains 100% constant
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const radiusClass =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === '2xl'
      ? 'rounded-2xl'
      : rounded === 'xl'
      ? 'rounded-xl'
      : '';

  return (
    <div
      onClick={onClick}
      title={title}
      className={`relative inline-flex items-center justify-center select-none overflow-hidden ${radiusClass} ${
        withGoldRing
          ? 'p-0.5 bg-gradient-to-tr from-amber-700 via-yellow-300 to-amber-500 shadow-xl'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <svg
        viewBox="0 0 240 240"
        className={`w-full h-full ${radiusClass}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Vibrant Yellow Background Gradient */}
          <radialGradient id="dmcYellowBgReact" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#FFF91A" />
            <stop offset="68%" stopColor="#FFEE00" />
            <stop offset="100%" stopColor="#F5D000" />
          </radialGradient>

          {/* 3D Red Gradient for the giant Serif "R" and Main Swoosh */}
          <linearGradient id="dmcRedGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF2424" />
            <stop offset="48%" stopColor="#E60000" />
            <stop offset="85%" stopColor="#B80000" />
            <stop offset="100%" stopColor="#8A0000" />
          </linearGradient>

          {/* Royal Blue Gradient for "DMC" */}
          <linearGradient id="dmcBlueGradReact" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E64FF" />
            <stop offset="50%" stopColor="#0D47A1" />
            <stop offset="100%" stopColor="#062863" />
          </linearGradient>

          {/* Emerald Green Gradient for the horizontal bar */}
          <linearGradient id="dmcGreenBarReact" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="50%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Subtle Drop Shadow for 3D embossed look */}
          <filter id="dmcDropShadowReact" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.32" />
          </filter>
        </defs>

        {/* 1. Yellow Background */}
        <rect width="240" height="240" fill="url(#dmcYellowBgReact)" />

        {/* 2. Outer Black Crescent Swoosh (Bottom-Left to Right-Middle) */}
        <path
          d="M 38 164 C 30 216, 96 234, 150 206 C 190 185, 215 142, 221 103 C 211 141, 183 178, 143 197 C 95 219, 43 202, 38 164 Z"
          fill="#111111"
        />

        {/* 3. Secondary Red Outer Ribbon Accent on Right */}
        <path
          d="M 223 73 C 227 122, 199 169, 156 194 C 189 165, 213 122, 216 78 Z"
          fill="url(#dmcRedGradReact)"
        />

        {/* 4. Main Sweeping Red Swoosh (Top-Left over Top-Right down to Bottom-Right) */}
        <path
          d="M 68 74 C 104 26, 178 10, 204 44 C 225 71, 211 133, 170 169 C 195 130, 201 79, 182 54 C 160 27, 105 42, 73 77 Z"
          fill="url(#dmcRedGradReact)"
          filter="url(#dmcDropShadowReact)"
        />

        {/* 5. Lower Sweeping Red Crescent (Bottom-Left cradling the Green Bar & Lao text) */}
        <path
          d="M 43 139 C 33 189, 88 221, 147 196 C 179 181, 203 152, 213 121 C 197 148, 173 171, 143 183 C 92 201, 47 178, 43 139 Z"
          fill="url(#dmcRedGradReact)"
        />

        {/* 6. Inner Thin Red Swoosh Highlight line */}
        <path
          d="M 78 76 C 110 42, 156 32, 178 51 C 155 40, 114 49, 82 78 Z"
          fill="#B91C1C"
        />

        {/* 7. Royal Blue "DMC" Text above the right shoulder of the R */}
        <text
          x="156"
          y="74"
          textAnchor="middle"
          fill="url(#dmcBlueGradReact)"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="29"
          letterSpacing="0.8"
          filter="url(#dmcDropShadowReact)"
        >
          DMC
        </text>

        {/* 8. Giant Bold Red Serif "R" */}
        <g filter="url(#dmcDropShadowReact)">
          <text
            x="98"
            y="160"
            textAnchor="middle"
            fill="url(#dmcRedGradReact)"
            stroke="#7F1D1D"
            strokeWidth="1.5"
            fontFamily="Georgia, 'Times New Roman', Times, serif"
            fontWeight="bold"
            fontSize="118"
            letterSpacing="-2"
          >
            R
          </text>
        </g>

        {/* 9. Emerald Green Horizontal Bar under the "R" */}
        <rect
          x="52"
          y="168"
          width="150"
          height="9.5"
          rx="1.5"
          fill="url(#dmcGreenBarReact)"
          stroke="#064E3B"
          strokeWidth="0.9"
          filter="url(#dmcDropShadowReact)"
        />

        {/* 10. Bold Black Lao Script "ໄຊລາຊາ" below the Green Bar */}
        <text
          x="100"
          y="191"
          textAnchor="middle"
          fill="#09090B"
          fontFamily="'Noto Sans Lao', Phetsarath OT, sans-serif"
          fontWeight="900"
          fontSize="16"
          letterSpacing="1.2"
        >
          ໄຊລາຊາ
        </text>
      </svg>
    </div>
  );
};

/**
 * Helper to draw the exact Official DMC R (ໄຊລາຊາ) Logo onto an HTML5 2D Canvas
 * Used for the 1920x1357 High-Resolution Certificate PNG Generator & PDFs
 */
export function drawDmcOfficialLogoOnCanvas(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  options?: { withGoldFrame?: boolean; alpha?: number }
) {
  ctx.save();
  if (options?.alpha !== undefined) {
    ctx.globalAlpha = options.alpha;
  }

  const scale = (radius * 2) / 240;

  // Optional outer 24K Gold Ring
  if (options?.withGoldFrame !== false) {
    const ringGrad = ctx.createLinearGradient(
      centerX - radius - 8,
      centerY - radius - 8,
      centerX + radius + 8,
      centerY + radius + 8
    );
    ringGrad.addColorStop(0, '#92400e');
    ringGrad.addColorStop(0.25, '#fde047');
    ringGrad.addColorStop(0.5, '#d97706');
    ringGrad.addColorStop(0.75, '#fef08a');
    ringGrad.addColorStop(1, '#78350f');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 6 * scale, 0, Math.PI * 2);
    ctx.fillStyle = ringGrad;
    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();
  }

  // Clip to circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // Translate & scale to 240x240 coordinate space
  ctx.translate(centerX - radius, centerY - radius);
  ctx.scale(scale, scale);

  // 1. Vibrant Yellow Background
  const bgGrad = ctx.createRadialGradient(120, 108, 10, 120, 120, 160);
  bgGrad.addColorStop(0, '#FFF91A');
  bgGrad.addColorStop(0.68, '#FFEE00');
  bgGrad.addColorStop(1, '#F5D000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 240, 240);

  // 2. Outer Black Crescent Swoosh
  ctx.beginPath();
  ctx.moveTo(38, 164);
  ctx.bezierCurveTo(30, 216, 96, 234, 150, 206);
  ctx.bezierCurveTo(190, 185, 215, 142, 221, 103);
  ctx.bezierCurveTo(211, 141, 183, 178, 143, 197);
  ctx.bezierCurveTo(95, 219, 43, 202, 38, 164);
  ctx.closePath();
  ctx.fillStyle = '#111111';
  ctx.fill();

  // 3. Red Gradient for Swoosh & R
  const redGrad = ctx.createLinearGradient(40, 20, 200, 200);
  redGrad.addColorStop(0, '#FF2424');
  redGrad.addColorStop(0.5, '#E60000');
  redGrad.addColorStop(1, '#990000');

  // Secondary Red Outer Ribbon on Right
  ctx.beginPath();
  ctx.moveTo(223, 73);
  ctx.bezierCurveTo(227, 122, 199, 169, 156, 194);
  ctx.bezierCurveTo(189, 165, 213, 122, 216, 78);
  ctx.closePath();
  ctx.fillStyle = redGrad;
  ctx.fill();

  // Top-Right Sweeping Red Swoosh
  ctx.beginPath();
  ctx.moveTo(68, 74);
  ctx.bezierCurveTo(104, 26, 178, 10, 204, 44);
  ctx.bezierCurveTo(225, 71, 211, 133, 170, 169);
  ctx.bezierCurveTo(195, 130, 201, 79, 182, 54);
  ctx.bezierCurveTo(160, 27, 105, 42, 73, 77);
  ctx.closePath();
  ctx.fillStyle = redGrad;
  ctx.fill();

  // Lower Sweeping Red Crescent
  ctx.beginPath();
  ctx.moveTo(43, 139);
  ctx.bezierCurveTo(33, 189, 88, 221, 147, 196);
  ctx.bezierCurveTo(179, 181, 203, 152, 213, 121);
  ctx.bezierCurveTo(197, 148, 173, 171, 143, 183);
  ctx.bezierCurveTo(92, 201, 47, 178, 43, 139);
  ctx.closePath();
  ctx.fillStyle = redGrad;
  ctx.fill();

  // 4. Royal Blue "DMC"
  ctx.save();
  ctx.fillStyle = '#0D47A1';
  ctx.font = 'italic 900 29px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.fillText('DMC', 156, 74);
  ctx.restore();

  // 5. Giant Bold Red Serif "R"
  ctx.save();
  ctx.fillStyle = redGrad;
  ctx.strokeStyle = '#7F1D1D';
  ctx.lineWidth = 2;
  ctx.font = 'bold 118px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillText('R', 98, 160);
  ctx.strokeText('R', 98, 160);
  ctx.restore();

  // 6. Emerald Green Horizontal Bar
  ctx.save();
  const greenGrad = ctx.createLinearGradient(52, 168, 202, 168);
  greenGrad.addColorStop(0, '#15803D');
  greenGrad.addColorStop(0.5, '#16A34A');
  greenGrad.addColorStop(1, '#047857');
  ctx.fillStyle = greenGrad;
  ctx.fillRect(52, 168, 150, 9.5);
  ctx.strokeStyle = '#064E3B';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 168, 150, 9.5);
  ctx.restore();

  // 7. Bold Black Lao Script "ໄຊລາຊາ"
  ctx.save();
  ctx.fillStyle = '#09090B';
  ctx.font = '900 16px "Noto Sans Lao", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ໄຊລາຊາ', 100, 191);
  ctx.restore();

  ctx.restore();
}
