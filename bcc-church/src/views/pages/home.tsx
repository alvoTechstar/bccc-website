import { motion } from "framer-motion";
import Hero from "@/components/sections/hero";
import Summit from "@/components/sections/summit";
import SundayStrip from "@/components/sections/sunday-strip";
import Sermons from "@/components/sections/sermons";
import Faq from "@/components/sections/faq";
import VisionLeader from "@/components/sections/vision-leader";
import MissionVision from "@/components/sections/mission-vision";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Heart, Globe } from "lucide-react";
import type { BlogPost } from "@/lib/schemas";
import { api, Endpoints, resolveUploadUrl } from "@/lib/api";
import { Reveal, Counter } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { fallbackPhotos, photos, photoProps } from "@/lib/site";

const ministries = [
  {
    title: "Praise & Worship",
    description: "Spirit-filled worship that ushers you into God's presence.",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    tag: "Sundays 8:30 AM",
  },
  {
    title: "Media Ministry",
    description: "Capturing God's work through photo, film, and livestream.",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    tag: "Serve weekly",
  },
  {
    title: "Youth Ministry",
    description: "Bold faith, real friendships, and purpose for the next generation.",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    tag: "Saturdays 2 PM",
  },
  {
    title: "Outreach",
    description: "Food, hope, and the Gospel — street to street, home to home.",
    img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    tag: "Monthly",
  },
];

export default function Home() {
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: [Endpoints.blogPosts(3)],
    queryFn: () => api.getBlogPosts(3),
  });

  return (
    <div>
      <Hero />
      <MissionVision />
      <Summit />
      <SundayStrip />

      {/* Ministries — editorial media cards */}
      <section id="ministries" className="py-20 lg:py-28 bg-muted scroll-mt-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <Reveal from="left">
              <p className="eyebrow text-accent mb-4">Find your people</p>
              <h2 className="display-section text-primary max-w-2xl">
                There is a place here <span className="gold-accent">for everybody.</span>
              </h2>
            </Reveal>
            <Reveal from="right" delay={0.12}>
              <Link href="/ministries" className="group inline-flex items-center gap-2 font-bold text-primary hover:text-royal transition-colors">
                All ministries
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </Reveal>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {ministries.map((m, index) => (
              <motion.article
                key={m.title}
                variants={staggerDir(index)}
                className="media-card group h-[440px]"
                data-testid={`card-ministry-${index}`}
              >
                <img src={m.img} alt={m.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute left-5 top-5 z-[2] rounded-full bg-white/15 border border-white/30 backdrop-blur px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-white">
                  {m.tag}
                </span>
                <span className="media-arrow absolute right-5 top-5 z-[2] flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
                  <ArrowUpRight size={20} />
                </span>
                <div className="media-card-body p-6">
                  <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-1.5" data-testid={`text-ministry-title-${index}`}>
                    {m.title}
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed" data-testid={`text-ministry-description-${index}`}>
                    {m.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact — dark cinematic band */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-primary">
        <img
          {...photoProps(photos.congregation, fallbackPhotos.congregation, "")}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/85 to-primary" />
        <div className="relative container mx-auto px-4">
          <Reveal from="blur" className="text-center mb-12">
            <p className="eyebrow text-accent justify-center mb-4">God is moving</p>
            <h2 className="display-section text-white">Lives transformed, <span className="gold-accent">every week.</span></h2>
          </Reveal>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
          >
            {[
              { value: 2500, suffix: "+", label: "Members" },
              { value: 12, suffix: "", label: "Branches" },
              { value: 40, suffix: "+", label: "Ministries" },
              { value: 15, suffix: "k+", label: "Lives touched" },
            ].map((s, i) => (
              <motion.div key={s.label} variants={staggerDir(i)} className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur px-4 py-8">
                <p className="font-serif text-5xl lg:text-6xl font-black gold-accent">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-white/70">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <VisionLeader />

      <Sermons />

      {/* Stories — editorial list */}
      <section className="py-20 lg:py-28 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <Reveal from="right">
              <p className="eyebrow text-accent mb-4">Stories & updates</p>
              <h2 className="display-section text-primary max-w-2xl">
                Latest from <span className="gold-accent">the family.</span>
              </h2>
            </Reveal>
            <Reveal from="left" delay={0.12}>
              <Link href="/blog" className="group inline-flex items-center gap-2 font-bold text-primary hover:text-royal transition-colors">
                View all posts
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </Reveal>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-5">
              {[0, 1, 2].map((i) => (
                <Card key={i} className="overflow-hidden rounded-3xl">
                  <Skeleton className="h-56 w-full" />
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogPosts.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-3 gap-5"
            >
              {blogPosts.slice(0, 3).map((post, i) => (
                <motion.article
                  key={post.id}
                  variants={staggerDir(i + 1)}
                  className={`media-card group ${i === 0 ? "md:col-span-2 h-[380px]" : "h-[380px]"}`}
                  data-testid={`card-blog-post-${post.id}`}
                >
                  <img
                    src={resolveUploadUrl(post.images?.[0] ?? post.imageUrl) || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                    alt={post.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    data-testid={`img-blog-post-${post.id}`}
                  />
                  <span className="absolute left-5 top-5 z-[2]">
                    <Badge className="bg-accent text-primary border-0 font-black uppercase tracking-widest text-[11px]" data-testid={`badge-blog-category-${post.id}`}>
                      {post.category}
                    </Badge>
                  </span>
                  <div className="media-card-body p-6">
                    <h3 className="font-serif text-2xl font-bold text-white leading-snug mb-1.5" data-testid={`text-blog-title-${post.id}`}>
                      {post.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2" data-testid={`text-blog-excerpt-${post.id}`}>
                      {post.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center">
              <p className="font-serif text-2xl font-bold text-white">Fresh stories are on the way.</p>
              <p className="mx-auto mt-2 max-w-md text-white/65">
                The media team publishes here straight from the admin console — check back soon, or catch up on past sermons.
              </p>
              <Link href="/sermons" className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-primary hover:bg-accent/90">
                Watch sermons <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Faq />

      {/* CTA — cinematic */}
      <section className="relative py-24 overflow-hidden bg-primary">
        <img
          src="https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-royal/70" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl">
            <Reveal from="left">
              <p className="eyebrow text-accent mb-4">You're family</p>
              <h2 className="display-section text-white">
                Come home to <span className="gold-accent">BCC Church.</span>
              </h2>
            </Reveal>
            <Reveal from="right" delay={0.1}>
              <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-xl">
                Experience the love of Christ and become part of a community that cares.
                Sundays 8:30 & 10:30 — in person and online.
              </p>
            </Reveal>
            <Reveal from="up" delay={0.18}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold" data-testid="button-plan-visit">
                    <Heart className="mr-2" size={18} />
                    Plan Your Visit
                  </Button>
                </Link>
                <Link href="/giving">
                  <Button size="lg" variant="outline" className="glass-pill text-white rounded-full font-bold border-white/30 hover:bg-white/20" data-testid="button-support-mission">
                    <Globe className="mr-2" size={18} />
                    Support Our Mission
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
