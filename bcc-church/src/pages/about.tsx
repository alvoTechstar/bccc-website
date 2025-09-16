import { Card, CardContent } from "../components/ui/card";
import { Heart, Pill, Users, Globe } from "lucide-react";

export default function About() {
  const coreValues = [
    {
      icon: Heart,
      title: "Love",
      description: "Demonstrating Christ's unconditional love in all we do.",
      color: "bg-red-500"
    },
    {
      icon: Pill,
      title: "Faith",
      description: "Building unshakeable faith through God's Word and prayer.",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Creating strong, supportive Christian communities.",
      color: "bg-green-500"
    },
    {
      icon: Globe,
      title: "Mission",
      description: "Spreading the Gospel across Kenya and beyond.",
      color: "bg-purple-500"
    }
  ];

  const leaders = [
    {
      name: "Bishop JB Tajeu",
      role: "Senior Pastor & Visionary",
      description: "Leading BCC Church with wisdom and passion for over a decade.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Pastor David Seur",
      role: "Narok Region Leader",
      description: "Oversees five branch churches across Narok County.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Pastor Samuel Kirui",
      role: "BCC Ololulunga Pastor",
      description: "Passionate about community outreach and youth development.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    }
  ];

  return (
    
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold font-serif mb-6 text-white">
            About <span className="gold-accent">BCC Church</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover our story, meet our leadership team, and learn about the values that guide our mission 
            to transform lives across Kenya through the power of Jesus Christ.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-primary mb-6 font-serif" data-testid="text-our-story-title">Our Story</h3>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p data-testid="text-story-paragraph-1">
                    Beautiful Courts Christian Church began as a vision from God to establish a church that would transform communities across Kenya. Founded by Bishop JB Tajeu, our church has grown from a small gathering in Nakuru to a thriving network of congregations serving thousands across multiple counties.
                  </p>
                  <p data-testid="text-story-paragraph-2">
                    Our journey reflects God's faithfulness and the dedication of our members who have embraced the call to be disciples and disciple-makers. From our headquarters in Mawanga Kwa Budaa, we have expanded to serve communities in both urban and rural areas, adapting our ministry to meet the unique needs of each location.
                  </p>
                  <p data-testid="text-story-paragraph-3">
                    Today, BCC Church stands as a beacon of hope, offering not just spiritual nourishment but also practical support to families, youth, and communities throughout Kenya.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="African church community gathering and fellowship" 
                  className="rounded-2xl shadow-xl"
                  data-testid="img-church-community"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
              Our <span className="gold-accent">Leadership Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated leaders who guide our church with wisdom, passion, and unwavering faith.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {leaders.map((leader, index) => (
              <Card key={index} className="shadow-xl text-center" data-testid={`card-leader-${index}`}>
                <CardContent className="p-8">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    data-testid={`img-leader-${index}`}
                  />
                  <h4 className="text-xl font-bold text-primary mb-1" data-testid={`text-leader-name-${index}`}>
                    {leader.name}
                  </h4>
                  <p className="text-accent font-semibold mb-3" data-testid={`text-leader-role-${index}`}>
                    {leader.role}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-leader-description-${index}`}>
                    {leader.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
              Our <span className="gold-accent">Core Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The foundational principles that guide everything we do as a church community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <Card key={index} className="shadow-lg text-center card-hover" data-testid={`card-value-${index}`}>
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className="text-white text-2xl" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-2" data-testid={`text-value-title-${index}`}>
                    {value.title}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid={`text-value-description-${index}`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
              Our <span className="gold-accent">Impact</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              See how God is working through BCC Church to transform lives and communities across Kenya.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-center text-white" data-testid="card-stat-families">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-families-number">500+</div>
                <p className="text-gray-200" data-testid="text-stat-families-label">Families Supported Monthly</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20 text-center text-white" data-testid="card-stat-branches">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-branches-number">12</div>
                <p className="text-gray-200" data-testid="text-stat-branches-label">Church Branches Established</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20 text-center text-white" data-testid="card-stat-lives">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-lives-number">2000+</div>
                <p className="text-gray-200" data-testid="text-stat-lives-label">Lives Transformed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
