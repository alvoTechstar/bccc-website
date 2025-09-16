import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/contact/contact-form";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Calendar,
  Users,
  Heart
} from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: [
        "Beautiful Courts Christian Church",
        "Nakuru, Mawanga Kwa Budaa",
        "Nakuru County, Kenya"
      ]
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+254 720 123 456",
        "+254 733 789 012"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "info@bccchurch.co.ke",
        "pastor@bccchurch.co.ke"
      ]
    }
  ];

  const serviceTimes = [
    { day: "Sunday Worship", time: "9:00 AM - 12:00 PM", type: "Main Service" },
    { day: "Wednesday Bible Study", time: "6:00 PM - 8:00 PM", type: "Teaching" },
    { day: "Friday Prayer Night", time: "7:00 PM - 9:00 PM", type: "Prayer" },
    { day: "Saturday Youth Service", time: "2:00 PM - 5:00 PM", type: "Youth" }
  ];

  const socialLinks = [
    { 
      name: "Facebook", 
      url: "#", 
      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    { 
      name: "Twitter", 
      url: "#", 
      icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
      color: "bg-blue-400 hover:bg-blue-500"
    },
    { 
      name: "Instagram", 
      url: "#", 
      icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.417-3.324c.876-.807 2.027-1.297 3.324-1.297s2.448.49 3.324 1.297c.927.876 1.417 2.027 1.417 3.324s-.49 2.448-1.417 3.244c-.876.807-2.027 1.297-3.324 1.297zm7.83-9.608c-.49 0-.876-.386-.876-.876s.386-.876.876-.876.876.386.876.876-.386.876-.876.876z",
      color: "bg-pink-600 hover:bg-pink-700"
    },
    { 
      name: "YouTube", 
      url: "#", 
      icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
      color: "bg-red-600 hover:bg-red-700"
    },
    { 
      name: "WhatsApp", 
      url: "#", 
      icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488",
      color: "bg-green-500 hover:bg-green-600"
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "Plan Your Visit",
      description: "Join us for Sunday worship service",
      action: "View Service Times"
    },
    {
      icon: Users,
      title: "Join a Ministry",
      description: "Find your place in our church family",
      action: "Explore Ministries"
    },
    {
      icon: Heart,
      title: "Prayer Request",
      description: "Our prayer team is here for you",
      action: "Submit Request"
    },
    {
      icon: MessageCircle,
      title: "Pastoral Care",
      description: "Schedule counseling or guidance",
      action: "Book Appointment"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold font-serif mb-6 text-white">
            Get In <span className="gold-accent">Touch</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out to us for prayers, questions, church membership, 
            or to learn more about joining our church family.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Headquarters Contact */}
                <Card className="shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-primary mb-6 font-serif" data-testid="text-headquarters-title">
                      Headquarters
                    </h3>
                    <div className="space-y-4">
                      {contactInfo.map((info, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4 mt-1">
                            <info.icon className="text-primary" size={20} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary mb-1" data-testid={`text-contact-${index}-title`}>
                              {info.title}
                            </h4>
                            {info.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-muted-foreground" data-testid={`text-contact-${index}-detail-${detailIndex}`}>
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Service Times */}
                <Card className="shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-primary mb-6 font-serif" data-testid="text-service-times-title">
                      Service Times
                    </h3>
                    <div className="space-y-4">
                      {serviceTimes.map((service, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                          <div>
                            <span className="font-medium text-primary" data-testid={`text-service-${index}-day`}>
                              {service.day}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">({service.type})</span>
                          </div>
                          <span className="text-muted-foreground" data-testid={`text-service-${index}-time`}>
                            {service.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card className="shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-primary mb-6 font-serif" data-testid="text-social-media-title">
                      Follow Us
                    </h3>
                    <div className="flex space-x-4">
                      {socialLinks.map((social, index) => (
                        <a 
                          key={index}
                          href={social.url} 
                          className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center transition-colors`}
                          data-testid={`link-social-${social.name.toLowerCase()}`}
                          aria-label={social.name}
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d={social.icon} />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
                How Can We <span className="gold-accent">Help?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Whether you're looking to visit us, join a ministry, request prayer, or need pastoral care, 
                we're here to support you on your spiritual journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="shadow-lg text-center card-hover" data-testid={`card-quick-action-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <action.icon className="text-primary" size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-primary mb-2" data-testid={`text-action-title-${index}`}>
                      {action.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4" data-testid={`text-action-description-${index}`}>
                      {action.description}
                    </p>
                    <button className="text-accent font-semibold text-sm hover:underline" data-testid={`button-action-${index}`}>
                      {action.action}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Placeholder */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
                Find <span className="gold-accent">Us</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Located in the heart of Nakuru at Mawanga Kwa Budaa, our church is easily accessible 
                and welcomes visitors from all backgrounds.
              </p>
            </div>

            <Card className="shadow-xl overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground">
                    Directions to Beautiful Courts Christian Church<br />
                    Nakuru, Mawanga Kwa Budaa
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
              Ready to <span className="gold-accent">Connect?</span>
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Don't hesitate to reach out. Our pastoral team and church family are eager to welcome you 
              and support you in your faith journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:bg-accent/90 transition-colors" data-testid="button-schedule-visit">
                <Calendar className="mr-2 inline" size={20} />
                Schedule a Visit
              </button>
              <button className="border-2 border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors" data-testid="button-emergency-prayer">
                <Heart className="mr-2 inline" size={20} />
                Emergency Prayer Line
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
