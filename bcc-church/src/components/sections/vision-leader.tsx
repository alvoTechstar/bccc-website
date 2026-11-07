import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { bishopFacebook, fallbackPhotos, photos, photoProps } from "@/lib/site";

export default function VisionLeader() {
  return (
    <section className="py-20 bg-muted overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Reveal>
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-8 text-primary">
              Our <span className="gold-accent">Visionary Leader</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
          <Card className="shadow-xl card-hover">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-1">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.04, rotate: 1 }}
                    {...photoProps(photos.bishop, fallbackPhotos.bishop, "Bishop JB Tajeu - Founder")}
                    data-photo="bishop"
                    className="rounded-full w-64 h-64 object-cover mx-auto shadow-lg ring-4 ring-accent/40"
                    data-testid="img-bishop-tajeu"
                  />
                </div>
                <div className="lg:col-span-2 text-left">
                  <h3 className="text-2xl font-bold text-primary mb-2" data-testid="text-bishop-name">Bishop JB Tajeu</h3>
                  <p className="text-accent font-semibold mb-4" data-testid="text-bishop-title">Founder, Bishop & Senior Pastor</p>
                  <blockquote className="text-lg text-muted-foreground italic leading-relaxed" data-testid="text-bishop-quote">
                    "God has called us to be a beacon of hope in our communities. Through Beautiful Courts Christian Church, 
                    we are not just building congregations, but transforming lives, strengthening families, and raising 
                    godly leaders who will impact generations. Our vision extends beyond the walls of our church to reach 
                    every corner of Kenya with the Gospel of Jesus Christ."
                  </blockquote>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a href={bishopFacebook} target="_blank" rel="noreferrer" data-testid="link-bishop-facebook">
                      <Button variant="outline" size="sm" className="rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                        <Facebook size={16} className="mr-2" /> Follow Bishop JB Tajeu
                      </Button>
                    </a>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground" data-testid="text-headquarters-location">
                      <svg className="inline w-4 h-4 mr-2 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Headquarters: Nakuru, Mawanga Kwa Budaa
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
