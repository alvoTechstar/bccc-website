import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Users } from "lucide-react";

export default function Branches() {
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
        { day: "Sunday", time: "9:00 AM - 12:00 PM", type: "Main Service" },
        { day: "Wednesday", time: "6:00 PM - 8:00 PM", type: "Bible Study" },
        { day: "Friday", time: "7:00 PM - 9:00 PM", type: "Prayer Night" }
      ],
      description: "Our main headquarters serves as the mother church, providing spiritual leadership and oversight to all branch churches across Kenya.",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
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
        { day: "Sunday", time: "10:00 AM - 1:00 PM", type: "Main Service" },
        { day: "Thursday", time: "6:30 PM - 8:30 PM", type: "Bible Study" }
      ],
      description: "A vibrant community church focusing on family ministry and youth development in the Utawala area.",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
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
        { day: "Sunday", time: "9:30 AM - 12:30 PM", type: "Main Service" },
        { day: "Wednesday", time: "6:00 PM - 8:00 PM", type: "Bible Study" }
      ],
      description: "The main branch in Narok town, serving as a regional hub for church activities and community outreach programs.",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
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
        { day: "Sunday", time: "10:00 AM - 1:00 PM", type: "Main Service" },
        { day: "Friday", time: "7:00 PM - 9:00 PM", type: "Prayer Meeting" }
      ],
      description: "Passionate about community outreach and youth development, serving the rural communities around Ololulunga.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    }
  ];

  const smallerBranches = [
    { name: "BCC Olmokonge", pastor: "Pastor David Seur", congregation: "150+", established: "2016" },
    { name: "BCC Enabelbel", pastor: "Pastor David Seur", congregation: "120+", established: "2017" },
    { name: "BCC Olomayiana", pastor: "Pastor David Seur", congregation: "180+", established: "2018" },
    { name: "BCC Melele", pastor: "Pastor David Seur", congregation: "140+", established: "2019" },
    { name: "BCC Olpukoti", pastor: "Pastor David Seur", congregation: "160+", established: "2020" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold font-serif mb-6 text-white">
            Our <span className="gold-accent">Church Branches</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Beautiful Courts Christian Church has multiple locations across Nakuru and Narok counties, 
            each serving their local communities with passion and dedication to spreading the Gospel.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-total-branches">12</div>
              <p className="text-muted-foreground">Total Branches</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-counties">2</div>
              <p className="text-muted-foreground">Counties Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-members">2500+</div>
              <p className="text-muted-foreground">Total Members</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-leaders">8</div>
              <p className="text-muted-foreground">Pastoral Leaders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nakuru Branches */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
              <span className="gold-accent">Nakuru</span> County
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our branches in Nakuru County, including our headquarters and thriving community churches.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {nakuruBranches.map((branch, index) => (
              <Card key={index} className="shadow-xl overflow-hidden" data-testid={`card-nakuru-branch-${index}`}>
                <img 
                  src={branch.image} 
                  alt={branch.name}
                  className="w-full h-48 object-cover"
                  data-testid={`img-nakuru-branch-${index}`}
                />
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-primary font-serif" data-testid={`text-nakuru-branch-name-${index}`}>
                      {branch.name}
                    </h3>
                    <Badge className="bg-accent text-accent-foreground" data-testid={`badge-nakuru-branch-type-${index}`}>
                      {index === 0 ? "Headquarters" : "Branch"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <MapPin className="text-accent mr-3 mt-1" size={16} />
                      <span className="text-muted-foreground" data-testid={`text-nakuru-branch-location-${index}`}>
                        {branch.location}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="text-accent mr-3" size={16} />
                      <span className="text-muted-foreground">
                        <span className="font-medium text-primary" data-testid={`text-nakuru-branch-pastor-${index}`}>{branch.pastor}</span> - {branch.title}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="text-accent mr-3" size={16} />
                      <span className="text-muted-foreground" data-testid={`text-nakuru-branch-phone-${index}`}>
                        {branch.phone}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6" data-testid={`text-nakuru-branch-description-${index}`}>
                    {branch.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-primary">Service Times:</h4>
                    {branch.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{service.day} - {service.type}</span>
                        <span className="text-primary font-medium">{service.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid={`button-visit-nakuru-${index}`}>
                      <MapPin className="mr-1" size={16} />
                      Visit Us
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" data-testid={`button-contact-nakuru-${index}`}>
                      <Mail className="mr-1" size={16} />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Narok Branches */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
              <span className="gold-accent">Narok</span> County
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our expanding presence in Narok County, reaching rural and urban communities with the Gospel.
            </p>
          </div>

          {/* Main Narok Branches */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {narokBranches.map((branch, index) => (
              <Card key={index} className="shadow-xl overflow-hidden" data-testid={`card-narok-branch-${index}`}>
                <img 
                  src={branch.image} 
                  alt={branch.name}
                  className="w-full h-48 object-cover"
                  data-testid={`img-narok-branch-${index}`}
                />
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-primary font-serif" data-testid={`text-narok-branch-name-${index}`}>
                      {branch.name}
                    </h3>
                    <Badge variant="outline" className="border-accent text-accent" data-testid={`badge-narok-branch-type-${index}`}>
                      Branch Church
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <MapPin className="text-accent mr-3 mt-1" size={16} />
                      <span className="text-muted-foreground" data-testid={`text-narok-branch-location-${index}`}>
                        {branch.location}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="text-accent mr-3" size={16} />
                      <span className="text-muted-foreground">
                        <span className="font-medium text-primary" data-testid={`text-narok-branch-pastor-${index}`}>{branch.pastor}</span> - {branch.title}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="text-accent mr-3" size={16} />
                      <span className="text-muted-foreground" data-testid={`text-narok-branch-phone-${index}`}>
                        {branch.phone}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6" data-testid={`text-narok-branch-description-${index}`}>
                    {branch.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-primary">Service Times:</h4>
                    {branch.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{service.day} - {service.type}</span>
                        <span className="text-primary font-medium">{service.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid={`button-visit-narok-${index}`}>
                      <MapPin className="mr-1" size={16} />
                      Visit Us
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" data-testid={`button-contact-narok-${index}`}>
                      <Mail className="mr-1" size={16} />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Smaller Branches under Pastor David Seur */}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary font-serif mb-2">
                  Rural Outreach Branches
                </h3>
                <p className="text-muted-foreground">
                  Led by <span className="font-medium text-primary">Pastor David Seur</span>, these branches serve rural communities across Narok County
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {smallerBranches.map((branch, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`card-small-branch-${index}`}>
                    <h4 className="font-bold text-primary mb-2" data-testid={`text-small-branch-name-${index}`}>
                      {branch.name}
                    </h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Pastor: <span className="text-primary" data-testid={`text-small-branch-pastor-${index}`}>{branch.pastor}</span></p>
                      <p>Members: <span className="text-primary" data-testid={`text-small-branch-members-${index}`}>{branch.congregation}</span></p>
                      <p>Est: <span className="text-primary" data-testid={`text-small-branch-established-${index}`}>{branch.established}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
              Visit <span className="gold-accent">Any Branch</span>
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              No matter where you are in Nakuru or Narok counties, there's a BCC Church branch near you. 
              Come and experience the love of Christ in our welcoming community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-find-branch">
                <MapPin className="mr-2" size={20} />
                Find Nearest Branch
              </Button>
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" data-testid="button-plant-church">
                <Users className="mr-2" size={20} />
                Plant a Church
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
