import React from 'react';

interface DmcOfficialLogoProps {
  className?: string;
  size?: number;
  rounded?: 'full' | '2xl' | 'xl' | 'none';
  withGoldRing?: boolean;
}

/**
 * Official DMC Xayraxa (ໄຊລາຊາ) Logo Component
 * Recreates the exact official emblem:
 * - Vibrant Yellow background (#FFEE00)
 * - Dynamic Red & Black sweeping swooshes wrapping around the right and bottom
 * - Giant 3D bevelled Red Serif "R" in the center
 * - Bold Italic Royal Blue "DMC" above the right arm of the "R"
 * - Horizontal Emerald Green bar below the "R"
 * - Bold Black Lao script "ໄຊລາຊາ" underneath the green bar
 */
export const DmcOfficialLogo: React.FC<DmcOfficialLogoProps> = ({
  className = '',
  size = 80,
  rounded = 'full',
  withGoldRing = true,
}) => {
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
      className={`relative inline-flex items-center justify-center select-none overflow-hidden ${radiusClass} ${
        withGoldRing
          ? 'p-1 bg-gradient-to-tr from-amber-700 via-yellow-300 to-amber-500 shadow-xl'
          : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 240 240"
        className={`w-full h-full ${radiusClass}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Vibrant Yellow Background Gradient */}
          <radialGradient id="dmcYellowBg" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#FFF700" />
            <stop offset="70%" stopColor="#FFEE00" />
            <stop offset="100%" stopColor="#F5D000" />
          </radialGradient>

          {/* 3D Red Gradient for the giant Serif "R" and Main Swoosh */}
          <linearGradient id="dmcRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1E1E" />
            <stop offset="45%" stopColor="#E60000" />
            <stop offset="85%" stopColor="#B80000" />
            <stop offset="100%" stopColor="#8A0000" />
          </linearGradient>

          {/* Royal Blue Gradient for "DMC" */}
          <linearGradient id="dmcBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E60FF" />
            <stop offset="50%" stopColor="#0C4BB2" />
            <stop offset="100%" stopColor="#062B73" />
          </linearGradient>

          {/* Emerald Green Gradient for the horizontal bar */}
          <linearGradient id="dmcGreenBar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Subtle Drop Shadow for 3D embossed look */}
          <filter id="dmcDropShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Yellow Background */}
        <rect width="240" height="240" fill="url(#dmcYellowBg)" />

        {/* 2. Outer Black Crescent Swoosh (Bottom-Left to Right-Middle) */}
        <path
          d="M 40 165 C 32 215, 95 232, 148 205 C 188 184, 214 142, 220 105 C 210 142, 182 178, 142 196 C 95 218, 44 202, 40 165 Z"
          fill="#111111"
        />

        {/* 3. Secondary Red Outer Ribbon Accent on Right */}
        <path
          d="M 222 75 C 225 122, 198 168, 156 192 C 188 164, 212 122, 215 80 Z"
          fill="url(#dmcRedGrad)"
        />

        {/* 4. Main Sweeping Red Swoosh (Top-Left over Top-Right down to Bottom-Left) */}
        <path
          d="M 70 80 C 105 32, 175 12, 202 45 C 224 72, 210 132, 170 168 C 194 130, 200 80, 180 56 C 158 30, 106 46, 74 82 Z"
          fill="url(#dmcRedGrad)"
          filter="url(#dmcDropShadow)"
        />

        {/* Lower Sweeping Red Crescent (Bottom-Left cradling the Green Bar & Lao text) */}
        <path
          d="M 45 140 C 35 188, 88 220, 146 195 C 178 180, 202 152, 212 122 C 196 148, 172 170, 142 182 C 92 200, 48 178, 45 140 Z"
          fill="url(#dmcRedGrad)"
        />

        {/* Inner Thin Red Swoosh Highlight line */}
        <path
          d="M 78 82 C 108 48, 152 36, 174 54 C 152 44, 112 54, 82 84 Z"
          fill="#B91C1C"
        />

        {/* 5. Royal Blue "DMC" Text above the R */}
        <text
          x="152"
          y="75"
          textAnchor="middle"
          fill="url(#dmcBlueGrad)"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="31"
          letterSpacing="1"
          filter="url(#dmcDropShadow)"
        >
          DMC
        </text>

        {/* 6. Giant Bold Red Serif "R" */}
        <g filter="url(#dmcDropShadow)">
          <text
            x="112"
            y="164"
            textAnchor="middle"
            fill="url(#dmcRedGrad)"
            stroke="#7F1D1D"
            strokeWidth="1.5"
            fontFamily="Georgia, 'Times New Roman', Times, serif"
            fontWeight="bold"
            fontSize="126"
             letterSpacing="-2"
          >
            R
          </text>
        </g>

        {/* 7. Emerald Green Horizontal Bar under the "R" */}
        <rect
          x="56"
          y="172"
          width="148"
          height="9"
          rx="1.5"
          fill="url(#dmcGreenBar)"
          stroke="#064E3B"
          strokeWidth="0.8"
          filter="url(#dmcDropShadow)"
        />

        {/* 8. Bold Black Lao Script "ໄຊລາຊາ" below the Green Bar */}
        <text
          x="96"
          y="194"
          textAnchor="middle"
          fill="#09090B"
          fontFamily="'Noto Sans Lao', Phetsarath OT, sans-serif"
          fontWeight="900"
          fontSize="15.5"
          letterSpacing="1.5"
        >
          ໄຊລາຊາ
        </text>
      </svg>
    </div>
  );
};

/**
 * Helper to draw the exact Official DMC R (ໄຊລາຊາ) Logo onto an HTML5 2D Canvas
 * Used for the 1920x1357 High-Resolution Certificate PNG Generator
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
  bgGrad.addColorStop(0, '#FFF700');
  bgGrad.addColorStop(0.7, '#FFEE00');
  bgGrad.addColorStop(1, '#F5D000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 240, 240);

  // 2. Outer Black Crescent Swoosh
  ctx.beginPath();
  ctx.moveTo(40, 165);
  ctx.bezierCurveTo(32, 215, 95, 232, 148, 205);
  ctx.bezierCurveTo(188, 184, 214, 142, 220, 105);
  ctx.bezierCurveTo(210, 142, 182, 178, 142, 196);
  ctx.bezierCurveTo(95, 218, 44, 202, 40, 165);
  ctx.closePath();
  ctx.fillStyle = '#111111';
  ctx.fill();

  // 3. Red Gradient for Swoosh & R
  const redGrad = ctx.createLinearGradient(40, 20, 200, 200);
  redGrad.addColorStop(0, '#FF1E1E');
  redGrad.addColorStop(0.5, '#E60000');
  redGrad.addColorStop(1, '#990000');

  // Top-Right Sweeping Red Swoosh
  ctx.beginPath();
  ctx.moveTo(70, 80);
  ctx.bezierCurveTo(105, 32, 175, 12, 202, 45);
  ctx.bezierCurveTo(224, 72, 210, 132, 170, 168);
  ctx.bezierCurveTo(194, 130, 200, 80, 180, 56);
  ctx.bezierCurveTo(158, 30, 106, 46, 74, 82);
  ctx.closePath();
  ctx.fillStyle = redGrad;
  ctx.fill();

  // Lower Sweeping Red Crescent
  ctx.beginPath();
  ctx.moveTo(45, 140);
  ctx.bezierCurveTo(35, 188, 88, 220, 146, 195);
  ctx.bezierCurveTo(178, 180, 202, 152, 212, 122);
  ctx.bezierCurveTo(196, 148, 172, 170, 142, 182);
  ctx.bezierCurveTo(92, 200, 48, 178, 45, 140);
  ctx.closePath();
  ctx.fillStyle = redGrad;
  ctx.fill();

  // 4. Royal Blue "DMC"
  ctx.save();
  ctx.fillStyle = '#0C4BB2';
  ctx.font = 'italic 900 30px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.fillText('DMC', 152, 75);
  ctx.restore();

  // 5. Giant Bold Red Serif "R"
  ctx.save();
  ctx.fillStyle = redGrad;
  ctx.strokeStyle = '#7F1D1D';
  ctx.lineWidth = 2;
  ctx.font = 'bold 124px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillText('R', 112, 164);
  ctx.strokeText('R', 112, 164);
  ctx.restore();

  // 6. Emerald Green Horizontal Bar
  ctx.save();
  const greenGrad = ctx.createLinearGradient(56, 172, 204, 172);
  greenGrad.addColorStop(0, '#059669');
  greenGrad.addColorStop(0.5, '#16A34A');
  greenGrad.addColorStop(1, '#047857');
  ctx.fillStyle = greenGrad;
  ctx.fillRect(56, 172, 148, 9);
  ctx.strokeStyle = '#064E3B';
  ctx.lineWidth = 1;
  ctx.strokeRect(56, 172, 148, 9);
  ctx.restore();

  // 7. Bold Black Lao Script "ໄຊລາຊາ"
  ctx.save();
  ctx.fillStyle = '#09090B';
  ctx.font = '900 16px "Noto Sans Lao", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ໄຊລາຊາ', 98, 194);
  ctx.restore();

  ctx.restore();
}
