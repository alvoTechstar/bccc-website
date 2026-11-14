import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Facebook, MapPin, Quote } from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { bishopFacebook, fallbackPhotos, photos, photoProps } from "@/lib/site";

const pastors = [
  {
    name: "Pastor David Seur",
    role: "Narok Region Leader",
    description: "Oversees five rural branch churches across Narok County with a heart for village evangelism.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pastor Samuel Kirui",
    role: "BCC Ololulunga Pastor",
    description: "Passionate about community outreach, youth development and discipleship.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rev. Mary Kimani",
    role: "BCC Utawala Chapel",
    description: "Leads our Utawala family with a focus on family ministry and pastoral care.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
];

export default function Leadership() {
  return (
    <div>
      <PageHero
        title={<>Our <span className="gold-accent">Leadership</span></>}
        description="Shepherds after God's own heart — meet the men and women who carry the vision of Beautiful Courts Christian Church."
      />

      {/* Founder feature */}
      <section className="py-20 lg:py-28 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -64 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-accent/40 via-transparent to-royal/40 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-accent/30 group">
                <img
                  {...photoProps(photos.bishop, fallbackPhotos.bishop, "Bishop JB Tajeu — Founder of BCC Church")}
                  loading="eager"
                  className="w-full aspect-[4/5] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  data-testid="img-bishop-founder"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-7">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-accent">Founder & Visionary</p>
                  <p className="font-serif text-3xl font-bold text-white">Bishop JB Tajeu</p>
                </div>
              </div>
            </motion.div>

            <div>
              <Reveal from="right">
                <p className="eyebrow text-accent mb-4">Meet the founder</p>
                <h2 className="display-section text-primary">
                  A man sent <span className="gold-accent">to the nations.</span>
                </h2>
              </Reveal>
              <Reveal from="right" delay={0.1}>
                <div className="mt-6 space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Bishop JB Tajeu founded Beautiful Courts Christian Church on a clear word from God:
                    to establish a church that would transform communities across Kenya. From a small
                    gathering in Nakuru, he has led BCC into a thriving network of congregations across
                    Nakuru and Narok counties.
                  </p>
                  <p>
                    He convenes the annual <strong className="text-primary">Dominion Summit</strong>,
                    where the theme for each new year is proclaimed — and carries a burning message of
                    faith, holiness, and kingdom dominion to every pulpit he mounts.
                  </p>
                </div>
              </Reveal>
              <Reveal from="up" delay={0.18}>
                <div className="mt-6 rounded-2xl border-l-4 border-accent bg-accent/[0.07] p-5 flex gap-3">
                  <Quote size={22} className="text-accent shrink-0 mt-1" />
                  <p className="font-serif text-lg italic text-primary leading-relaxed">
                    "God has called us to be a beacon of hope — not just building congregations,
                    but transforming lives for generations."
                  </p>
                </div>
              </Reveal>
              <Reveal from="up" delay={0.24}>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={bishopFacebook} target="_blank" rel="noreferrer" data-testid="link-bishop-facebook-page">
                    <Button className="rounded-full bg-primary text-primary-foreground hover:bg-royal">
                      <Facebook size={18} className="mr-2" /> Follow Bishop JB Tajeu
                    </Button>
                  </a>
                  <Link href="/sermons">
                    <Button variant="outline" className="rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      Watch him preach <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Pastoral team */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Pastoral team"
            title={<>Serving <span className="gold-accent">alongside him</span></>}
            description="Faithful pastors shepherding our branches week in, week out."
          />
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-3 gap-5"
          >
            {pastors.map((p, i) => (
              <motion.article
                key={p.name}
                variants={staggerDir(i)}
                className="media-card group h-[440px]"
                data-testid={`card-pastor-${i}`}
              >
                <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute left-5 top-5 z-[2] rounded-full bg-white/15 border border-white/30 backdrop-blur px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-white">
                  Pastor
                </span>
                <div className="media-card-body p-6">
                  <h3 className="font-serif text-2xl font-bold text-white leading-tight">{p.name}</h3>
                  <p className="text-accent font-bold text-sm mt-1">{p.role}</p>
                  <p className="text-sm text-white/70 mt-2 leading-relaxed">{p.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <Reveal>
            <h2 className="display-section text-white">
              Come meet them <span className="gold-accent">this Sunday.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8" data-testid="button-leadership-visit">
                  Plan Your Visit <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/branches">
                <Button size="lg" variant="outline" className="glass-pill text-white rounded-full px-8 border-white/30" data-testid="button-leadership-branches">
                  <MapPin size={18} className="mr-2" /> Find a Branch
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
