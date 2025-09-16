import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GivingForm from "@/components/giving/giving-form";
import { 
  CreditCard, 
  Building, 
  Globe, 
  Heart, 
  Users, 
  Home,
  Smartphone,
  Banknote
} from "lucide-react";

export default function Giving() {
  const givingOptions = [
    {
      icon: Smartphone,
      title: "M-Pesa (Recommended)",
      description: "Quick and secure mobile money transfer",
      payBill: "522522",
      account: "BCC CHURCH",
      color: "bg-green-500",
      recommended: true
    },
    {
      icon: Building,
      title: "Bank Transfer",
      description: "Direct bank deposit",
      details: {
        bank: "Equity Bank",
        account: "0123456789",
        name: "Beautiful Courts Christian Church"
      },
      color: "bg-blue-500",
      recommended: false
    },
    {
      icon: Globe,
      title: "International Giving",
      description: "For our diaspora members and international supporters",
      details: "PayPal and international wire transfers available",
      color: "bg-purple-500",
      recommended: false
    }
  ];

  const givingTypes = [
    {
      icon: Heart,
      title: "Tithe",
      description: "Your faithful 10% offering to God",
      purpose: "Supporting church operations and ministry work"
    },
    {
      icon: Users,
      title: "General Offering",
      description: "Free-will offerings for church needs",
      purpose: "Monthly expenses and community programs"
    },
    {
      icon: Home,
      title: "Building Fund",
      description: "Support our new sanctuary construction",
      purpose: "1,000-seat sanctuary project completion"
    },
    {
      icon: Globe,
      title: "Mission Support",
      description: "Funding evangelism and church planting",
      purpose: "Expanding to new regions and countries"
    }
  ];

  const impactStats = [
    { number: "500+", label: "Families Supported Monthly", icon: Users },
    { number: "12", label: "Church Branches Established", icon: Building },
    { number: "2000+", label: "Lives Transformed", icon: Heart },
    { number: "75%", label: "New Sanctuary Complete", icon: Home }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold font-serif mb-6 text-white">
            Support Our <span className="gold-accent">Mission</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Your generous gifts help us expand God's kingdom, support local communities, 
            and transform lives across Kenya. Every contribution makes a difference.
          </p>
        </div>
      </section>

      {/* Giving Options and Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
                Ways to <span className="gold-accent">Give</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the most convenient method for you to support our ministry and mission.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Giving Options */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-primary font-serif mb-6">Payment Methods</h3>
                
                {givingOptions.map((option, index) => (
                  <Card key={index} className={`shadow-lg ${option.recommended ? 'ring-2 ring-accent' : ''}`} data-testid={`card-giving-option-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center mr-4 mt-1`}>
                          <option.icon className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-primary" data-testid={`text-option-title-${index}`}>
                              {option.title}
                            </h4>
                            {option.recommended && (
                              <Badge className="bg-accent text-accent-foreground text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3" data-testid={`text-option-description-${index}`}>
                            {option.description}
                          </p>
                          
                          {option.payBill && (
                            <div className="space-y-1 text-sm">
                              <p className="text-muted-foreground">
                                Pay Bill: <span className="font-semibold text-primary" data-testid={`text-paybill-${index}`}>{option.payBill}</span>
                              </p>
                              <p className="text-muted-foreground">
                                Account: <span className="font-semibold text-primary" data-testid={`text-account-${index}`}>{option.account}</span>
                              </p>
                            </div>
                          )}
                          
                          {option.details && typeof option.details === 'object' && (
                            <div className="space-y-1 text-sm">
                              <p className="text-muted-foreground">
                                Bank: <span className="font-semibold text-primary">{option.details.bank}</span>
                              </p>
                              <p className="text-muted-foreground">
                                Account: <span className="font-semibold text-primary">{option.details.account}</span>
                              </p>
                              <p className="text-muted-foreground">
                                Name: <span className="font-semibold text-primary">{option.details.name}</span>
                              </p>
                            </div>
                          )}
                          
                          {option.details && typeof option.details === 'string' && (
                            <p className="text-sm text-muted-foreground">{option.details}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Give Form */}
              <div>
                <GivingForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giving Types */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
                Types of <span className="gold-accent">Giving</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Understand how your contributions support different aspects of our ministry and mission.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {givingTypes.map((type, index) => (
                <Card key={index} className="shadow-lg card-hover" data-testid={`card-giving-type-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                        <type.icon className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-2" data-testid={`text-type-title-${index}`}>
                          {type.title}
                        </h3>
                        <p className="text-muted-foreground mb-3" data-testid={`text-type-description-${index}`}>
                          {type.description}
                        </p>
                        <p className="text-sm text-accent font-medium" data-testid={`text-type-purpose-${index}`}>
                          Purpose: {type.purpose}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
                Your <span className="gold-accent">Impact</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                See how your faithful giving is making a real difference in our community and beyond.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur border-white/20 text-center text-white card-hover" data-testid={`card-impact-stat-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="text-primary" size={32} />
                    </div>
                    <div className="text-3xl font-bold text-accent mb-2" data-testid={`text-stat-number-${index}`}>
                      {stat.number}
                    </div>
                    <p className="text-gray-200 text-sm" data-testid={`text-stat-label-${index}`}>
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-8 text-primary">
              Biblical <span className="gold-accent">Foundation</span>
            </h2>
            
            <Card className="shadow-xl">
              <CardContent className="p-8 lg:p-12">
                <blockquote className="text-2xl font-serif italic text-primary mb-6">
                  "Bring the whole tithe into the storehouse, that there may be food in my house. 
                  Test me in this," says the Lord Almighty, "and see if I will not throw open the 
                  floodgates of heaven and pour out so much blessing that there will not be room enough to store it."
                </blockquote>
                <cite className="text-accent font-semibold">— Malachi 3:10</cite>
                
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Giving is not just about supporting the church—it's about participating in God's work 
                    and experiencing His faithfulness. When we give cheerfully and sacrificially, we open 
                    ourselves to receive God's abundant blessings while advancing His kingdom on earth.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary">Secure & Transparent</h3>
              </div>
              <p className="text-muted-foreground">
                All donations are processed securely and encrypted. Financial reports are available to members, 
                and we maintain full transparency in how your gifts are used for ministry and community impact.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
