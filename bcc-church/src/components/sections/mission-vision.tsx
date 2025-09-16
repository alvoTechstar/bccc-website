import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="py-20 bg-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="bg-white/95 backdrop-blur shadow-xl card-hover">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4">
                  <Target className="text-primary text-2xl" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-primary font-serif" data-testid="text-mission-title">Our Mission</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-mission-content">
                To evangelize the world through the power of the Holy Spirit, establishing strong Christian communities 
                that worship God in spirit and truth, while demonstrating Christ's love through practical service to humanity. 
                We are committed to raising disciples who will impact their communities and nations for the Kingdom of God.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur shadow-xl card-hover">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4">
                  <Eye className="text-primary text-2xl" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-primary font-serif" data-testid="text-vision-title">Our Vision</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-vision-content">
                To be a thriving, multicultural church community that transforms lives across Kenya and East Africa. 
                We envision established churches in every major city and town, equipped with passionate leaders who 
                will plant more churches, establish training centers, and create sustainable community development programs 
                that reflect God's love and justice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
