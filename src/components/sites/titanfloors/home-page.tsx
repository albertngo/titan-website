import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "./fade-in";
import { HowItWorks, InstallBanner, Reviews, SiteShell } from "./sections";
import { categories, featuredPosts, LIVE } from "./site-data";

const IMG = "/sites/titanfloors/img";

export function HomePage() {
  return (
    <SiteShell>
        <section className="hero">
          <FadeIn slow className="hero-box">
            <Image className="hero-bg" src={`${IMG}/4-1.png`} alt="" fill sizes="100vw" fetchPriority="high" loading="eager" />
            <h1 className="eyebrow">Mississauga Floors and Stair Refinishing</h1>
            <p className="display hero-title">Floors Designed to Welcome You Home</p>
            <p className="serif hero-sub">Your trusted source for quality flooring and expert installation</p>
            <Link className="btn" href="/shop/">
              Explore Products
            </Link>
          </FadeIn>
        </section>

        <section className="shop">
          <h2 className="display">Shop by Category</h2>
          <div className="cat-grid">
            {categories.map((c) => (
              <FadeIn key={c.label} className="cat">
                <Link href={c.href} className="cat-link">
                <Image src={c.img} alt={c.alt} width={800} height={800} sizes="(max-width: 767px) 100vw, 412px" />
                <h3 className="serif">{c.label}</h3>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        <InstallBanner />

        <HowItWorks />

        <Reviews />

        <section className="about">
          <FadeIn className="about-card">
            <div className="about-text">
              <h2 className="display">About Us</h2>
              <p className="serif about-sub">Your Friendly Flooring Experts</p>
              <p>
                We cater to homeowners in the GTA area offering reliable, personalized guidance and minimizing friction
                throughout the process. With over a decade of experience, we provide expert recommendations and
                deliver flooring solutions that perfectly fit your space and budget!
              </p>
              <a className="btn" href={`${LIVE}/about-us/`}>
                Learn More
              </a>
            </div>
            <div className="about-art">
              <Image src={`${IMG}/together_-_blue.png`} alt="titan floors logo" width={800} height={782} sizes="375px" />
            </div>
          </FadeIn>
        </section>

        {featuredPosts.map((p, i) => (
          <section className="post" key={p.title}>
            <FadeIn className={`post-row${i % 2 === 1 ? " flip" : ""}`}>
              {/* The live images for both posts return 404; the column is kept empty as on the live page. */}
              <div className="post-media" aria-hidden="true" />
              <div className="post-text">
                <p className="eyebrow">Featured Blog Post</p>
                <h2 className="display">
                  {p.title}
                </h2>
                <p className="post-body">
                  {p.lead && <b>{p.lead}</b>}
                  {p.body}
                  {p.boldTail && <b>{p.boldTail}</b>}
                  {p.tail}
                </p>
                <a className="btn" href={p.href}>
                  Read More
                </a>
              </div>
            </FadeIn>
          </section>
        ))}
    </SiteShell>
  );
}
