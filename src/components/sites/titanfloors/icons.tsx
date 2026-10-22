type IconProps = { size?: number };

export function SearchIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="7" />
      <path d="m20 20-4.5-4.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8.1 3.5 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.5 0 5.5 3.6 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown({ size = 12 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m4 8 8 8 8-8" />
    </svg>
  );
}

export function LongArrowRight({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 20 12" fill="currentColor" aria-hidden="true">
      <path d="M0 5h14V1.5L20 6l-6 4.5V7H0z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.6V1.6L14 1.5c-4 0-4.9 3-4.9 4.9v2.1H6.5v4h2.6v10h4.9v-10h3.3l.4-4H14Z" />
    </svg>
  );
}

export function TiktokIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a8 8 0 0 0 4.6 1.5V6.7c-2.5 0-4.6-2.1-4.6-4.7Z" />
    </svg>
  );
}
