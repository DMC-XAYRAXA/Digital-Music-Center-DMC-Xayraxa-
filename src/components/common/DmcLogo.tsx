import React, { useEffect } from 'react';

const CUSTOM_LOGO_STORAGE_KEY = 'dmc_rev26_official_custom_logo_v1';

export const DMC_OFFICIAL_LOGO_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <radialGradient id="dmcYellowBg" cx="50%" cy="48%" r="70%">
      <stop offset="0%" stop-color="#FFF700" />
      <stop offset="75%" stop-color="#FFEA00" />
      <stop offset="100%" stop-color="#F5D800" />
    </radialGradient>
    <linearGradient id="dmcRedSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF2E2E" />
      <stop offset="45%" stop-color="#E60000" />
      <stop offset="85%" stop-color="#B80000" />
      <stop offset="100%" stop-color="#800000" />
    </linearGradient>
    <linearGradient id="dmcRedR" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FF3333" />
      <stop offset="40%" stop-color="#E60000" />
      <stop offset="85%" stop-color="#B30000" />
      <stop offset="100%" stop-color="#7A0000" />
    </linearGradient>
    <linearGradient id="dmcBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00B4FF" />
      <stop offset="48%" stop-color="#0062CC" />
      <stop offset="100%" stop-color="#002366" />
    </linearGradient>
    <linearGradient id="dmcGreenBar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1ED740" />
      <stop offset="55%" stop-color="#009E24" />
      <stop offset="100%" stop-color="#006816" />
    </linearGradient>
    <filter id="dmcDropShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="1.2" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- 1. Vibrant Yellow Background -->
  <rect width="240" height="240" fill="url(#dmcYellowBg)" />

  <!-- 2. Outer Black Crescent Swoosh (Bottom-Left to Right-Lower) -->
  <path
    d="M 41 181 C 48 228, 108 232, 156 196 C 185 174, 206 146, 214 123 C 201 149, 178 175, 148 193 C 102 220, 52 214, 41 181 Z"
    fill="#141414"
  />

  <!-- 3. Outer Right Red Crescent sweeping down under Green Bar & Lao text to Bottom-Left -->
  <path
    d="M 42 143 C 33 196, 86 226, 145 196 C 185 175, 214 132, 221 76 C 214 121, 187 161, 146 181 C 92 206, 46 184, 42 143 Z"
    fill="url(#dmcRedSwoosh)"
  />

  <!-- 4. Main Upper-Right 3D Red Swoosh (Starting at top-left of R, arcing over DMC, tapering right of R) -->
  <path
    d="M 70 80 C 110 29, 179 12, 203 44 C 223 70, 206 126, 162 158 C 190 123, 201 77, 184 53 C 164 26, 111 42, 74 82 Z"
    fill="url(#dmcRedSwoosh)"
    filter="url(#dmcDropShadow)"
  />

  <!-- 5. Inner Thin Red Swoosh Highlight line above R -->
  <path
    d="M 81 80 C 112 46, 155 36, 178 52 C 155 42, 115 52, 84 82 Z"
    fill="#CC0000"
  />

  <!-- 6. Bold Italic Cyan-to-Navy Blue "DMC" (Above right curve of R) -->
  <text
    x="154"
    y="74"
    text-anchor="middle"
    fill="url(#dmcBlueGrad)"
    stroke="#001B4D"
    stroke-width="0.8"
    font-family="'Arial Black', Impact, sans-serif"
    font-weight="900"
    font-style="italic"
    font-size="29"
    letter-spacing="0.5"
    filter="url(#dmcDropShadow)"
  >DMC</text>

  <!-- 7. Giant 3D Bevelled Red Serif "R" -->
  <g filter="url(#dmcDropShadow)">
    <text
      x="112"
      y="163"
      text-anchor="middle"
      fill="url(#dmcRedR)"
      stroke="#800000"
      stroke-width="1.5"
      font-family="Georgia, 'Times New Roman', Times, serif"
      font-weight="bold"
      font-size="122"
      letter-spacing="-2"
    >R</text>
  </g>

  <!-- 8. 3D Emerald Green Horizontal Bar under the "R" -->
  <rect
    x="58"
    y="171"
    width="152"
    height="10.5"
    rx="1"
    fill="url(#dmcGreenBar)"
    stroke="#004D10"
    stroke-width="0.8"
    filter="url(#dmcDropShadow)"
  />

  <!-- 9. Bold Black Lao Script "ໄຊລາຊາ" below the Green Bar -->
  <text
    x="95"
    y="192"
    text-anchor="middle"
    fill="#09090B"
    font-family="'Noto Sans Lao', 'Phetsarath OT', sans-serif"
    font-weight="900"
    font-size="15.5"
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
 * Renders the exact official DMC R (ໄຊລາຊາ) emblem:
 * - Vibrant Yellow background (#FFEA00)
 * - Dynamic Red & Black sweeping swooshes wrapping around the right and bottom
 * - Giant 3D bevelled Red Serif "R"
 * - Bold Italic Cyan-to-Navy Blue "DMC" above the right shoulder of the "R"
 * - Horizontal 3D Emerald Green bar below the "R"
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
          <radialGradient id="dmcYellowBgReact" cx="50%" cy="48%" r="70%">
            <stop offset="0%" stopColor="#FFF700" />
            <stop offset="75%" stopColor="#FFEA00" />
            <stop offset="100%" stopColor="#F5D800" />
          </radialGradient>

          <linearGradient id="dmcRedSwooshReact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF2E2E" />
            <stop offset="45%" stopColor="#E60000" />
            <stop offset="85%" stopColor="#B80000" />
            <stop offset="100%" stopColor="#800000" />
          </linearGradient>

          <linearGradient id="dmcRedRReact" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FF3333" />
            <stop offset="40%" stopColor="#E60000" />
            <stop offset="85%" stopColor="#B30000" />
            <stop offset="100%" stopColor="#7A0000" />
          </linearGradient>

          <linearGradient id="dmcBlueGradReact" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00B4FF" />
            <stop offset="48%" stopColor="#0062CC" />
            <stop offset="100%" stopColor="#002366" />
          </linearGradient>

          <linearGradient id="dmcGreenBarReact" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1ED740" />
            <stop offset="55%" stopColor="#009E24" />
            <stop offset="100%" stopColor="#006816" />
          </linearGradient>

          <filter id="dmcDropShadowReact" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="1.2" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Yellow Background */}
        <rect width="240" height="240" fill="url(#dmcYellowBgReact)" />

        {/* 2. Outer Black Crescent Swoosh */}
        <path
          d="M 41 181 C 48 228, 108 232, 156 196 C 185 174, 206 146, 214 123 C 201 149, 178 175, 148 193 C 102 220, 52 214, 41 181 Z"
          fill="#141414"
        />

        {/* 3. Lower & Right Sweeping Red Crescent */}
        <path
          d="M 42 143 C 33 196, 86 226, 145 196 C 185 175, 214 132, 221 76 C 214 121, 187 161, 146 181 C 92 206, 46 184, 42 143 Z"
          fill="url(#dmcRedSwooshReact)"
        />

        {/* 4. Main Upper-Right Sweeping Red Swoosh */}
        <path
          d="M 70 80 C 110 29, 179 12, 203 44 C 223 70, 206 126, 162 158 C 190 123, 201 77, 184 53 C 164 26, 111 42, 74 82 Z"
          fill="url(#dmcRedSwooshReact)"
          filter="url(#dmcDropShadowReact)"
        />

        {/* 5. Inner Thin Red Swoosh Highlight line */}
        <path
          d="M 81 80 C 112 46, 155 36, 178 52 C 155 42, 115 52, 84 82 Z"
          fill="#CC0000"
        />

        {/* 6. Cyan-to-Navy Blue "DMC" Text above the right shoulder of the R */}
        <text
          x="154"
          y="74"
          textAnchor="middle"
          fill="url(#dmcBlueGradReact)"
          stroke="#001B4D"
          strokeWidth="0.8"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="29"
          letterSpacing="0.5"
          filter="url(#dmcDropShadowReact)"
        >
          DMC
        </text>

        {/* 7. Giant Bold Red Serif "R" */}
        <g filter="url(#dmcDropShadowReact)">
          <text
            x="112"
            y="163"
            textAnchor="middle"
            fill="url(#dmcRedRReact)"
            stroke="#800000"
            strokeWidth="1.5"
            fontFamily="Georgia, 'Times New Roman', Times, serif"
            fontWeight="bold"
            fontSize="122"
            letterSpacing="-2"
          >
            R
          </text>
        </g>

        {/* 8. Emerald Green Horizontal Bar under the "R" */}
        <rect
          x="58"
          y="171"
          width="152"
          height="10.5"
          rx="1"
          fill="url(#dmcGreenBarReact)"
          stroke="#004D10"
          strokeWidth="0.8"
          filter="url(#dmcDropShadowReact)"
        />

        {/* 9. Bold Black Lao Script "ໄຊລາຊາ" below the Green Bar */}
        <text
          x="95"
          y="192"
          textAnchor="middle"
          fill="#09090B"
          fontFamily="'Noto Sans Lao', Phetsarath OT, sans-serif"
          fontWeight="900"
          fontSize="15.5"
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
 * Used for the 1920x1357 High-Resolution Certificate PNG Generator & Company Profile PDFs
 */
export function drawDmcOfficialLogoOnCanvas(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  options?: { withGoldFrame?: boolean; alpha?: number; shape?: 'circle' | 'roundedSquare' }
) {
  ctx.save();
  if (options?.alpha !== undefined) {
    ctx.globalAlpha = options.alpha;
  }

  const scale = (radius * 2) / 240;
  const shape = options?.shape || 'circle';

  // Optional outer 24K Gold Ring / Frame
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
    if (shape === 'roundedSquare') {
      const pad = 6 * scale;
      const x = centerX - radius - pad;
      const y = centerY - radius - pad;
      const w = (radius + pad) * 2;
      const h = w;
      const r = 28 * scale;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    } else {
      ctx.arc(centerX, centerY, radius + 6 * scale, 0, Math.PI * 2);
    }
    ctx.fillStyle = ringGrad;
    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();
  }

  // Clip to shape
  ctx.beginPath();
  if (shape === 'roundedSquare') {
    const x = centerX - radius;
    const y = centerY - radius;
    const w = radius * 2;
    const h = w;
    const r = 24 * scale;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  } else {
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  }
  ctx.clip();

  // Translate & scale to 240x240 coordinate space
  ctx.translate(centerX - radius, centerY - radius);
  ctx.scale(scale, scale);

  // 1. Vibrant Yellow Background
  const bgGrad = ctx.createRadialGradient(120, 115, 10, 120, 120, 165);
  bgGrad.addColorStop(0, '#FFF700');
  bgGrad.addColorStop(0.75, '#FFEA00');
  bgGrad.addColorStop(1, '#F5D800');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 240, 240);

  // 2. Outer Black Crescent Swoosh
  ctx.beginPath();
  ctx.moveTo(41, 181);
  ctx.bezierCurveTo(48, 228, 108, 232, 156, 196);
  ctx.bezierCurveTo(185, 174, 206, 146, 214, 123);
  ctx.bezierCurveTo(201, 149, 178, 175, 148, 193);
  ctx.bezierCurveTo(102, 220, 52, 214, 41, 181);
  ctx.closePath();
  ctx.fillStyle = '#141414';
  ctx.fill();

  // 3. Red Gradient for Swoosh & R
  const redGrad = ctx.createLinearGradient(40, 20, 200, 200);
  redGrad.addColorStop(0, '#FF2E2E');
  redGrad.addColorStop(0.45, '#E60000');
  redGrad.addColorStop(0.85, '#B80000');
  redGrad.addColorStop(1, '#800000');

  // Lower & Right Sweeping Red Crescent
  ctx.beginPath();
  ctx.moveTo(42, 143);
  ctx.bezierCurveTo(33, 196, 86, 226, 145, 196);
  ctx.bezierCurveTo(185, 175, 214, 132, 221, 76);
  ctx.bezierCurveTo(214, 121, 187, 161, 146, 181);
  ctx.bezierCurveTo(92, 206, 46, 184, 42, 143);
  ctx.closePath();
  ctx.fillStyle = redGrad;
  ctx.fill();

  // Main Upper-Right Sweeping Red Swoosh
  ctx.beginPath();
  ctx.moveTo(70, 80);
  ctx.bezierCurveTo(110, 29, 179, 12, 203, 44);
  ctx.bezierCurveTo(223, 70, 206, 126, 162, 158);
  ctx.bezierCurveTo(190, 123, 201, 77, 184, 53);
  ctx.bezierCurveTo(164, 26, 111, 42, 74, 82);
  ctx.closePath();
  ctx.fillStyle = redGrad;
  ctx.fill();

  // Inner Thin Red Swoosh Highlight
  ctx.beginPath();
  ctx.moveTo(81, 80);
  ctx.bezierCurveTo(112, 46, 155, 36, 178, 52);
  ctx.bezierCurveTo(155, 42, 115, 52, 84, 82);
  ctx.closePath();
  ctx.fillStyle = '#CC0000';
  ctx.fill();

  // 4. Cyan-to-Navy Blue "DMC"
  ctx.save();
  const blueGrad = ctx.createLinearGradient(154, 46, 154, 78);
  blueGrad.addColorStop(0, '#00B4FF');
  blueGrad.addColorStop(0.5, '#0062CC');
  blueGrad.addColorStop(1, '#002366');
  ctx.fillStyle = blueGrad;
  ctx.strokeStyle = '#001B4D';
  ctx.lineWidth = 1;
  ctx.font = 'italic 900 29px "Arial Black", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.32)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.fillText('DMC', 154, 74);
  ctx.strokeText('DMC', 154, 74);
  ctx.restore();

  // 5. Giant Bold Red Serif "R"
  ctx.save();
  ctx.fillStyle = redGrad;
  ctx.strokeStyle = '#7A0000';
  ctx.lineWidth = 2;
  ctx.font = 'bold 122px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.38)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillText('R', 112, 163);
  ctx.strokeText('R', 112, 163);
  ctx.restore();

  // 6. Emerald Green Horizontal Bar
  ctx.save();
  const greenGrad = ctx.createLinearGradient(58, 171, 58, 182);
  greenGrad.addColorStop(0, '#1ED740');
  greenGrad.addColorStop(0.55, '#009E24');
  greenGrad.addColorStop(1, '#006816');
  ctx.fillStyle = greenGrad;
  ctx.fillRect(58, 171, 152, 10.5);
  ctx.strokeStyle = '#004D10';
  ctx.lineWidth = 1;
  ctx.strokeRect(58, 171, 152, 10.5);
  ctx.restore();

  // 7. Bold Black Lao Script "ໄຊລາຊາ"
  ctx.save();
  ctx.fillStyle = '#09090B';
  ctx.font = '900 15.5px "Noto Sans Lao", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('ໄຊລາຊາ', 95, 192);
  ctx.restore();

  ctx.restore();
}
