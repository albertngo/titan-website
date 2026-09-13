// Copied by hand from titan-agents-repo/platform-settings/website.json — the agents
// repo is the source of truth for these facts. Not fetched live (see
// methods/website-architecture.md: "two thin data modules", no live platform reads
// from the public site). Update this file when that JSON changes.

export const nap = {
  name: "Titan Flooring Inc.",
  address: "1060 Britannia Rd East #2, Mississauga, ON L4W 4T1",
  phone: "905-282-1881",
  phoneHref: "tel:+19052821881",
  email: "info@titanfloors.ca",
  hours: [
    { days: "Mon – Fri", time: "7:30am – 6pm" },
    { days: "Saturday", time: "8:30am – 5pm" },
    { days: "Sunday", time: "Closed" },
  ],
} as const;

export const nav = [
  { label: "Solid Hardwood", href: "/product-category/solid-hardwood/" },
  { label: "Engineered Hardwood", href: "/product-category/engineered-hardwood/" },
  { label: "Laminate", href: "/product-category/laminate/" },
  { label: "Vinyl", href: "/product-category/vinyl/" },
  { label: "Flooring Installation", href: "/flooring-install/" },
  { label: "Stair Refinishing", href: "/stair-refinishing/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/about-us/" },
  { label: "Contact", href: "/contact/" },
] as const;

// Real, already-in-use taglines from Titan's storefront window-panel art (Drive:
// "Main Window Panel.png" et al.) — not invented copy.
export const taglines = {
  hero: "Floors that turn houses into homes",
  sub: "Your Friendly Flooring Experts",
  alt: ["Floors that welcome you home", "Floors that hug your feet"],
} as const;

// Core values, verbatim from "Titan Flooring Onboarding Form (COMPLETED COPY)" —
// Titan's own words, not a generic feature-icon list.
export const coreValues = [
  {
    name: "Connection",
    body: "We take the time to connect with our clients. We try to remember their names and treat them like friends and family. Our clients are not just another number.",
  },
  {
    name: "Accessible",
    body: "We're easy to reach and always available. Need options? We've got you. Budget? Here's a list. Not sure where to start? Follow us.",
  },
  {
    name: "Knowledge",
    body: "With over a decade of experience, we offer valuable insights and recommendations that result in a flooring solution that perfectly fits your space and budget.",
  },
  {
    name: "Professionalism",
    body: "From the minute you step into the store, we assist you with whatever you need — from the timing of the quote to the time of the install.",
  },
  {
    name: "Commitment",
    body: "We take pride in committing to the best experience for our clients: dedicated staff, top-notch materials, and an expert install team. No surprises.",
  },
  {
    name: "Fun",
    body: "Even though we're a flooring store, we have a big personality. We believe life's too short to be boring, so we like to have fun with our clients.",
  },
] as const;

export const productFamilies = [
  { name: "Solid Hardwood", href: "/product-category/solid-hardwood/" },
  { name: "Engineered Hardwood", href: "/product-category/engineered-hardwood/" },
  { name: "Laminate", href: "/product-category/laminate/" },
  { name: "Vinyl", href: "/product-category/vinyl/" },
] as const;

export const services = [
  { name: "Flooring Installation", href: "/flooring-install/" },
  { name: "Stair Refinishing", href: "/stair-refinishing/" },
] as const;
