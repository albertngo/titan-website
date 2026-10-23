// Intro and FAQ copy for each category page, copied from the live titanfloors.ca pages
// (captured 2026-10-23; source HTML in docs/research/titanfloors/category/). Tile and
// Accessories have no copy on the live site, so none is invented here.

import type { CategoryKey } from "@/lib/catalogue/catalogue";

export type CategoryCopy = { title: string; intro: string | null; faqTitle: string | null; faqSub: string | null; faq: { q: string; a: string }[] };

export const categoryCopy: Record<CategoryKey, CategoryCopy> = {
  "solid-hardwood": {
    title: "Solid Hardwood Collections",
    intro: "Hardwood floors add a cozy and inviting touch to any space. Want to transform your home into a welcoming haven? Engineered hardwood flooring delivers effortless elegance and natural charm. Its unique character and sophisticated style elevate even the most basic rooms. Engineered hardwood is a smart, stylish choice.",
    faqTitle: "Questions About Solid Hardwood?",
    faqSub: "We’ve got all the answers—no woodpecker required!",
    faq: [
      { q: "What is solid hardwood flooring?", a: "Solid hardwood is the real deal—one thick piece of natural wood that’s both timeless and tough. It’s the flooring equivalent of a classic leather jacket." },
      { q: "How is solid hardwood different from engineered hardwood?", a: "Think of solid hardwood as the purebred, while engineered hardwood is the hybrid with a wood veneer on a plywood base. Solid hardwood can be sanded and refinished more often, but engineered hardwood is better with the humidity drama." },
      { q: "Can solid hardwood be installed in any room?", a: "Solid hardwood loves living rooms and bedrooms but isn't a fan of moisture. So, keep it away from bathrooms and basements unless you want it to have a bad hair day." },
      { q: "How do I maintain and care for solid hardwood floors?", a: "Regular sweeping or vacuuming, using a hardwood floor cleaner, and promptly cleaning up spills can help maintain the flooring. It’s also advised to use rugs or mats in high-traffic areas to reduce wear and tear." },
      { q: "What is the installation process like for solid hardwood flooring?", a: "Usually nailed or stapled over a wood subfloor. It’s a bit of a project, so if you're not a DIY pro, calling in the experts might be a wise move." },
      { q: "Can solid hardwood be installed over concrete?", a: "Not directly—concrete and hardwood aren’t best friends. It’s better to go over a plywood subfloor or use a moisture barrier." },
      { q: "Can pets damage solid hardwood flooring?", a: "Pets can be tough on hardwood. Opt for harder woods and durable finishes, and keep those paws trimmed to minimize the damage." },
    ],
  },
  "engineered-hardwood": {
    title: "Engineered Hardwood Collections",
    intro: "Engineered hardwood is a versatile and durable flooring option that combines the natural beauty of real wood with enhanced stability. Made with a solid wood veneer layer on top of high-quality plywood or fiberboard, it resists moisture and temperature changes better than solid hardwood. Available in a variety of wood species, finishes, and styles, engineered hardwood brings timeless elegance to any room while offering a long-lasting, low-maintenance solution for your floors.",
    faqTitle: "Questions About Engineered Hardwood?",
    faqSub: "We’ve got all the answers—no woodpecker required!",
    faq: [
      { q: "What is engineered hardwood?", a: "Engineered hardwood is like hardwood's modern cousin—real wood on top, but with a plywood base underneath. It’s stylish, stable, and ready for action." },
      { q: "How is engineered hardwood different from solid hardwood?", a: "Solid hardwood is one solid piece of wood, while engineered hardwood has a real wood veneer over a sturdy plywood core. It’s more stable with temperature and humidity changes but can’t be refinished as often." },
      { q: "Is engineered hardwood real wood?", a: "Yes, the top layer of engineered hardwood is made from real wood, giving it the same appearance and texture as solid hardwood. The layers beneath provide structural support and stability." },
      { q: "How long do engineered hardwood floors last?", a: "With proper care and maintenance, engineered hardwood floors can last anywhere from 20 to 30 years, depending on the quality of the materials and the thickness of the veneer layer." },
      { q: "Is engineered hardwood durable?", a: "Yes, engineered hardwood is quite durable, especially in areas with fluctuating temperatures and humidity. Its layered construction makes it more resistant to warping and wear than solid hardwood, making it a great choice for high-traffic areas." },
      { q: "How do I maintain and clean engineered hardwood floors?", a: "Easy care is the name of the game. Sweep, vacuum, and mop with a damp cloth or a cleaner designed for hardwood. Avoid soaking or harsh chemicals, and keep spills wiped up." },
      { q: "Is engineered hardwood resistant to moisture and humidity?", a: "Engineered hardwood handles humidity better than solid wood. It’s less prone to expanding or contracting with moisture changes, making it great for variable climates." },
    ],
  },
  "laminate": {
    title: "Laminate Collections",
    intro: "Laminate flooring offers a cost-effective and durable alternative that mimics the appearance of hardwood, stone, or tile. It features a high-density fiberboard core with a photographic layer and a clear protective top layer. Easy to install and maintain, laminate is ideal for high-traffic areas and comes in various styles and colors, combining the look of natural materials with affordability.",
    faqTitle: "Questions About Laminate?",
    faqSub: "We’ve got the answers—because even flooring deserves its time in the spotlight!",
    faq: [
      { q: "What is laminate flooring made of?", a: "Laminate flooring is like a high-tech sandwich: it has a core of high-density fiberboard (HDF), a decorative layer that looks like wood or stone, and a protective top layer that fights off scratches and stains." },
      { q: "How durable is laminate flooring?", a: "It’s tough! Laminate is resistant to scratches, stains, and fading, making it perfect for busy homes, playful pets, and clumsy kids." },
      { q: "Can laminate be installed in any room?", a: "Almost! Laminate is great for most rooms, but it’s not a fan of high-moisture areas like bathrooms or basements—think of it as a floor that prefers to stay dry." },
      { q: "How do I clean laminate flooring?", a: "Simple! Just sweep or vacuum to remove debris, and mop with a damp cloth or a cleaner designed for laminate. Avoid soaking the floor, as excess water can cause damage." },
      { q: "Can laminate flooring be installed over existing floors?", a: "Yes, it can! Laminate can often be laid over existing flooring, provided the surface is clean, dry, and level. Just remember to check manufacturer guidelines for specifics." },
      { q: "How does laminate compare to hardwood?", a: "Laminate gives you the stylish look of hardwood at a fraction of the cost and with less upkeep. It’s like the affordable, low-maintenance cousin of hardwood flooring." },
      { q: "How long does laminate flooring last?", a: "With proper care, laminate can last 15-25 years, making it a long-lasting option that doesn’t require regular refinishing like hardwood." },
    ],
  },
  "vinyl": {
    title: "Vinyl Flooring Collections",
    intro: "Vinyl flooring combines style and durability with budget-friendly practicality. Mimicking wood, stone, or tile, it’s scratch- and stain-resistant, water-resistant, and easy to maintain. Ideal for any room, especially high-traffic and moisture-prone areas.",
    faqTitle: "Vinyl Flooring Questions?",
    faqSub: "We've got the scoop—because your flooring dilemmas deserve a little vinyl twist!",
    faq: [
      { q: "What is vinyl flooring made of?", a: "Vinyl flooring is a synthetic superstar, composed of multiple layers including a backing, a core layer, a printed design, and a clear protective top layer. It’s like the Swiss Army knife of flooring!" },
      { q: "Is vinyl flooring durable?", a: "You bet! Vinyl is tough enough to handle foot traffic, spills, and stains without breaking a sweat. It’s the floor that can handle your busy life with ease." },
      { q: "Can vinyl flooring be installed over existing floors?", a: "Absolutely! Vinyl can often be laid over existing floors, as long as they’re clean, flat, and smooth. Just make sure your old floor isn’t throwing a party of its own!" },
      { q: "How do I clean and maintain vinyl flooring?", a: "Keep it simple—sweep or vacuum regularly, and mop with a gentle cleaner. Vinyl’s low-maintenance nature means you won’t need to call in a floor-cleaning squad." },
      { q: "Is vinyl flooring water-resistant?", a: "You got it! Vinyl is great for moisture-prone areas like kitchens and bathrooms. Just don’t leave it floating in a puddle—remember, it’s water-resistant, not waterproof." },
      { q: "Can I install vinyl flooring myself?", a: "Yes, if you’re up for a DIY adventure! Many vinyl options feature a click-lock installation, making it a breeze for even the most enthusiastic weekend warriors." },
      { q: "How long does vinyl flooring last?", a: "With proper care, vinyl flooring can last 10-20 years. It’s the long-lasting friend who won’t let you down, and won’t ask for frequent updates or refinishing." },
    ],
  },
  tile: { title: "Tile Collections", intro: null, faqTitle: null, faqSub: null, faq: [] },
  accessories: { title: "Accessories", intro: null, faqTitle: null, faqSub: null, faq: [] },
};
