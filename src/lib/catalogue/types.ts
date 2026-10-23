// The public tier of Titan Desk's catalogue mirror (titan-desk `api.catalogue_public`).
// Column list and meaning: titan-desk db/README.md "Tier table" — keep in step with it.
// This site never sees cost, MAP, supplier or notes: those columns are not in the view.

export type ImageKind = "swatch" | "room" | "detail";

export type ImageVariant = {
  kind: ImageKind;
  sort: number;
  w: number | null;
  h: number | null;
  blurhash: string | null;
  thumb: string | null;
  card: string | null;
  full: string | null;
};

export type Hero = Omit<ImageVariant, "sort">;

export type PairRef = { sku: string; product_name: string | null };
export type VariantRef = { sku: string; product_name: string | null; grade: string | null; variant_label: string | null };

export type PublicProduct = {
  sku: string;
  product_name: string | null;
  brand: string | null;
  collection: string | null;
  product_type: string | null;
  category: string | null;
  material_type: string | null;
  species: string | null;
  colour_tone: string | null;
  grade: string | null;
  layout_pattern: string | null;
  width_in: number | null;
  length: string | null;
  thickness_mm: number | null;
  wear_layer_mil: number | null;
  veneer_mm: number | null;
  veneer_cut_type: string | null;
  ac_rating: string | null;
  finish_type: string | null;
  install_profile: string | null;
  install_method: string | null;
  locking_system: string | null;
  underpad_included: boolean;
  underpad_type: string | null;
  iic_rating: number | null;
  stc_rating: number | null;
  tile_format: string | null;
  weight_per_piece_kg: number | null;
  certifications: string[] | null;
  retail_price: number | null;
  price_on_request: boolean;
  price_unit: "sf" | "piece";
  promo_active: boolean;
  box_size_sf: number | null;
  pieces_per_box: number | null;
  stock_status: string | null;
  coming_soon: boolean;
  waterproof: boolean;
  pet_friendly: boolean;
  radiant_heat_compatible: boolean;
  traffic_rating: string | null;
  suitable_rooms: string[] | null;
  residential_warranty_yrs: number | null;
  commercial_warranty_yrs: number | null;
  undertone: string | null;
  tone_depth: number | null;
  texture: string | null;
  style: string[] | null;
  busyness: string | null;
  pairs_well_with: PairRef[] | null;
  variants: VariantRef[] | null;
  images: ImageVariant[] | null;
  hero: Hero | null;
};

/** What a category grid needs per product; the full row stays server-side. */
export type CardProduct = {
  slug: string;
  /** Included only so a quote request can name the exact product; never shown on a card. */
  sku: string;
  name: string;
  line: string | null;
  colour: string;
  badge: string | null;
  category: string | null;
  image: { src: string; alt: string; blurhash: string | null } | null;
  price: number | null;
  priceUnit: "sf" | "piece";
  priceOnRequest: boolean;
  promo: boolean;
  stock: string | null;
  comingSoon: boolean;
  facets: {
    type: string | null;
    tone: string | null;
    width: number | null;
    thickness: number | null;
    finish: string | null;
    install: string | null;
    species: string | null;
    undertone: string | null;
    texture: string | null;
    style: string[];
    waterproof: boolean;
    pet: boolean;
    radiant: boolean;
  };
};
