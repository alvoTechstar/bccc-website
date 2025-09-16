import Hero from "@/components/sections/hero";
import VisionLeader from "@/components/sections/vision-leader";
import MissionVision from "@/components/sections/mission-vision";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Music, Camera, Users, Heart, Globe } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Home() {
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog/posts?limit=3");
      return response.json();
    },
  });

  const ministries = [
    {
      icon: Music,
      title: "Praise & Worship",
      description: "Leading the congregation in powerful worship experiences through music and spiritual expression.",
      color: "bg-blue-500"
    },
    {
      icon: Camera,
      title: "Media Ministry",
      description: "Capturing and sharing God's work through photography, videography, and social media outreach.",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Youth Ministry",
      description: "Empowering young people with strong biblical foundations and leadership skills.",
      color: "bg-green-500"
    }
  ];

  return (
    <div>
      <Hero />
      <VisionLeader />
      <MissionVision />
      
      {/* Featured Ministries */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
              Our <span className="gold-accent">Ministries</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the various ways you can grow in faith and serve the community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {ministries.map((ministry, index) => (
              <Card key={index} className="shadow-lg card-hover" data-testid={`card-ministry-${index}`}>
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${ministry.color} rounded-full flex items-center justify-center mb-4`}>
                    <ministry.icon className="text-white text-2xl" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3" data-testid={`text-ministry-title-${index}`}>
                    {ministry.title}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`text-ministry-description-${index}`}>
                    {ministry.description}
                  </p>
                  <Button variant="ghost" className="text-accent hover:text-accent/80 p-0" data-testid={`button-ministry-learn-more-${index}`}>
                    Learn More <ArrowRight size={16} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/ministries">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-view-all-ministries">
                View All Ministries <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
              Latest <span className="gold-accent">Updates</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay connected with inspiring stories and updates from our church community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {blogPosts.slice(0, 3).map((post) => (
              <Card key={post.id} className="shadow-lg overflow-hidden card-hover" data-testid={`card-blog-post-${post.id}`}>
                <img 
                  src={post.imageUrl || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300'} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  data-testid={`img-blog-post-${post.id}`}
                />
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge variant="outline" className="text-accent border-accent" data-testid={`badge-blog-category-${post.id}`}>
                      {post.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 font-serif" data-testid={`text-blog-title-${post.id}`}>
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed" data-testid={`text-blog-excerpt-${post.id}`}>
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" className="text-accent hover:text-accent/80 text-sm p-0" data-testid={`button-blog-read-more-${post.id}`}>
                    Read More <ArrowRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-view-all-blog">
                View All Posts <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
              Join Our <span className="gold-accent">Church Family</span>
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Experience the love of Christ and become part of a community that cares. 
              We welcome you to worship with us and discover your purpose in God's kingdom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-plan-visit">
                  <Heart className="mr-2" size={20} />
                  Plan Your Visit
                </Button>
              </Link>
              <Link href="/giving">
                <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" data-testid="button-support-mission">
                  <Globe className="mr-2" size={20} />
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
