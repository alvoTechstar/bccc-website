import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Pill, Users, Globe, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading, Counter } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { fallbackPhotos, photos, photoProps } from "@/lib/site";

export default function About() {
  const coreValues = [
    {
      icon: Heart,
      title: "Love",
      description: "Demonstrating Christ's unconditional love in all we do.",
      color: "bg-red-500"
    },
    {
      icon: Pill,
      title: "Faith",
      description: "Building unshakeable faith through God's Word and prayer.",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Creating strong, supportive Christian communities.",
      color: "bg-green-500"
    },
    {
      icon: Globe,
      title: "Mission",
      description: "Spreading the Gospel across Kenya and beyond.",
      color: "bg-purple-500"
    }
  ];

  return (
    <div>
      <PageHero
        title={<>About <span className="gold-accent">BCC Church</span></>}
        description="Discover our story, meet our leadership team, and learn about the values that guide our mission to transform lives across Kenya through the power of Jesus Christ."
      />

      {/* Our Story */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <Reveal>
                <h3 className="text-3xl font-bold text-primary mb-6 font-serif" data-testid="text-our-story-title">Our Story</h3>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p data-testid="text-story-paragraph-1">
                    Beautiful Courts Christian Church began as a vision from God to establish a church that would transform communities across Kenya. Founded by Bishop JB Tajeu, our church has grown from a small gathering in Nakuru to a thriving network of congregations serving thousands across multiple counties.
                  </p>
                  <p data-testid="text-story-paragraph-2">
                    Our journey reflects God's faithfulness and the dedication of our members who have embraced the call to be disciples and disciple-makers. From our headquarters in Mawanga Kwa Budaa, we have expanded to serve communities in both urban and rural areas, adapting our ministry to meet the unique needs of each location.
                  </p>
                  <p data-testid="text-story-paragraph-3">
                    Today, BCC Church stands as a beacon of hope, offering not just spiritual nourishment but also practical support to families, youth, and communities throughout Kenya.
                  </p>
                </div>
              </Reveal>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, x: 40 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <img
                    {...photoProps(photos.sanctuaryRender, fallbackPhotos.sanctuaryRender, "Artist's impression of the coming BCC sanctuary")}
                    loading="lazy"
                    className="rounded-2xl transition-transform duration-700 group-hover:scale-105"
                    data-testid="img-church-community"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl pointer-events-none"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership teaser — full team lives at /about/leadership */}
      <section className="py-20 bg-muted overflow-hidden">
        <div className="container mx-auto px-4">
          <Reveal from="left">
            <div className="grid md:grid-cols-[auto_1fr_auto] items-center gap-6 rounded-3xl bg-primary p-6 lg:p-8 shadow-xl">
              <img
                {...photoProps(photos.bishop, fallbackPhotos.bishop, "Bishop JB Tajeu")}
                loading="lazy"
                className="h-24 w-24 rounded-full object-cover object-top ring-4 ring-accent/50"
                data-testid="img-leader-teaser"
              />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-accent">Leadership</p>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-white mt-1">
                  Led by Bishop JB Tajeu & a faithful pastoral team
                </h2>
                <p className="text-white/70 mt-1">Meet the shepherds who carry the vision.</p>
              </div>
              <Link
                href="/about/leadership"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-primary hover:bg-accent/90 transition-colors shrink-0"
                data-testid="link-leadership-team"
              >
                Meet the team
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="What guides us"
            title={<>Our <span className="gold-accent">Core Values</span></>}
            description="The foundational principles that guide everything we do as a church community."
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={staggerDir(index)}
                whileHover={{ y: -6 }}
                className="bento bg-primary p-7 text-white min-h-[260px] flex flex-col justify-between group overflow-hidden"
                data-testid={`card-value-${index}`}
              >
                <div aria-hidden className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${value.color} opacity-25 blur-2xl transition-opacity group-hover:opacity-50`} />
                <value.icon className="text-accent" size={36} />
                <div className="relative">
                  <p className="font-serif text-4xl font-black gold-accent">0{index + 1}</p>
                  <h4 className="text-xl font-bold mt-1" data-testid={`text-value-title-${index}`}>
                    {value.title}
                  </h4>
                  <p className="text-sm text-white/70 mt-1.5 leading-relaxed" data-testid={`text-value-description-${index}`}>
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute top-0 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4">
          <SectionHeading
            eyebrow="Impact"
            title={<span className="text-white">Our <span className="gold-accent">Impact</span></span>}
            description="See how God is working through BCC Church to transform lives and communities across Kenya."
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { n: 500, s: "+", label: "Families Supported Monthly", id: "families" },
              { n: 12, s: "", label: "Church Branches Established", id: "branches" },
              { n: 2000, s: "+", label: "Lives Transformed", id: "lives" },
            ].map((stat, i) => (
              <motion.div key={stat.id} variants={staggerDir(i)}>
                <Card className="bg-white/10 backdrop-blur border-white/20 text-center text-white card-hover" data-testid={`card-stat-${stat.id}`}>
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-accent mb-2 font-serif" data-testid={`text-stat-${stat.id}-number`}>
                      <Counter to={stat.n} suffix={stat.s} />
                    </div>
                    <p className="text-gray-200" data-testid={`text-stat-${stat.id}-label`}>{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
