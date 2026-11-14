import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden african-pattern px-4 py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-16 left-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="animate-blob absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-globe/25 blur-3xl" style={{ animationDelay: "-5s" }} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg"
      >
        <Card className="shadow-2xl overflow-hidden">
          <div className="h-1.5 gold-surface" />
          <CardContent className="p-10 text-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 gold-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Compass className="text-primary" size={40} />
            </motion.div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-2">Lost & found</p>
            <h1 className="text-6xl font-black font-serif text-primary mb-3">
              4<span className="gold-accent">0</span>4
            </h1>
            <p className="text-xl font-semibold text-primary mb-2">This path leads elsewhere, traveller.</p>
            <p className="text-muted-foreground mb-8">
              "I am the way and the truth and the life." — John 14:6.<br />
              Let's get you back to the church family.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button size="lg" className="btn-shine bg-primary text-primary-foreground hover:bg-royal">
                  <Home className="mr-2" size={18} /> Back Home
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2" size={18} /> Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
