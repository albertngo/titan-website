import type { Metadata } from "next";
import { WishlistView } from "@/components/sites/titanfloors/catalogue/wishlist-view";
import { SiteShell } from "@/components/sites/titanfloors/sections";

export const metadata: Metadata = {
  title: "Your Wishlist | Titan Flooring",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <SiteShell>
      <WishlistView />
    </SiteShell>
  );
}
