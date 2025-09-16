import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Heart } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-primary min-h-screen flex items-center african-pattern">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold text-primary-foreground font-serif mb-6">
              Welcome to 
              <span className="text-secondary block">BCC Church</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              "Where faith meets purpose and communities are transformed through the power of Christ. 
              Join us in our mission to spread love, hope, and spiritual growth across Kenya and beyond."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/contact">
                <Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors" 
                  data-testid="button-join-services"
                >
                  <Calendar className="mr-2" size={20} />
                  Join Our Services
                </Button>
              </Link>
              <Link href="/giving">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors" 
                  data-testid="button-give-online"
                >
                  <Heart className="mr-2" size={20} />
                  Give Online
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative animate-slide-up">
            <img 
              src="https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Beautiful church interior with warm lighting" 
              className="rounded-lg shadow-2xl animate-float"
              data-testid="img-church-interior"
            />
          </div>
        </div>
      </div>
    </section>
  );
}