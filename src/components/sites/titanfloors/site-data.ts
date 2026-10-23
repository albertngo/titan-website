// Content copied verbatim from https://titanfloors.ca/ (captured 2026-10-22).
// Pages not yet rebuilt here link back to the live site.

export const LIVE = "https://titanfloors.ca";

export const announcement =
  "We moved! We are now located at 1060 Britannia Road East #2! Still in Mississauga :]";

export const contact = {
  phoneDisplay: "905-282-1881",
  phoneHref: "tel:905-282-1881",
  email: "info@titanfloors.ca",
  addressShort: "1060 Britannia Road East #2",
  addressFull: "1060 Britannia Rd East #2, MIssissauga ON, L4W4T1",
  mapsHref: "https://share.google/pGWxQEZYaoBaryotz",
  footerMapsHref: "https://share.google/1BFDBnvU9U5LyU5As",
  googleReviewsHref:
    "https://www.google.com/search?q=titan+flooring+mississauga#lrd=0x882b38af067e6e9b:0x489d8570d62b5f2e,1,,,,",
};

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const nav: NavItem[] = [
  {
    label: "Hardwood",
    href: "#",
    children: [
      { label: "Solid Hardwood", href: "/product-category/solid-hardwood/" },
      { label: "Engineered Hardwood", href: "/product-category/engineered-hardwood/" },
    ],
  },
  { label: "Laminate", href: "/product-category/laminate/" },
  { label: "Vinyl", href: "/product-category/vinyl/" },
  {
    label: "Install",
    href: "#",
    children: [
      { label: "Flooring Installation", href: `${LIVE}/flooring-install/` },
      { label: "Stair Refinishing", href: `${LIVE}/stair-refinishing/` },
    ],
  },
  { label: "Blog", href: `${LIVE}/blog/` },
  { label: "About", href: `${LIVE}/about-us/` },
  { label: "Contact", href: `${LIVE}/contact/` },
];

const IMG = "/sites/titanfloors/img";

export const categories = [
  { label: "Solid Hardwood", href: "/product-category/solid-hardwood/", img: `${IMG}/1-1.png`, alt: "hardwood floors in Mississauga" },
  { label: "Engineered Hardwood", href: "/product-category/engineered-hardwood/", img: `${IMG}/2-1.png`, alt: "engineered hardwood" },
  { label: "Laminate", href: "/product-category/laminate/", img: `${IMG}/3-1.png`, alt: "laminate flooring" },
  { label: "Vinyl", href: "/product-category/vinyl/", img: `${IMG}/4-2.png`, alt: "vinyl flooring" },
  { label: "Tiles", href: "/product-category/tile/", img: `${IMG}/5.png`, alt: "tile flooring in bathroom" },
  { label: "Accessories", href: "/product-category/accessories/", img: `${IMG}/titan_flooring_types.png`, alt: "construction supplies Mississauga" },
];

export const steps = [
  { num: ".01", icon: `${IMG}/tf_-_limbs_logo_01-_600_x_600_px-21.png`, title: "Pick out your dream flooring", body: "Choose from our wide-range of flooring options and add them to your wish-list." },
  { num: ".02", icon: `${IMG}/tf_-_limbs_logo_02-_600_x_600_px-22.png`, title: "Request a quote", body: "Send us the SKUs and we will get back to you on the best rates available on the market!" },
  { num: ".03", icon: `${IMG}/tf_-_limbs_logo_03-_600_x_600_px-18.png`, title: "Let us handle the rest", body: "Sit back and relax. Our team will get to work and handle the rest." },
];

// Slide order matches the live carousel's DOM order.
export const reviews = [
  {
    quote: "\"Titan Flooring provided an outstanding experience! The friendly and helpful staff made everything easy.”...",
    body: "They flawlessly installed flooring in our kitchen, sunroom, and bathroom. Highly recommend!",
    author: "-Quyen D",
  },
  {
    quote: "\"Highly recommend Titan for its variety, quality, and unbeatable prices!”...",
    body: "They always offer guidance and advice, helping us navigate through the vast array of options to find the perfect flooring for our place.Highly recommend Titan Flooring.  They provide variety of selection, perfect quality and unbeatable prices.",
    author: "-Alan T",
  },
  {
    quote: "\"They were knowledgeable, efficient and cleaned up meticulously after they were done”...",
    body: "I am so impressed with the work Titan Flooring completed on my stairs! Craftsmanship is incredible as is the quality of the supplies they used. I will definitely be a repeat customer!",
    author: "-Irene K",
  },
  {
    quote: "\"Their team was incredibly professional and efficient. The quality of the materials was exceptional.”...",
    body: "Fantastic experience with Titan Flooring!  Excellent customer service and attention to detail. Highly recommend!",
    author: "-Jason T",
  },
];

// The live homepage's two "featured" posts 404 (and so do their images), so READ MORE
// points at the blog index until real posts are chosen.
export const featuredPosts = [
  {
    title: "Tips and Tricks on How to Fix Scratched Vinyl Flooring",
    lead: "Vinyl flooring is awesome.",
    body: " It’s durable, affordable, and looks great—until you notice a scratch. Whether it’s from furniture legs, pet claws, or just regular wear and tear, those scuffs and gouges can drive you nuts.",
    href: `${LIVE}/blog/`,
  },
  {
    title: "Is Luxury Vinyl Plank Floor Good for Renters?",
    lead: "",
    body: "If you’re renting a place, chances are you want flooring that looks good, lasts long, and doesn’t cause headaches.",
    boldTail: " Luxury Vinyl Plank (LVP)",
    tail: " has become a go-to choice for renters—and landlords—for all the right reasons.",
    href: `${LIVE}/blog/`,
  },
];

export const footerMenu = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/shop/" },
  { label: "Flooring Installation", href: `${LIVE}/flooring-install/` },
  { label: "Stair Refinishing", href: `${LIVE}/stair-refinishing/` },
  { label: "About Us", href: `${LIVE}/about-us/` },
  { label: "Blog", href: `${LIVE}/blog/` },
  { label: "Contact Us", href: `${LIVE}/contact/` },
];

export const footerProducts = [
  { label: "Solid Hardwood", href: "/product-category/solid-hardwood/" },
  { label: "Engineered Hardwood", href: "/product-category/engineered-hardwood/" },
  { label: "Laminate", href: "/product-category/laminate/" },
  { label: "Vinyl", href: "/product-category/vinyl/" },
  { label: "Tile", href: "/product-category/tile/" },
  { label: "Accessories", href: "/product-category/accessories/" },
];

export const hours = ["Mon – Fri (7:30am – 6pm)", "Saturday (8:30am – 5pm)", "Sunday (Closed)"];

export const socials = {
  instagram: "https://www.instagram.com/titanflooring_inc",
  facebook: "https://www.facebook.com/titanfloors.ca",
  tiktok: "https://www.tiktok.com/@titanflooring_inc",
};
