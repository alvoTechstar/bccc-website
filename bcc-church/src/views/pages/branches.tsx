import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Users } from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading, Counter } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";
import { fallbackPhotos, photos, photoProps } from "@/lib/site";
import { DirectionsModal, type Destination } from "@/components/map/directions-modal";

export default function Branches() {
  const [directionsTo, setDirectionsTo] = useState<Destination>(null);
  const nakuruBranches = [
    {
      name: "BCC Church Headquarters",
      location: "Nakuru, Mawanga Kwa Budaa",
      pastor: "Bishop JB Tajeu",
      title: "Senior Pastor & Visionary Leader",
      established: "2010",
      congregation: "800+",
      phone: "+254 720 123 456",
      email: "headquarters@bccchurch.co.ke",
      services: [
        { day: "Sunday", time: "8:30 AM", type: "First Service" },
        { day: "Sunday", time: "10:30 AM", type: "Second Service" },
        { day: "Wednesday", time: "6:00 PM - 8:00 PM", type: "Bible Study" },
        { day: "Friday", time: "7:00 PM - 9:00 PM", type: "Prayer Night" }
      ],
      description: "Our main headquarters serves as the mother church, providing spiritual leadership and oversight to all branch churches across Kenya.",
      image: photos.congregation,
      fallback: fallbackPhotos.congregation,
      mapQuery: "Beautiful Courts Christian Church, Mawanga, Kwa Budaa, Nakuru, Kenya"
    },
    {
      name: "BCC Utawala Chapel",
      location: "Nakuru, Utawala Area",
      pastor: "Rev. Mary Kimani",
      title: "Local Pastor",
      established: "2015",
      congregation: "300+",
      phone: "+254 733 456 789",
      email: "utawala@bccchurch.co.ke",
      services: [
        { day: "Sunday", time: "10:30 AM", type: "Main Service" },
        { day: "Thursday", time: "6:30 PM - 8:30 PM", type: "Bible Study" }
      ],
      description: "A vibrant community church focusing on family ministry and youth development in the Utawala area.",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      mapQuery: "Utawala, Nakuru, Kenya"
    }
  ];

  const narokBranches = [
    {
      name: "BCC Narok Town",
      location: "Narok Town Center",
      pastor: "Bishop JB Tajeu",
      title: "Senior Pastor",
      established: "2012",
      congregation: "500+",
      phone: "+254 720 987 654",
      email: "naroktown@bccchurch.co.ke",
      services: [
        { day: "Sunday", time: "8:30 AM", type: "First Service" },
        { day: "Sunday", time: "10:30 AM", type: "Second Service" },
        { day: "Wednesday", time: "6:00 PM - 8:00 PM", type: "Bible Study" }
      ],
      description: "The main branch in Narok town, serving as a regional hub for church activities and community outreach programs.",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      mapQuery: "Narok Town, Narok, Kenya"
    },
    {
      name: "BCC Ololulunga",
      location: "Ololulunga Area",
      pastor: "Pastor Samuel Kirui",
      title: "Branch Pastor",
      established: "2014",
      congregation: "250+",
      phone: "+254 745 321 098",
      email: "ololulunga@bccchurch.co.ke",
      services: [
        { day: "Sunday", time: "10:30 AM", type: "Main Service" },
        { day: "Friday", time: "7:00 PM - 9:00 PM", type: "Prayer Meeting" }
      ],
      description: "Passionate about community outreach and youth development, serving the rural communities around Ololulunga.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      mapQuery: "Ololulunga, Narok, Kenya"
    },
  ];

  const smallerBranches = [
    { name: "BCC Olmokonge", pastor: "Pastor David Seur", congregation: "150+", established: "2016", mapQuery: "2MV2+69X Beautiful Courts Christian Church Olmokonge, Oloshapani" },
    { name: "BCC Enabelbel", pastor: "Pastor David Seur", congregation: "120+", established: "2017", mapQuery: "Enabelbel, Narok, Kenya" },
    { name: "BCC Olomayiana", pastor: "Pastor David Seur", congregation: "180+", established: "2018", mapQuery: "Olomayiana, Narok, Kenya" },
    { name: "BCC Melelo", pastor: "Pastor David Seur", congregation: "140+", established: "2019", mapQuery: "Melelo, Narok, Kenya" },
    { name: "BCC Olpukoti", pastor: "Pastor David Seur", congregation: "160+", established: "2020", mapQuery: "Olpukoti, Narok, Kenya" }
  ];

  const renderBranchCard = (branch: (typeof nakuruBranches)[number], index: number, prefix: string) => {
    const num = String((prefix === "narok" ? index + 3 : index + 1)).padStart(2, "0");
    return (
      <motion.div variants={staggerDir(prefix === "narok" ? index + 2 : index)}>
        <article
          className="group relative overflow-hidden rounded-[2rem] bg-primary shadow-xl ring-1 ring-white/10 h-full flex flex-col"
          data-testid={`card-${prefix}-branch-${index}`}
        >
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent/15 to-transparent" />
          {/* Photo with editorial overlay */}
          <div className="relative h-60 shrink-0 overflow-hidden">
            <img
              {...photoProps(branch.image, ("fallback" in branch && branch.fallback) || branch.image, branch.name)}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid={`img-${prefix}-branch-${index}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/25 to-transparent" />
            <span className="absolute left-6 top-2 font-serif text-7xl font-black text-white/30">{num}</span>
            <span className="absolute right-5 top-5">
              <Badge className="bg-accent text-primary border-0 font-black uppercase tracking-widest text-[11px]" data-testid={`badge-${prefix}-branch-type-${index}`}>
                {index === 0 && prefix === "nakuru" ? "Headquarters" : "Branch"}
              </Badge>
            </span>
            <div className="absolute bottom-0 inset-x-0 p-6">
              <h3 className="font-serif text-3xl font-bold text-white leading-tight" data-testid={`text-${prefix}-branch-name-${index}`}>
                {branch.name}
              </h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/75" data-testid={`text-${prefix}-branch-location-${index}`}>
                <MapPin size={14} className="text-accent" /> {branch.location}
              </p>
            </div>
          </div>

          {/* Details on navy */}
          <div className="p-6 lg:p-7 flex flex-col flex-1">
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5 text-white/80">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Users size={15} />
                </span>
                <span>
                  <strong className="text-white" data-testid={`text-${prefix}-branch-pastor-${index}`}>{branch.pastor}</strong>
                  <span className="text-white/60"> — {branch.title}</span>
                </span>
              </p>
              <p className="flex items-center gap-2.5 text-white/80">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Phone size={15} />
                </span>
                <span data-testid={`text-${prefix}-branch-phone-${index}`}>{branch.phone}</span>
              </p>
            </div>

            <p className="mt-4 text-[15px] text-white/65 leading-relaxed" data-testid={`text-${prefix}-branch-description-${index}`}>
              {branch.description}
            </p>

            <div className="mt-5 space-y-2">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-accent">
                <Clock size={14} /> Service times
              </h4>
              {branch.services.map((service, serviceIndex) => (
                <Reveal key={serviceIndex} delay={serviceIndex * 0.06} y={12}>
                  <div className="flex justify-between gap-3 text-sm rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5">
                    <span className="text-white/65">{service.day} · {service.type}</span>
                    <span className="text-accent font-bold whitespace-nowrap">{service.time}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5 pt-1">
              <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  size="sm"
                  className="btn-shine rounded-full bg-accent px-5 font-bold text-primary hover:bg-accent/90"
                  data-testid={`button-visit-${prefix}-${index}`}
                    onClick={() =>
                      setDirectionsTo({
                        name: branch.name,
                        query:
                          (branch as { mapQuery?: string }).mapQuery ??
                          branch.location,
                      })
                    }
                >
                  <MapPin className="mr-1.5" size={15} />
                  Get Directions
                </Button>
              </motion.span>
              <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button asChild variant="outline" size="sm" className="rounded-full border-white/25 px-5 text-white hover:bg-white/10 hover:text-accent" data-testid={`button-contact-${prefix}-${index}`}>
                  <a href="/contact">
                    <Mail className="mr-1.5" size={15} />
                    Contact
                  </a>
                </Button>
              </motion.span>
            </div>
          </div>
        </article>
      </motion.div>
    );
  };

  return (
    <div>
      <PageHero
        title={<>Our <span className="gold-accent">Church Branches</span></>}
        description="Beautiful Courts Christian Church has multiple locations across Nakuru and Narok counties, each serving their local communities with passion and dedication to spreading the Gospel."
      />

      {/* Statistics */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-4 gap-8 text-center"
            >
            {[
              { n: 12, s: "", label: "Total Branches", id: "total-branches" },
              { n: 2, s: "", label: "Counties Served", id: "counties" },
              { n: 2500, s: "+", label: "Total Members", id: "members" },
              { n: 8, s: "", label: "Pastoral Leaders", id: "leaders" },
            ].map((stat, i) => (
              <motion.div key={stat.id} variants={staggerDir(i)}>
                <div className="text-4xl font-bold text-accent mb-2 font-serif" data-testid={`text-stat-${stat.id}`}>
                  <Counter to={stat.n} suffix={stat.s} />
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Nakuru Branches */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Nakuru County"
            title={<><span className="gold-accent">Nakuru</span> County</>}
            description="Our branches in Nakuru County, including our headquarters and thriving community churches."
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="grid lg:grid-cols-2 gap-12"
          >
            {nakuruBranches.map((branch, index) => renderBranchCard(branch, index, "nakuru"))}
          </motion.div>
        </div>
      </section>

      {/* Narok Branches */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Narok County"
            title={<><span className="gold-accent">Narok</span> County</>}
            description="Our expanding presence in Narok County, reaching rural and urban communities with the Gospel."
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="grid lg:grid-cols-2 gap-12 mb-16"
          >
            {narokBranches.map((branch, index) => renderBranchCard(branch, index, "narok"))}
          </motion.div>

          {/* Smaller Branches under Pastor David Seur */}
          <Reveal>
            <Card className="shadow-xl card-hover">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-primary font-serif mb-2">
                    Rural Outreach Branches
                  </h3>
                  <p className="text-muted-foreground">
                    Led by <span className="font-medium text-primary">Pastor David Seur</span>, these branches serve rural communities across Narok County
                  </p>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {smallerBranches.map((branch, index) => (
                    <motion.div
                      key={index}
                      variants={staggerDir(index + 1)}
                      whileHover={{ y: -5 }}
                      className="relative overflow-hidden rounded-2xl bg-primary p-5 ring-1 ring-white/10 hover:ring-accent/50 hover:shadow-xl transition-all"
                      data-testid={`card-small-branch-${index}`}
                    >
                      <span className="absolute -right-1 -top-3 font-serif text-6xl font-black text-white/10">
                        {String(index + 5).padStart(2, "0")}
                      </span>
                      <h4 className="relative font-serif text-lg font-bold text-white" data-testid={`text-small-branch-name-${index}`}>
                        {branch.name}
                      </h4>
                      <div className="relative mt-2 space-y-1 text-[13px] text-white/65">
                        <p>Pastor: <span className="text-accent font-semibold" data-testid={`text-small-branch-pastor-${index}`}>{branch.pastor}</span></p>
                        <p>
                          <span className="text-white font-bold" data-testid={`text-small-branch-members-${index}`}>{branch.congregation}</span> members ·
                          Est. <span className="text-white" data-testid={`text-small-branch-established-${index}`}>{branch.established}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => setDirectionsTo({ name: branch.name, query: branch.mapQuery })}
                        className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-4 py-1.5 text-[13px] font-bold text-accent hover:bg-accent hover:text-primary transition-colors"
                        data-testid={`link-small-branch-directions-${index}`}
                      >
                        <MapPin size={14} /> Directions
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute top-0 right-1/4 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
                Visit <span className="gold-accent">Any Branch</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xl text-gray-200 mb-8">
                No matter where you are in Nakuru or Narok counties, there's a BCC Church branch near you.
                Come and experience the love of Christ in our welcoming community.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                  <Button
                    size="lg"
                    className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90"
                    data-testid="button-find-branch"
                    onClick={() =>
                      setDirectionsTo({
                        name: "BCC Church Headquarters",
                        query: "Beautiful Courts Christian Church, Mawanga, Kwa Budaa, Nakuru, Kenya",
                      })
                    }
                  >
                    <MapPin className="mr-2" size={20} />
                    Find Nearest Branch
                  </Button>
                </motion.span>
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                  <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" data-testid="button-plant-church">
                    <Users className="mr-2" size={20} />
                    Plant a Church
                  </Button>
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
