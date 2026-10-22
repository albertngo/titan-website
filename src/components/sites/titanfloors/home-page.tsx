import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { FadeIn } from "./fade-in";
import { Header } from "./header";
import { FacebookIcon, InstagramIcon, LongArrowRight, TiktokIcon } from "./icons";
import { ReviewsCarousel } from "./reviews-carousel";
import {
  categories,
  contact,
  featuredPosts,
  footerMenu,
  footerProducts,
  hours,
  LIVE,
  socials,
  steps,
} from "./site-data";

const IMG = "/sites/titanfloors/img";

// Icon offset inside each big number, as a fraction of the number's font size (measured live).
const stepIconOffset = [
  { left: 0.18, top: 0.34 },
  { left: 0.22, top: 0.305 },
  { left: 0.155, top: 0.22 },
];

// Each live column wraps its title and body at a different width.
const stepWidths = [
  { title: 250, body: 262 },
  { title: 190, body: 276 },
  { title: 200, body: 210 },
];

export function HomePage() {
  return (
    <div className="tf">
      <Header />

      <main>
        <section className="hero">
          <FadeIn slow className="hero-box">
            <Image className="hero-bg" src={`${IMG}/4-1.png`} alt="" fill sizes="100vw" fetchPriority="high" loading="eager" />
            <h1 className="eyebrow">Mississauga Floors and Stair Refinishing</h1>
            <p className="display hero-title">Floors Designed to Welcome You Home</p>
            <p className="serif hero-sub">Your trusted source for quality flooring and expert installation</p>
            <a className="btn" href={`${LIVE}/shop/`}>
              Explore Products
            </a>
          </FadeIn>
        </section>

        <section className="shop">
          <h2 className="display">Shop by Category</h2>
          <div className="cat-grid">
            {categories.map((c) => (
              <FadeIn key={c.label} className="cat">
                <Image src={c.img} alt={c.alt} width={800} height={800} sizes="(max-width: 767px) 100vw, 412px" />
                <h3 className="serif">{c.label}</h3>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="install">
          <div className="install-row">
            <FadeIn slow className="install-card">
              <h2 className="eyebrow">Flooring Installation and Stair Refinishing</h2>
              <p className="display install-title">Not a DIY pro? Leave it to us!</p>
              <p className="install-body">
                Got flooring woes or stair scares? We&rsquo;ve got the tools, the team, and the know-how to make them
                disappear&mdash;stress-free and stylishly!
              </p>
              <div className="install-links">
                <a href={`${LIVE}/flooring-install/`}>
                  Learn more about floor install <LongArrowRight />
                </a>
                <a href={`${LIVE}/stair-refinishing/`}>
                  Learn more about stair refinishing <LongArrowRight />
                </a>
              </div>
            </FadeIn>
            <FadeIn slow className="install-photo">
              <Image src={`${IMG}/14.png`} alt="Installer laying a hardwood plank" fill sizes="(max-width: 767px) 100vw, 40vw" />
            </FadeIn>
          </div>
        </section>

        <section className="steps" aria-label="How it works">
          <div className="steps-row">
            {steps.map((s, i) => (
              <FadeIn key={s.num} className="step" delay={i * 300} style={{ ["--title-w" as string]: `${stepWidths[i].title}px`, ["--body-w" as string]: `${stepWidths[i].body}px` }}>
                <div className="step-art">
                  <span className="step-num" aria-hidden="true">
                    {s.num}
                  </span>
                  <Image
                    className="step-icon"
                    src={s.icon}
                    alt=""
                    width={400}
                    height={400}
                    style={{
                      left: `calc(50% - var(--t-num) * 0.56 + var(--t-num) * ${stepIconOffset[i].left})`,
                      top: `calc(var(--t-num) * ${stepIconOffset[i].top})`,
                    }}
                  />
                </div>
                <h3 className="display">{s.title}</h3>
                <p>{s.body}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="reviews">
          <div className="reviews-row">
            <FadeIn className="reviews-intro">
              <h2 className="display">Don&apos;t just take our word for it</h2>
              <p>
                We pride ourselves on top-notch quality, clear communication, and a friendly approach &mdash; just ask
                our 100+ happy customers! Dive into their reviews and see why we&rsquo;re a cut above the rest!
              </p>
              <a className="btn" href={contact.googleReviewsHref} target="_blank" rel="noopener noreferrer">
                Google Reviews
              </a>
            </FadeIn>
            <ReviewsCarousel />
          </div>
        </section>

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
      </main>

      <footer>
        <section className="contact" aria-label="Contact us">
          <FadeIn className="contact-card">
            <div className="contact-text">
              <h2 className="display">Need help deciding?</h2>
              <p className="serif contact-sub">Drop us a message, give us a call or pop by and say hi!</p>
              <div className="contact-lines">
                <a href={contact.phoneHref}>Phone: ({contact.phoneDisplay})</a>
                <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
                <a href={contact.mapsHref} target="_blank" rel="noopener noreferrer">
                  Location: {contact.addressFull}
                </a>
              </div>
            </div>
            <ContactForm />
          </FadeIn>
        </section>

        <div className="ftr">
          <div className="ftr-brand">
            <Link href="/" aria-label="Titan Flooring home">
              <Image src={`${IMG}/tf-primary-logo-1-blue-rgb-900px-w-72ppi.png`} alt="titan floors logo" width={400} height={371} sizes="200px" />
            </Link>
            <p>
              Located in the GTA, Titan Flooring has over a decade of experience, delivering expert recommendations and
              flooring solutions that fit your space and budget.
            </p>
          </div>
          <div className="ftr-col">
            <h3>Menu</h3>
            <ul>
              {footerMenu.map((m) => (
                <li key={m.label}>
                  {m.href.startsWith("/") ? <Link href={m.href}>{m.label}</Link> : <a href={m.href}>{m.label}</a>}
                </li>
              ))}
            </ul>
          </div>
          <div className="ftr-col">
            <h3>Products</h3>
            <ul>
              {footerProducts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="ftr-col">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={contact.footerMapsHref} target="_blank" rel="noopener noreferrer">
                  Address: {contact.addressShort}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
              </li>
              <li>
                <a href={contact.phoneHref}>Phone: {contact.phoneDisplay}</a>
              </li>
              <li>
                Hours:
                {hours.map((h) => (
                  <span key={h} style={{ display: "block" }}>
                    {h}
                  </span>
                ))}
              </li>
            </ul>
          </div>
          <div className="ftr-col">
            <h3>Socials</h3>
            <div className="ftr-social">
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <TiktokIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="ftr-bar">
          <span>Privacy Policy and Terms</span>
          <a href="https://social-estates.com/" target="_blank" rel="noopener noreferrer">
            Website designed by: Social Estates
          </a>
        </div>
      </footer>
    </div>
  );
}
