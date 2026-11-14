import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Church, Cross, Droplets, Flame, HandHeart, Heart, Sunrise } from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

const beliefs = [
  {
    icon: BookOpen,
    title: "The Bible",
    text: "The inspired, infallible Word of God — our final authority for faith, doctrine, and daily living.",
    ref: "2 Timothy 3:16–17",
  },
  {
    icon: Heart,
    title: "One God, Three Persons",
    text: "One eternal God revealed as Father, Son, and Holy Spirit — co-equal, co-eternal, perfect in love.",
    ref: "Deuteronomy 6:4 · Matthew 28:19",
  },
  {
    icon: Cross,
    title: "Jesus Christ",
    text: "Fully God and fully man — born of a virgin, crucified for our sins, risen, ascended, and coming again.",
    ref: "John 1:1–14 · 1 Cor. 15:3–4",
  },
  {
    icon: Flame,
    title: "The Holy Spirit",
    text: "Our Comforter and power for holy living — convicting, regenerating, baptizing, gifting, and guiding believers.",
    ref: "John 14:26 · Acts 1:8",
  },
  {
    icon: Sunrise,
    title: "Salvation by Grace",
    text: "All have sinned; all can be saved. Repentance toward God and faith in Jesus brings forgiveness and new birth.",
    ref: "Ephesians 2:8–9 · Romans 10:9",
  },
  {
    icon: Church,
    title: "The Church",
    text: "One body of believers across every nation — called to worship, fellowship, discipleship, and mission.",
    ref: "Matthew 16:18 · Acts 2:42–47",
  },
  {
    icon: Droplets,
    title: "Baptism & Communion",
    text: "Water baptism by immersion for every believer, and the Lord's Table in remembrance of Christ until He comes.",
    ref: "Matthew 28:19 · 1 Cor. 11:23–26",
  },
  {
    icon: HandHeart,
    title: "Holy Living & Giving",
    text: "A life set apart — loving God, loving people, serving faithfully, and giving cheerfully to advance His kingdom.",
    ref: "1 Peter 1:15–16 · Malachi 3:10",
  },
];

export default function Beliefs() {
  return (
    <div>
      <PageHero
        title={<>What We <span className="gold-accent">Believe</span></>}
        description="The unshakable foundations of Beautiful Courts Christian Church — what we confess, what we teach, and how we live."
      />

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Statement of faith"
            title={<>Anchored in <span className="gold-accent">the Word.</span></>}
            description="Eight convictions that shape every sermon, every ministry, and every gathering."
          />
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {beliefs.map((b, i) => (
              <motion.article
                key={b.title}
                variants={staggerDir(i)}
                whileHover={{ y: -6 }}
                className="bento bg-primary p-7 min-h-[300px] flex flex-col group overflow-hidden"
                data-testid={`card-belief-${i}`}
              >
                <div aria-hidden className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-accent/15 blur-2xl transition-opacity group-hover:opacity-100" />
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-accent p-3 text-primary shadow-lg w-fit">
                  <b.icon size={24} />
                </span>
                <p className="mt-5 font-serif text-lg font-black text-white/30">0{i + 1}</p>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">{b.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed flex-1">{b.text}</p>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.22em] text-accent">{b.ref}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <Reveal from="blur">
            <h2 className="display-section text-white">
              Believe it. <span className="gold-accent">Belong here.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12} from="up">
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8" data-testid="button-beliefs-visit">
                  Plan Your Visit <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/about/leadership">
                <Button size="lg" variant="outline" className="glass-pill text-white rounded-full px-8 border-white/30" data-testid="button-beliefs-leaders">
                  Meet Our Leaders
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
