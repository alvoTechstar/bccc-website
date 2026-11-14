import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MpesaModal from "@/components/giving/mpesa-modal";
import {
  ArrowRight,
  CreditCard,
  Building,
  Globe,
  Heart,
  Users,
  Home,
  Smartphone,
  Banknote
} from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading, Counter } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
// staggerDir(index) cycles left / down / right / scale so cards never enter from one side

export default function Giving() {
  const [mpesaOpen, setMpesaOpen] = useState(false);
  const givingOptions = [
    {
      icon: Smartphone,
      title: "M-Pesa (Recommended)",
      description: "Quick and secure mobile money transfer",
      payBill: "522522",
      account: "BCC CHURCH",
      color: "bg-green-500",
      recommended: true,
      action: "mpesa" as const
    },
    {
      icon: Building,
      title: "Bank Transfer",
      description: "Direct bank deposit",
      details: {
        bank: "Equity Bank",
        account: "0123456789",
        name: "Beautiful Courts Christian Church"
      },
      color: "bg-blue-500",
      recommended: false
    },
    {
      icon: Globe,
      title: "International Giving",
      description: "For our diaspora members and international supporters",
      details: "PayPal and international wire transfers available",
      color: "bg-purple-500",
      recommended: false
    }
  ];

  const givingTypes = [
    {
      icon: Heart,
      title: "Tithe",
      description: "Your faithful 10% offering to God",
      purpose: "Supporting church operations and ministry work"
    },
    {
      icon: Users,
      title: "General Offering",
      description: "Free-will offerings for church needs",
      purpose: "Monthly expenses and community programs"
    },
    {
      icon: Home,
      title: "Building Fund",
      description: "Support our new sanctuary construction",
      purpose: "1,000-seat sanctuary project completion"
    },
    {
      icon: Globe,
      title: "Mission Support",
      description: "Funding evangelism and church planting",
      purpose: "Expanding to new regions and countries"
    }
  ];

  const impactStats = [
    { number: 500, suffix: "+", label: "Families Supported Monthly", icon: Users },
    { number: 12, suffix: "", label: "Church Branches Established", icon: Building },
    { number: 2000, suffix: "+", label: "Lives Transformed", icon: Heart },
    { number: 75, suffix: "%", label: "New Sanctuary Complete", icon: Home }
  ];

  return (
    <div>
      <PageHero
        title={<>Support Our <span className="gold-accent">Mission</span></>}
        description="Your generous gifts help us expand God's kingdom, support local communities, and transform lives across Kenya. Every contribution makes a difference."
      />

      {/* Giving Options and Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Give securely"
              title={<>Ways to <span className="gold-accent">Give</span></>}
              description="Choose the most convenient method for you to support our ministry and mission."
            />

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Giving Options */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-6"
              >
                <Reveal>
                  <h3 className="text-2xl font-bold text-primary font-serif mb-6 flex items-center gap-2">
                    <CreditCard className="text-accent" size={24} /> Payment Methods
                  </h3>
                </Reveal>

                {givingOptions.map((option, index) => (
                  <motion.div key={index} variants={staggerDir(index)}>
                    <article
                      onClick={() => option.action === "mpesa" && setMpesaOpen(true)}
                      onKeyDown={(e) => {
                        if (option.action === "mpesa" && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          setMpesaOpen(true);
                        }
                      }}
                      role={option.action === "mpesa" ? "button" : undefined}
                      tabIndex={option.action === "mpesa" ? 0 : undefined}
                      className={`relative overflow-hidden rounded-[1.75rem] bg-primary p-6 shadow-xl ring-1 hover:-translate-y-1 transition-all duration-300 ${
                        option.recommended ? "ring-2 ring-accent" : "ring-white/10 hover:ring-accent/50"
                      } ${option.action === "mpesa" ? "cursor-pointer" : ""}`}
                      data-testid={`card-giving-option-${index}`}
                    >
                      <span className="absolute -right-1 -top-3 font-serif text-7xl font-black text-white/[0.07]">
                        0{index + 1}
                      </span>
                      <div className="relative flex items-start">
                        <motion.div
                          whileHover={{ rotate: -10, scale: 1.1 }}
                          className={`w-12 h-12 ${option.color} rounded-2xl flex items-center justify-center mr-4 mt-1 shadow-lg shrink-0`}
                        >
                          <option.icon className="text-white" size={24} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h4 className="text-lg font-bold text-white" data-testid={`text-option-title-${index}`}>
                              {option.title}
                            </h4>
                            {option.recommended && (
                              <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                <Badge className="bg-accent text-primary border-0 text-[11px] font-black uppercase tracking-wider">
                                  Recommended
                                </Badge>
                              </motion.span>
                            )}
                          </div>
                          <p className="text-white/60 text-[15px] mb-3" data-testid={`text-option-description-${index}`}>
                            {option.description}
                          </p>

                          {option.payBill && (
                            <div className="space-y-1 text-sm rounded-xl border border-accent/30 bg-accent/[0.08] px-3.5 py-2.5">
                              <p className="text-white/60">
                                Pay Bill: <span className="font-black text-accent text-base tracking-wide" data-testid={`text-paybill-${index}`}>{option.payBill}</span>
                              </p>
                              <p className="text-white/60">
                                Account: <span className="font-bold text-white" data-testid={`text-account-${index}`}>{option.account}</span>
                              </p>
                            </div>
                          )}

                          {option.details && typeof option.details === 'object' && (
                            <div className="space-y-1 text-sm rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5">
                              <p className="text-white/60">
                                Bank: <span className="font-bold text-white">{option.details.bank}</span>
                              </p>
                              <p className="text-white/60">
                                Account: <span className="font-bold text-white">{option.details.account}</span>
                              </p>
                              <p className="text-white/60">
                                Name: <span className="font-bold text-white">{option.details.name}</span>
                              </p>
                            </div>
                          )}

                          {option.details && typeof option.details === 'string' && (
                            <p className="text-sm text-white/60">{option.details}</p>
                          )}

                          {option.action === "mpesa" && (
                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-widest text-primary" data-testid="button-give-mpesa">
                              Tap to give via M-Pesa <ArrowRight size={14} />
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </motion.div>
                ))}

                <Reveal delay={0.1}>
                  <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-muted-foreground">
                    <Banknote className="text-green-600 shrink-0" size={20} />
                    Tapping M-Pesa opens a secure checkout — enter your number, approve the prompt, done.
                  </div>
                </Reveal>
              </motion.div>

              {/* Quick Give Form */}
              <Reveal delay={0.12} from="right">
                <article className="relative overflow-hidden rounded-[2rem] bg-primary p-7 lg:p-8 shadow-xl ring-1 ring-accent/40 text-center">
                  <span className="absolute -right-2 -top-4 font-serif text-8xl font-black text-white/[0.07]">04</span>
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 shadow-lg"
                  >
                    <Smartphone className="text-white" size={30} />
                  </motion.div>
                  <h3 className="relative font-serif text-2xl font-bold text-white mb-2">
                    Give in seconds
                  </h3>
                  <p className="relative text-white/65 text-[15px] mb-6 max-w-sm mx-auto">
                    Tap below, enter the amount and your M-Pesa number — approve the STK push on your phone and you're done.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setMpesaOpen(true)}
                    className="btn-shine relative w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold"
                    data-testid="button-give-mpesa-cta"
                  >
                    <Heart className="mr-2" size={18} /> Give with M-Pesa
                  </Button>
                  <p className="relative mt-4 text-xs text-white/50">
                    Prefer till or bank? The details are on the left.
                  </p>
                </article>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <MpesaModal open={mpesaOpen} onOpenChange={setMpesaOpen} />

      {/* Giving Types */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Where it goes"
              title={<>Types of <span className="gold-accent">Giving</span></>}
              description="Understand how your contributions support different aspects of our ministry and mission."
            />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-2 gap-8"
            >
              {givingTypes.map((type, index) => (
                <motion.div key={index} variants={staggerDir(index + 2)}>
                  <article
                    className="group relative overflow-hidden rounded-[1.75rem] bg-primary p-6 lg:p-7 h-full ring-1 ring-white/10 hover:ring-accent/50 hover:-translate-y-1.5 transition-all duration-300"
                    data-testid={`card-giving-type-${index}`}
                  >
                    <div aria-hidden className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-accent/15 blur-2xl transition-opacity group-hover:opacity-100" />
                    <span className="absolute right-5 top-3 font-serif text-6xl font-black text-white/[0.08]">
                      0{index + 1}
                    </span>
                    <div className="relative flex items-start">
                      <motion.div
                        whileHover={{ scale: 1.12, rotate: -8 }}
                        className="w-12 h-12 gold-surface rounded-2xl flex items-center justify-center mr-4 shadow-lg shrink-0"
                      >
                        <type.icon className="text-primary" size={24} />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1.5" data-testid={`text-type-title-${index}`}>
                          {type.title}
                        </h3>
                        <p className="text-white/60 text-[15px] mb-2.5" data-testid={`text-type-description-${index}`}>
                          {type.description}
                        </p>
                        <p className="text-sm text-accent font-bold" data-testid={`text-type-purpose-${index}`}>
                          → {type.purpose}
                        </p>
                      </div>
                    </div>
                  </article>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute top-0 left-1/4 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Fruit"
              title={<span className="text-white">Your <span className="gold-accent">Impact</span></span>}
              description="See how your faithful giving is making a real difference in our community and beyond."
            />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {impactStats.map((stat, index) => (
                <motion.div key={index} variants={staggerDir(index + 1)}>
                  <Card className="relative overflow-hidden bg-white/[0.07] backdrop-blur border-white/15 text-center text-white hover:border-accent/50 hover:-translate-y-1.5 transition-all duration-300 group" data-testid={`card-impact-stat-${index}`}>
                    <span className="absolute -right-1 -top-3 font-serif text-7xl font-black text-white/[0.08]">
                      0{index + 1}
                    </span>
                    <CardContent className="relative p-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -6 }}
                        className="w-14 h-14 gold-surface rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      >
                        <stat.icon className="text-primary" size={28} />
                      </motion.div>
                      <div className="text-4xl font-black gold-accent mb-1.5 font-serif" data-testid={`text-stat-number-${index}`}>
                        <Counter to={stat.number} suffix={stat.suffix} />
                      </div>
                      <p className="text-gray-200 text-[13px] font-semibold uppercase tracking-wider" data-testid={`text-stat-label-${index}`}>
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal from="down">
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-8 text-primary">
                Biblical <span className="gold-accent">Foundation</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12} from="blur">
              <Card className="shadow-xl card-hover overflow-hidden">
                <div className="h-1.5 gold-surface" />
                <CardContent className="p-8 lg:p-12">
                  <motion.blockquote
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-2xl font-serif italic text-primary mb-6 leading-relaxed"
                  >
                    "Bring the whole tithe into the storehouse, that there may be food in my house.
                    Test me in this," says the Lord Almighty, "and see if I will not throw open the
                    floodgates of heaven and pour out so much blessing that there will not be room enough to store it."
                  </motion.blockquote>
                  <cite className="text-accent font-semibold">— Malachi 3:10</cite>

                  <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Giving is not just about supporting the church—it's about participating in God's work
                      and experiencing His faithfulness. When we give cheerfully and sacrificially, we open
                      ourselves to receive God's abundant blessings while advancing His kingdom on earth.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <Reveal>
            <Card className="max-w-4xl mx-auto card-hover">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-primary">Secure & Transparent</h3>
                </div>
                <p className="text-muted-foreground">
                  All donations are processed securely and encrypted. Financial reports are available to members,
                  and we maintain full transparency in how your gifts are used for ministry and community impact.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
