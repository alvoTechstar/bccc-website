import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/contact/contact-form";
import { churchFacebook, mapsEmbed, youtubeChannelUrl } from "@/lib/site";
import { DirectionsModal, type Destination } from "@/components/map/directions-modal";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Calendar,
  Users,
  Heart
} from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { staggerContainer, staggerDir, staggerItemL, staggerItemR, fromScale } from "@/lib/animations";

export default function Contact() {
  const [directionsTo, setDirectionsTo] = useState<Destination>(null);
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: [
        "Beautiful Courts Christian Church",
        "Nakuru, Mawanga Kwa Budaa",
        "Nakuru County, Kenya"
      ]
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+254 720 123 456",
        "+254 733 789 012"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "info@bccchurch.co.ke",
        "pastor@bccchurch.co.ke"
      ]
    }
  ];

  const serviceTimes = [
    { day: "First Service (Sun)", time: "8:30 AM", type: "Worship" },
    { day: "Second Service (Sun)", time: "10:30 AM", type: "Worship" },
    { day: "Wednesday Bible Study", time: "6:00 PM - 8:00 PM", type: "Teaching" },
    { day: "Friday Prayer Night", time: "7:00 PM - 9:00 PM", type: "Prayer" },
    { day: "Saturday Youth Service", time: "2:00 PM - 5:00 PM", type: "Youth" }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "Plan Your Visit",
      description: "Join us for Sunday worship service",
      action: "View Service Times"
    },
    {
      icon: Users,
      title: "Join a Ministry",
      description: "Find your place in our church family",
      action: "Explore Ministries"
    },
    {
      icon: Heart,
      title: "Prayer Request",
      description: "Our prayer team is here for you",
      action: "Submit Request"
    },
    {
      icon: MessageCircle,
      title: "Pastoral Care",
      description: "Schedule counseling or guidance",
      action: "Book Appointment"
    }
  ];

  return (
    <div>
      <PageHero
        title={<>Get In <span className="gold-accent">Touch</span></>}
        description="We'd love to hear from you. Reach out to us for prayers, questions, church membership, or to learn more about joining our church family."
      />

      {/* Contact Form and Info */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Reveal from="left">
                <ContactForm />
              </Reveal>

              {/* Contact Information — editorial navy cards */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-5"
              >
                {/* Headquarters Contact */}
                <motion.div variants={staggerItemL}>
                  <article className="relative overflow-hidden rounded-[2rem] bg-primary p-7 lg:p-8 shadow-xl ring-1 ring-white/10">
                    <span className="absolute -right-2 -top-4 font-serif text-8xl font-black text-white/[0.07]">01</span>
                    <h3 className="relative font-serif text-2xl font-bold text-white mb-6" data-testid="text-headquarters-title">
                      Headquarters
                    </h3>
                    <div className="relative space-y-4">
                      {contactInfo.map((info, index) => (
                        <Reveal key={index} delay={index * 0.07} y={14}>
                          <div className="flex items-start group">
                            <motion.div
                              whileHover={{ scale: 1.12, rotate: -8 }}
                              className="w-12 h-12 gold-surface rounded-2xl flex items-center justify-center mr-4 mt-0.5 shadow shrink-0"
                            >
                              <info.icon className="text-primary" size={20} />
                            </motion.div>
                            <div>
                              <h4 className="font-bold text-white mb-1" data-testid={`text-contact-${index}-title`}>
                                {info.title}
                              </h4>
                              {info.details.map((detail, detailIndex) => (
                                <p key={detailIndex} className="text-white/65 text-[15px]" data-testid={`text-contact-${index}-detail-${detailIndex}`}>
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </article>
                </motion.div>

                {/* Service Times */}
                <motion.div variants={staggerItemR}>
                  <article className="relative overflow-hidden rounded-[2rem] bg-primary p-7 lg:p-8 shadow-xl ring-1 ring-white/10">
                    <span className="absolute -right-2 -top-4 font-serif text-8xl font-black text-white/[0.07]">02</span>
                    <h3 className="relative font-serif text-2xl font-bold text-white mb-6 flex items-center gap-2.5" data-testid="text-service-times-title">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                        <Clock size={20} />
                      </span>
                      Service Times
                    </h3>
                    <div className="relative space-y-2">
                      {serviceTimes.map((service, index) => (
                        <Reveal key={index} delay={index * 0.06} y={12}>
                          <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 py-2.5 px-3.5 rounded-xl border border-white/10 bg-white/[0.06] hover:border-accent/40 transition-colors">
                            <div className="min-w-0">
                              <span className="font-bold text-white text-[15px]" data-testid={`text-service-${index}-day`}>
                                {service.day}
                              </span>
                              <span className="text-xs text-white/50 ml-2">({service.type})</span>
                            </div>
                            <span className="text-accent text-sm font-bold shrink-0" data-testid={`text-service-${index}-time`}>
                              {service.time}
                            </span>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </article>
                </motion.div>

                {/* Social Media */}
                <motion.div variants={fromScale}>
                  <article className="relative overflow-hidden rounded-[2rem] bg-primary p-7 lg:p-8 shadow-xl ring-1 ring-white/10">
                    <span className="absolute -right-2 -top-4 font-serif text-8xl font-black text-white/[0.07]">03</span>
                    <h3 className="relative font-serif text-2xl font-bold text-white mb-2" data-testid="text-social-media-title">
                      Follow Us
                    </h3>
                    <p className="relative text-sm text-white/60 mb-5">Daily encouragement, live alerts & testimonies.</p>
                    <div className="relative flex flex-col min-[420px]:flex-row gap-3">
                      <motion.a
                        href={churchFacebook}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.06, y: -3 }}
                        whileTap={{ scale: 0.94 }}
                        className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-[#1877F2] px-5 py-3.5 font-bold text-white shadow-lg min-w-0"
                        data-testid="link-social-facebook"
                        aria-label="Facebook"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="truncate">Facebook</span>
                      </motion.a>
                      <motion.a
                        href={youtubeChannelUrl}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.06, y: -3 }}
                        whileTap={{ scale: 0.94 }}
                        className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-[#FF0000] px-5 py-3.5 font-bold text-white shadow-lg min-w-0"
                        data-testid="link-social-youtube"
                        aria-label="YouTube"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="truncate">YouTube</span>
                      </motion.a>
                    </div>
                  </article>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="We're here"
              title={<>How Can We <span className="gold-accent">Help?</span></>}
              description="Whether you're looking to visit us, join a ministry, request prayer, or need pastoral care, we're here to support you on your spiritual journey."
            />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {quickActions.map((action, index) => (
                <motion.div key={index} variants={staggerDir(index + 1)}>
                  <article
                    className="group relative overflow-hidden rounded-[1.75rem] bg-primary p-6 text-center h-full ring-1 ring-white/10 hover:ring-accent/50 hover:-translate-y-1.5 transition-all duration-300"
                    data-testid={`card-quick-action-${index}`}
                  >
                    <span className="absolute -right-1 -top-3 font-serif text-6xl font-black text-white/[0.08]">
                      0{index + 1}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -8 }}
                      className="relative w-14 h-14 gold-surface rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <action.icon className="text-primary" size={28} />
                    </motion.div>
                    <h4 className="relative text-lg font-bold text-white mb-1.5" data-testid={`text-action-title-${index}`}>
                      {action.title}
                    </h4>
                    <p className="relative text-sm text-white/60 mb-4" data-testid={`text-action-description-${index}`}>
                      {action.description}
                    </p>
                    <button className="relative text-accent font-bold text-sm hover:underline group-hover:tracking-wide transition-all" data-testid={`button-action-${index}`}>
                      {action.action} →
                    </button>
                  </article>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Map Placeholder */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Visit us"
              title={<>Find <span className="gold-accent">Us</span></>}
              description="Located in the heart of Nakuru at Mawanga Kwa Budaa, our church is easily accessible and welcomes visitors from all backgrounds."
            />

            <Reveal from="scale">
              <Card className="shadow-xl overflow-hidden card-hover group">
                <div className="grid md:grid-cols-2">
                  <div className="min-h-96">
                    <iframe
                      src={mapsEmbed}
                      title="Map — Beautiful Courts Christian Church, Mawanga Kwa Budaa"
                      className="h-full min-h-96 w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      data-testid="map-headquarters"
                    />
                  </div>
                  <div className="bg-gradient-to-br from-primary to-royal p-8 lg:p-10 flex flex-col justify-center text-white relative overflow-hidden">
                    <div aria-hidden className="absolute inset-0 african-pattern opacity-60" />
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <MapPin className="w-12 h-12 text-accent mb-4" />
                      <h3 className="text-2xl font-bold font-serif mb-2">Beautiful Courts Christian Church</h3>
                      <p className="text-white/75 mb-6">
                        Nakuru, Mawanga Kwa Budaa<br />
                        Nakuru County, Kenya
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
                          data-testid="button-map-directions"
                          onClick={() =>
                            setDirectionsTo({
                              name: "BCC Church Headquarters",
                              query: "Beautiful Courts Christian Church, Mawanga, Kwa Budaa, Nakuru, Kenya",
                            })
                          }
                        >
                          <MapPin size={18} className="mr-2" /> Get Directions
                        </Button>
                        <a href="tel:+254720123456" data-testid="button-map-call">
                          <Button variant="outline" className="glass-pill text-white rounded-full border-white/30">
                            <Phone size={18} className="mr-2" /> Call Us
                          </Button>
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Reveal from="rotate-l">
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
                Ready to <span className="gold-accent">Connect?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} from="rotate-r">
              <p className="text-xl text-gray-200 mb-8">
                Don't hesitate to reach out. Our pastoral team and church family are eager to welcome you
                and support you in your faith journey.
              </p>
            </Reveal>
            <Reveal delay={0.18} from="up">
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto sm:max-w-none">
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block w-full sm:w-auto">
                  <button className="btn-shine bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:bg-accent/90 transition-colors w-full sm:w-auto text-sm sm:text-base" data-testid="button-schedule-visit">
                    <Calendar className="mr-2 inline" size={20} />
                    Schedule a Visit
                  </button>
                </motion.span>
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block w-full sm:w-auto">
                  <button className="border-2 border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto text-sm sm:text-base" data-testid="button-emergency-prayer">
                    <Heart className="mr-2 inline" size={20} />
                    Emergency Prayer Line
                  </button>
                </motion.span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <DirectionsModal destination={directionsTo} onClose={() => setDirectionsTo(null)} />
    </div>
  );
}
