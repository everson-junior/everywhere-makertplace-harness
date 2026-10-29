import { useId, useState } from 'react'

const REST_PATH = 'M8.844 13.742C8.967 12.328 8.45 10.4 8.45 9.65C8.45 8.94 8.88 8.43 9.6 8.43C11.285 8.43 12.106 8.281 12.685 8.104C13.71 7.791 14.585 6.768 15.055 5.945C15.137 5.803 14.99 5.641 14.829 5.671C13.829 5.86 12.828 5.376 11.827 4.978C10.659 4.514 9.491 4.707 8.935 4.876C8.805 4.915 8.658 4.819 8.636 4.686C8.468 3.643 7.405 2.615 5.498 2.238C4.54 2.048 3.748 1.574 3.347 1.202C3.252 1.113 3.088 1.125 3.03 1.242C2.628 2.059 2.168 3.82 5.248 6.115C5.82 6.494 6.31 6.785 6.574 7.637C6.72 8.104 6.157 9.168 6.061 9.368C5.157 11.27 5.089 12.19 4.926 13.742'
const FLOATING_HEART_PATH = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

function HeartArtwork({ size, className }: { size: number; className: string }) {
  const instanceId = useId()
  const gearId = `${instanceId}-gear`
  const heartMaskId = `${instanceId}-heart`
  const chatMaskId = `${instanceId}-chat`
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 800 800" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <g id={gearId}>
          <circle cx="0" cy="0" r="24" fill="none" stroke="currentColor" strokeWidth="14" />
          <g fill="currentColor">
            <rect x="-7" y="-38" width="14" height="16" rx="3" />
            <rect x="-7" y="22" width="14" height="16" rx="3" />
            <rect x="-38" y="-7" width="16" height="14" rx="3" />
            <rect x="22" y="-7" width="16" height="14" rx="3" />
            <rect x="-7" y="-38" width="14" height="16" rx="3" transform="rotate(45)" />
            <rect x="-7" y="22" width="14" height="16" rx="3" transform="rotate(45)" />
            <rect x="-38" y="-7" width="16" height="14" rx="3" transform="rotate(45)" />
            <rect x="22" y="-7" width="16" height="14" rx="3" transform="rotate(45)" />
          </g>
        </g>
        <mask id={heartMaskId}>
          <rect width="800" height="800" fill="white" />
          <g transform="translate(256, 312)">
            <circle cx="0" cy="0" r="44" fill="none" stroke="black" strokeWidth="20" />
            <circle cx="0" cy="0" r="16" fill="black" />
            <g fill="black">
              <rect x="-11" y="-68" width="22" height="24" rx="4" />
              <rect x="-11" y="44" width="22" height="24" rx="4" />
              <rect x="-68" y="-11" width="24" height="22" rx="4" />
              <rect x="44" y="-11" width="24" height="22" rx="4" />
              <rect x="-11" y="-68" width="22" height="24" rx="4" transform="rotate(45)" />
              <rect x="-11" y="44" width="22" height="24" rx="4" transform="rotate(45)" />
              <rect x="-68" y="-11" width="24" height="22" rx="4" transform="rotate(45)" />
              <rect x="44" y="-11" width="24" height="22" rx="4" transform="rotate(45)" />
            </g>
          </g>
          <g transform="translate(264, 458) scale(0.85)">
            <circle cx="0" cy="0" r="24" fill="none" stroke="black" strokeWidth="14" />
            <g fill="black">
              <rect x="-7" y="-38" width="14" height="16" rx="3" />
              <rect x="-7" y="22" width="14" height="16" rx="3" />
              <rect x="-38" y="-7" width="16" height="14" rx="3" />
              <rect x="22" y="-7" width="16" height="14" rx="3" />
              <rect x="-7" y="-38" width="14" height="16" rx="3" transform="rotate(45)" />
              <rect x="-7" y="22" width="14" height="16" rx="3" transform="rotate(45)" />
              <rect x="-38" y="-7" width="16" height="14" rx="3" transform="rotate(45)" />
              <rect x="22" y="-7" width="16" height="14" rx="3" transform="rotate(45)" />
            </g>
          </g>
          <polyline points="165,408 212,408" fill="none" stroke="black" strokeWidth="14" strokeLinecap="round" />
          <circle cx="228" cy="408" r="13" fill="none" stroke="black" strokeWidth="12" />
          <polyline points="242,408 282,408 298,395 322,395" fill="none" stroke="black" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="330,212 330,248" fill="none" stroke="black" strokeWidth="14" strokeLinecap="round" />
          <circle cx="330" cy="262" r="12" fill="none" stroke="black" strokeWidth="12" />
          <polyline points="342,265 365,288 365,328" fill="none" stroke="black" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="398" cy="395" r="88" fill="black" />
        </mask>
        <mask id={chatMaskId}>
          <rect width="800" height="800" fill="white" />
          <circle cx="558" cy="576" r="18" fill="black" />
          <circle cx="608" cy="576" r="18" fill="black" />
          <circle cx="658" cy="576" r="18" fill="black" />
        </mask>
      </defs>
      <g className="ewh-chat-orbit ewh-chat-orbit-1">
        <ellipse cx="398" cy="395" rx="310" ry="120" transform="rotate(30 398 395)" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="14 10" opacity="0.45" />
        <circle cx="666" cy="550" r="14" fill="currentColor" />
        <circle cx="130" cy="240" r="10" fill="currentColor" opacity="0.8" />
      </g>
      <g className="ewh-chat-orbit ewh-chat-orbit-2">
        <ellipse cx="398" cy="395" rx="305" ry="115" transform="rotate(-35 398 395)" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="16 12" opacity="0.4" />
        <circle cx="148" cy="570" r="13" fill="currentColor" />
        <circle cx="648" cy="220" r="11" fill="currentColor" opacity="0.85" />
      </g>
      <g className="ewh-chat-orbit ewh-chat-orbit-3">
        <ellipse cx="398" cy="395" rx="290" ry="110" transform="rotate(85 398 395)" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="12 8" opacity="0.35" />
        <circle cx="372" cy="106" r="12" fill="currentColor" />
        <circle cx="424" cy="684" r="12" fill="currentColor" opacity="0.9" />
      </g>
      <path d="M 398 265 C 365 190, 265 170, 200 225 C 130 285, 135 395, 255 528 L 345 452 L 398 395 Z" fill="currentColor" stroke="currentColor" strokeWidth="12" strokeLinejoin="round" mask={`url(#${heartMaskId})`} />
      <path d="M 398 265 C 430 195, 520 175, 588 210" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
      <path d="M 628 245 C 685 335, 650 455, 535 562 L 398 662 L 292 568" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="398" y1="470" x2="398" y2="652" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
      <line x1="360" y1="475" x2="360" y2="520" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
      <circle cx="360" cy="534" r="12" fill="none" stroke="currentColor" strokeWidth="10" />
      <line x1="360" y1="548" x2="360" y2="625" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
      <polyline points="315,530 315,585" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
      <line x1="434" y1="475" x2="434" y2="520" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
      <circle cx="434" cy="534" r="12" fill="none" stroke="currentColor" strokeWidth="10" />
      <line x1="434" y1="548" x2="434" y2="625" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
      <polyline points="472,600 472,532 490,515" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="455,212 455,268 428,302" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="494,200 494,250" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
      <circle cx="494" cy="264" r="13" fill="none" stroke="currentColor" strokeWidth="10" />
      <polyline points="484,274 452,315" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
      <circle cx="546" cy="242" r="16" fill="currentColor" />
      <polyline points="485,382 555,382 588,350" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="598" cy="340" r="12" fill="none" stroke="currentColor" strokeWidth="10" />
      <polyline points="485,416 595,416" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
      <circle cx="610" cy="416" r="13" fill="none" stroke="currentColor" strokeWidth="10" />
      <g transform="translate(508, 476) scale(1.08)">
        <use href={`#${gearId}`} />
      </g>
      <g transform="translate(398, 395)">
        <g fill="currentColor">
          <rect x="-15" y="-84" width="30" height="28" rx="5" />
          <rect x="-15" y="56" width="30" height="28" rx="5" />
          <rect x="-84" y="-15" width="28" height="30" rx="5" />
          <rect x="56" y="-15" width="28" height="30" rx="5" />
          <rect x="-15" y="-84" width="30" height="28" rx="5" transform="rotate(45)" />
          <rect x="-15" y="56" width="30" height="28" rx="5" transform="rotate(45)" />
          <rect x="-84" y="-15" width="28" height="30" rx="5" transform="rotate(45)" />
          <rect x="56" y="-15" width="28" height="30" rx="5" transform="rotate(45)" />
        </g>
        <circle cx="0" cy="0" r="62" fill="none" stroke="currentColor" strokeWidth="24" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="currentColor" strokeWidth="12" />
      </g>
      <path d="M 625 468 L 668 468 C 708 468, 730 495, 730 538 L 730 605 C 730 638, 708 658, 682 664 L 682 726 L 605 668 L 535 668 C 505 668, 482 648, 474 625 Z" fill="currentColor" stroke="currentColor" strokeWidth="12" strokeLinejoin="round" mask={`url(#${chatMaskId})`} />
    </svg>
  )
}

/**
 * Render the original hero artwork with a stationary hover target.
 * @param props - Requested size; the fork's 52px visual minimum is retained.
 * @returns Decorative hero mark and fine-pointer hover hearts.
 */
export function HeroMark({ size }: { size: number }) {
  const [hovering, setHovering] = useState(false)
  return (
    <span
      className="ewh-chat-hero"
      aria-hidden="true"
      data-hovered={hovering ? 'true' : 'false'}
      onPointerEnter={(event) => { setHovering(event.pointerType !== 'touch') }}
      onPointerLeave={() => { setHovering(false) }}
      onPointerCancel={() => { setHovering(false) }}
    >
      <HeartArtwork size={Math.max(52, size)} className="ewh-chat-hero-artwork" />
      <span className="ewh-chat-floating-hearts">
        <svg className="ewh-chat-floating-heart ewh-chat-floating-heart-1" viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d={FLOATING_HEART_PATH} /></svg>
        <svg className="ewh-chat-floating-heart ewh-chat-floating-heart-2" viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d={FLOATING_HEART_PATH} /></svg>
        <svg className="ewh-chat-floating-heart ewh-chat-floating-heart-3" viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d={FLOATING_HEART_PATH} /></svg>
      </span>
    </span>
  )
}

/**
 * Render the original sidebar circuit heart and orbit artwork.
 * @param props - Mark dimensions in CSS pixels.
 * @returns Decorative sidebar mark.
 */
export function SidebarMark({ size }: { size: number }) {
  return <HeartArtwork size={size} className="ewh-chat-sidebar-mark" />
}

/**
 * Render the official EVERYWHERE/HARNESS wordmark without its leading whale.
 * @returns Original brand artwork with the accessible locale-fallback brand name.
 */
export function BrandName() {
  const badgeClipId = `${useId()}-badge`
  return (
    <span className="ewh-chat-brand-name">
      <span className="ewh-chat-sr-only">EveryWhere Harness</span>
      <svg className="ewh-chat-wordmark" width="156" height="24" viewBox="26 0 156 24" fill="none" aria-hidden="true" focusable="false">
        <text x="26" y="16.1" fill="currentColor" fontFamily="var(--dsw-font-family-brand), 'Montserrat', sans-serif" fontWeight="700" fontSize="11.5px" letterSpacing="0.4px">EVERYWHERE</text>
        <rect x="129.348" y="5.5" width="52" height="14" rx="2" fill="currentColor" />
        <g clipPath={`url(#${badgeClipId})`} className="ewh-chat-wordmark-badge">
          <path d="M132.848 8.93205H134.08V16.137H132.848V8.93205ZM136.5 8.93205H137.732V16.137H136.5V8.93205ZM133.365 13.024V11.99H137.193V13.024H133.365Z" />
          <path d="M140.397 14.432L140.672 13.453H143.202L143.532 14.432H140.397ZM140.287 16.137H139.055L141.277 8.93205H142.201L142.146 9.74605L140.947 13.915H140.969L140.287 16.137ZM145.039 16.137H143.741L143.07 13.948L143.081 13.937L141.871 9.74605L141.926 8.93205H142.817L145.039 16.137Z" />
          <path d="M146.846 8.93205H149.068C149.852 8.93205 150.443 9.11538 150.839 9.48205C151.235 9.84138 151.433 10.3327 151.433 10.956C151.433 11.22 151.396 11.4657 151.323 11.693C151.249 11.9204 151.125 12.1257 150.949 12.309C150.773 12.4924 150.531 12.65 150.223 12.782C149.922 12.9067 149.541 13.0057 149.079 13.079V13.321H146.846V12.639L148.023 12.485C148.631 12.4044 149.09 12.298 149.398 12.166C149.706 12.034 149.915 11.8764 150.025 11.693C150.135 11.5024 150.19 11.2934 150.19 11.066C150.19 10.6994 150.083 10.417 149.871 10.219C149.658 10.021 149.324 9.92205 148.87 9.92205H146.846V8.93205ZM146.395 8.93205H147.627V16.137H146.395V8.93205ZM151.917 16.093V16.137H150.366L149.024 14.322C148.87 14.1094 148.73 13.9407 148.606 13.816C148.481 13.684 148.345 13.5887 148.199 13.53C148.052 13.464 147.872 13.42 147.66 13.398C147.447 13.3687 147.176 13.3504 146.846 13.343V13.145H149.079C149.233 13.211 149.368 13.2844 149.486 13.365C149.61 13.4457 149.735 13.5447 149.86 13.662C149.992 13.7794 150.138 13.937 150.3 14.135L151.917 16.093Z" />
          <path d="M153.58 9.57005L153.591 8.93205H154.46L157.584 15.51V16.137H156.704L153.58 9.57005ZM158.024 16.137H156.968L156.88 8.93205H158.024V16.137ZM154.24 16.137H153.096V8.93205H154.152L154.24 16.137Z" />
          <path d="M159.963 8.93205H161.206V16.137H159.963V8.93205ZM160.095 9.96605V8.93205H164.858V9.96605H160.095ZM160.095 16.137V15.103H164.902V16.137H160.095ZM160.095 13.013V11.99H164.374V13.013H160.095Z" />
          <path d="M169.052 15.257C169.543 15.257 169.895 15.1654 170.108 14.982C170.328 14.7987 170.438 14.5457 170.438 14.223C170.438 14.047 170.405 13.8967 170.339 13.772C170.273 13.6474 170.152 13.5337 169.976 13.431C169.807 13.321 169.558 13.2147 169.228 13.112L168.491 12.881C167.846 12.6757 167.38 12.4044 167.094 12.067C166.808 11.7297 166.665 11.3007 166.665 10.78C166.665 10.428 166.76 10.1017 166.951 9.80105C167.142 9.50038 167.428 9.25838 167.809 9.07505C168.19 8.89172 168.663 8.80005 169.228 8.80005C169.631 8.80005 169.998 8.82938 170.328 8.88805C170.665 8.93938 171.039 9.01638 171.45 9.11905L171.274 10.175C170.834 10.0504 170.442 9.96238 170.097 9.91105C169.76 9.85238 169.463 9.82305 169.206 9.82305C168.737 9.82305 168.403 9.90738 168.205 10.076C168.007 10.2374 167.908 10.439 167.908 10.681C167.908 10.857 167.941 11.0147 168.007 11.154C168.073 11.286 168.19 11.407 168.359 11.517C168.535 11.627 168.784 11.7334 169.107 11.836L169.866 12.078C170.526 12.276 170.995 12.5327 171.274 12.848C171.553 13.156 171.692 13.585 171.692 14.135C171.692 14.5604 171.589 14.9344 171.384 15.257C171.179 15.5797 170.878 15.8327 170.482 16.016C170.093 16.1994 169.609 16.291 169.03 16.291C168.627 16.291 168.212 16.247 167.787 16.159C167.362 16.071 166.9 15.9427 166.401 15.774L166.665 14.718C167.156 14.894 167.6 15.0297 167.996 15.125C168.399 15.213 168.751 15.257 169.052 15.257Z" />
          <path d="M175.809 15.257C176.3 15.257 176.652 15.1654 176.865 14.982C177.085 14.7987 177.195 14.5457 177.195 14.223C177.195 14.047 177.162 13.8967 177.096 13.772C177.03 13.6474 176.909 13.5337 176.733 13.431C176.564 13.321 176.315 13.2147 175.985 13.112L175.248 12.881C174.603 12.6757 174.137 12.4044 173.851 12.067C173.565 11.7297 173.422 11.3007 173.422 10.78C173.422 10.428 173.517 10.1017 173.708 9.80105C173.899 9.50038 174.185 9.25838 174.566 9.07505C174.947 8.89172 175.42 8.80005 175.985 8.80005C176.388 8.80005 176.755 8.82938 177.085 8.88805C177.422 8.93938 177.796 9.01638 178.207 9.11905L178.031 10.175C177.591 10.0504 177.199 9.96238 176.854 9.91105C176.517 9.85238 176.22 9.82305 175.963 9.82305C175.494 9.82305 175.16 9.90738 174.962 10.076C174.764 10.2374 174.665 10.439 174.665 10.681C174.665 10.857 174.698 11.0147 174.764 11.154C174.83 11.286 174.947 11.407 175.116 11.517C175.292 11.627 175.541 11.7334 175.864 11.836L176.623 12.078C177.283 12.276 177.752 12.5327 178.031 12.848C178.31 13.156 178.449 13.585 178.449 14.135C178.449 14.5604 178.346 14.9344 178.141 15.257C177.936 15.5797 177.635 15.8327 177.239 16.016C176.85 16.1994 176.366 16.291 175.787 16.291C175.384 16.291 174.969 16.247 174.544 16.159C174.119 16.071 173.657 15.9427 173.158 15.774L173.422 14.718C173.913 14.894 174.357 15.0297 174.753 15.125C175.156 15.213 175.508 15.257 175.809 15.257Z" />
        </g>
        <defs>
          <clipPath id={badgeClipId}>
            <rect width="46" height="14" fill="white" transform="translate(132.348 5.5)" />
          </clipPath>
        </defs>
      </svg>
    </span>
  )
}

/**
 * Render the current running whale tail using the fork's heartbeat timing.
 * @returns Decorative running mark; its status label belongs to the caller.
 */
export function RunningMark() {
  return (
    <span className="ewh-chat-running" aria-hidden="true">
      <svg className="ewh-chat-running-whale" width="100%" height="100%" viewBox="0 0 16 16" fill="currentColor" focusable="false">
        <path d={REST_PATH} />
      </svg>
    </span>
  )
}