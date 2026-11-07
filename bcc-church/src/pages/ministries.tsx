import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Music,
  Camera,
  Users,
  Heart,
  Baby,
  HandHeart,
  BookOpen,
  Mic,
  Headphones,
  UserCheck
} from "lucide-react";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

const ministryImages = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
];

export default function Ministries() {
  const ministries = [
    {
      icon: Music,
      title: "Praise & Worship",
      description: "Leading the congregation in powerful worship experiences through music, song, and spiritual expression that connects hearts to God. Our worship team creates an atmosphere where believers can encounter God's presence through contemporary and traditional worship styles.",
      color: "bg-blue-500",
      leader: "Worship Team",
      meetingTime: "Sunday 8:30 AM",
      contact: "worship@bccchurch.co.ke"
    },
    {
      icon: Camera,
      title: "Media Ministry",
      description: "Capturing and sharing God's work through photography, videography, live streaming, and social media outreach to expand our reach. We document testimonies, events, and church activities to inspire and connect with our global community.",
      color: "bg-purple-500",
      leader: "Media Team",
      meetingTime: "As needed",
      contact: "media@bccchurch.co.ke"
    },
    {
      icon: Users,
      title: "Youth Ministry",
      description: "Empowering young people with strong biblical foundations, leadership skills, and opportunities for spiritual and personal growth. We focus on mentorship, discipleship, and creating a safe space for youth to explore their faith.",
      color: "bg-green-500",
      leader: "Pastor Samuel Kirui",
      meetingTime: "Saturday 2:00 PM",
      contact: "youth@bccchurch.co.ke"
    },
    {
      icon: Heart,
      title: "Women's Ministry",
      description: "Supporting women in their spiritual journey through fellowship, mentorship, prayer groups, and community service initiatives. We provide a platform for women to grow in faith, build relationships, and develop their gifts.",
      color: "bg-pink-500",
      leader: "Women's Ministry Team",
      meetingTime: "Wednesday 10:00 AM",
      contact: "women@bccchurch.co.ke"
    },
    {
      icon: Baby,
      title: "Children's Ministry",
      description: "Creating safe, fun, and educational environments where children can learn about Jesus, build friendships, and develop strong faith foundations. Our programs are age-appropriate and designed to nurture young hearts.",
      color: "bg-yellow-500",
      leader: "Children's Team",
      meetingTime: "Sunday 9:00 AM",
      contact: "children@bccchurch.co.ke"
    },
    {
      icon: HandHeart,
      title: "Outreach Ministry",
      description: "Serving our local communities through food distribution, healthcare support, education programs, and evangelistic outreach activities. We demonstrate Christ's love through practical acts of service and compassion.",
      color: "bg-red-500",
      leader: "Pastor David Seur",
      meetingTime: "Monthly Programs",
      contact: "outreach@bccchurch.co.ke"
    },
    {
      icon: BookOpen,
      title: "Bible Study Groups",
      description: "Deepening understanding of God's Word through small group Bible studies, theological discussions, and discipleship programs. We offer various study groups for different age groups and spiritual maturity levels.",
      color: "bg-indigo-500",
      leader: "Church Elders",
      meetingTime: "Wednesday 6:00 PM",
      contact: "biblestudy@bccchurch.co.ke"
    },
    {
      icon: Mic,
      title: "Evangelism Ministry",
      description: "Reaching the lost and unchurched through street evangelism, door-to-door ministry, and community events. We train believers to share the Gospel effectively and with love in their daily interactions.",
      color: "bg-orange-500",
      leader: "Evangelism Team",
      meetingTime: "Saturday 10:00 AM",
      contact: "evangelism@bccchurch.co.ke"
    },
    {
      icon: Headphones,
      title: "Prayer Ministry",
      description: "Interceding for the church, community, and nation through organized prayer meetings, prayer chains, and spiritual warfare. We believe in the power of prayer to transform lives and circumstances.",
      color: "bg-teal-500",
      leader: "Prayer Warriors",
      meetingTime: "Friday 7:00 PM",
      contact: "prayer@bccchurch.co.ke"
    },
    {
      icon: UserCheck,
      title: "Discipleship Ministry",
      description: "Mentoring new believers and helping them grow in their faith through one-on-one discipleship, leadership training, and spiritual development programs. We equip saints for the work of ministry.",
      color: "bg-cyan-500",
      leader: "Discipleship Team",
      meetingTime: "Flexible Schedule",
      contact: "discipleship@bccchurch.co.ke"
    }
  ];

  return (
    <div>
      <PageHero
        title={<>Our <span className="gold-accent">Ministries</span></>}
        description="Discover the various ways you can grow in faith, serve the community, and use your gifts to build God's kingdom through our diverse ministry programs."
      />

      {/* Ministries Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Serve with us"
            title={<>Find Your <span className="gold-accent">Calling</span></>}
            description="Every believer has been gifted by God to serve in His kingdom. Explore our ministries and discover where your passion and God's purpose intersect."
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {ministries.map((ministry, index) => (
              <motion.article
                key={index}
                variants={staggerDir(index)}
                className="media-card group min-h-[480px] flex"
                data-testid={`card-ministry-${index}`}
              >
                <img
                  src={ministryImages[index % ministryImages.length]}
                  alt={ministry.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-5 top-5 z-[2] rounded-full bg-white/15 border border-white/30 backdrop-blur px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-white">
                  {ministry.meetingTime}
                </span>
                <div className="media-card-body p-6 w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${ministry.color} text-white shadow-lg`}>
                      <ministry.icon size={22} />
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white leading-tight" data-testid={`text-ministry-title-${index}`}>
                      {ministry.title}
                    </h3>
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed line-clamp-3 mb-4" data-testid={`text-ministry-description-${index}`}>
                    {ministry.description}
                  </p>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur px-4 py-3 text-[13px]">
                    <span className="text-white/80" data-testid={`text-ministry-leader-${index}`}>
                      {ministry.leader}
                    </span>
                    <span className="text-accent font-bold" data-testid={`button-ministry-join-${index}`}>
                      Join →
                    </span>
                  </div>
                  <span className="sr-only" data-testid={`text-ministry-time-${index}`}>{ministry.meetingTime}</span>
                  <span className="sr-only" data-testid={`text-ministry-contact-${index}`}>{ministry.contact}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
                Ready to <span className="gold-accent">Get Involved?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xl text-muted-foreground mb-8">
                Don't see a ministry that fits your passion? We'd love to help you discover your calling
                or even start a new ministry that serves our community's needs.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                  <Button size="lg" className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-volunteer">
                    <Heart className="mr-2" size={20} />
                    Volunteer Today
                  </Button>
                </motion.span>
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" data-testid="button-ministry-info">
                    <BookOpen className="mr-2" size={20} />
                    Get More Information
                  </Button>
                </motion.span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
