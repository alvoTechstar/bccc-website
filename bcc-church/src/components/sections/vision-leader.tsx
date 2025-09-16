import { Card, CardContent } from "@/components/ui/card";

export default function VisionLeader() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-8 text-primary">
            Our <span className="gold-accent">Visionary Leader</span>
          </h2>
          
          <Card className="shadow-xl">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-1">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400" 
                    alt="Bishop JB Tajeu - Visionary Leader" 
                    className="rounded-full w-64 h-64 object-cover mx-auto shadow-lg"
                    data-testid="img-bishop-tajeu"
                  />
                </div>
                <div className="lg:col-span-2 text-left">
                  <h3 className="text-2xl font-bold text-primary mb-2" data-testid="text-bishop-name">Bishop JB Tajeu</h3>
                  <p className="text-accent font-semibold mb-4" data-testid="text-bishop-title">Visionary Leader & Senior Pastor</p>
                  <blockquote className="text-lg text-muted-foreground italic leading-relaxed" data-testid="text-bishop-quote">
                    "God has called us to be a beacon of hope in our communities. Through Beautiful Courts Christian Church, 
                    we are not just building congregations, but transforming lives, strengthening families, and raising 
                    godly leaders who will impact generations. Our vision extends beyond the walls of our church to reach 
                    every corner of Kenya with the Gospel of Jesus Christ."
                  </blockquote>
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
        </div>
      </div>
    </section>
  );
}
