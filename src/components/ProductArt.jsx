/**
 * Product imagery, drawn as inline SVG.
 *
 * A storefront demo normally leans on remote photo URLs, which break the moment
 * the host is offline or the CDN is blocked. These render from the bundle, so
 * the catalog always looks right — swap in <img src={product.imageUrl}> once the
 * backend serves real photography.
 */

const GLYPHS = {
  headphones: (
    <>
      <path d="M52 108v-8a48 48 0 0 1 96 0v8" />
      <rect x="36" y="104" width="26" height="42" rx="12" />
      <rect x="138" y="104" width="26" height="42" rx="12" />
    </>
  ),
  earbuds: (
    <>
      <circle cx="74" cy="80" r="20" />
      <path d="M74 100v34a12 12 0 0 0 24 0" />
      <circle cx="130" cy="96" r="20" />
      <path d="M130 116v26" />
    </>
  ),
  speaker: (
    <>
      <rect x="62" y="42" width="76" height="116" rx="14" />
      <circle cx="100" cy="76" r="12" />
      <circle cx="100" cy="122" r="22" />
    </>
  ),
  watch: (
    <>
      <rect x="66" y="62" width="68" height="76" rx="18" />
      <path d="M82 62V42h36v20M82 138v20h36v-20" />
      <path d="M100 84v18l12 8" />
    </>
  ),
  band: (
    <>
      <rect x="76" y="52" width="48" height="96" rx="18" />
      <path d="M100 78v22M88 116h24" />
    </>
  ),
  keyboard: (
    <>
      <rect x="34" y="70" width="132" height="66" rx="10" />
      <path d="M52 90h12M76 90h12M100 90h12M124 90h12M52 112h96" />
    </>
  ),
  mouse: (
    <>
      <rect x="70" y="48" width="60" height="106" rx="30" />
      <path d="M100 48v34" />
    </>
  ),
  mic: (
    <>
      <rect x="80" y="38" width="40" height="66" rx="20" />
      <path d="M62 96a38 38 0 0 0 76 0M100 134v28M78 162h44" />
    </>
  ),
  monitor: (
    <>
      <rect x="34" y="48" width="132" height="82" rx="8" />
      <path d="M100 130v20M72 150h56" />
    </>
  ),
  ultrawide: (
    <>
      <path d="M26 62q74-16 148 0v58q-74 16-148 0z" />
      <path d="M100 136v18M74 154h52" />
    </>
  ),
  charger: (
    <>
      <rect x="60" y="52" width="80" height="80" rx="14" />
      <path d="M84 132v24M116 132v24M80 84h40M80 100h40" />
    </>
  ),
  battery: (
    <>
      <rect x="58" y="40" width="84" height="120" rx="14" />
      <path d="M84 30h32M78 118h44l-18 30" />
      <path d="M78 118 106 66" />
    </>
  ),
  stand: (
    <>
      <path d="M40 148h120M56 148 96 62h48l-38 86" />
      <path d="M76 106h56" />
    </>
  ),
  camera: (
    <>
      <rect x="40" y="66" width="120" height="70" rx="18" />
      <circle cx="100" cy="101" r="24" />
      <circle cx="100" cy="101" r="9" />
    </>
  ),
  dock: (
    <>
      <rect x="34" y="80" width="132" height="46" rx="12" />
      <path d="M56 96v14M80 96v14M104 96v14M128 96v14M146 96v14" />
    </>
  ),
  lamp: (
    <>
      <path d="M46 158h56M74 158V96M74 96 130 52" />
      <path d="M112 34h40l-14 40h-40z" />
    </>
  ),
  mat: (
    <>
      <rect x="26" y="66" width="148" height="70" rx="10" strokeDasharray="6 5" />
      <path d="M52 100h44M118 92h30" />
    </>
  ),
  headband: (
    <>
      <path d="M44 112a56 56 0 0 1 112 0" />
      <rect x="36" y="106" width="128" height="26" rx="13" />
    </>
  ),
}

export default function ProductArt({ art, alt = '', className = '' }) {
  const glyph = GLYPHS[art?.glyph] ?? GLYPHS.dock
  const gradientId = `grad-${art?.glyph ?? 'default'}-${art?.from?.slice(1) ?? '000'}`

  return (
    <svg
      className={`product-art ${className}`.trim()}
      viewBox="0 0 200 200"
      role="img"
      aria-label={alt}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={art?.from ?? '#64748b'} />
          <stop offset="100%" stopColor={art?.to ?? '#94a3b8'} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gradientId})`} />
      <circle cx="158" cy="44" r="58" fill="#fff" opacity="0.08" />
      <circle cx="40" cy="168" r="42" fill="#000" opacity="0.06" />
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      >
        {glyph}
      </g>
    </svg>
  )
}
