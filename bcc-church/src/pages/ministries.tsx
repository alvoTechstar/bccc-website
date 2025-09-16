import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  Camera, 
  Users, 
  Heart, 
  Baby, 
  HandHeart,
  BookOpen,
  Mic,
  Headphones,
  UserCheck
} from "lucide-react";

export default function Ministries() {
  const ministries = [
    {
      icon: Music,
      title: "Praise & Worship",
      description: "Leading the congregation in powerful worship experiences through music, song, and spiritual expression that connects hearts to God. Our worship team creates an atmosphere where believers can encounter God's presence through contemporary and traditional worship styles.",
      color: "bg-blue-500",
      leader: "Worship Team",
      meetingTime: "Sunday 8:30 AM",
      contact: "worship@bccchurch.co.ke"
    },
    {
      icon: Camera,
      title: "Media Ministry",
      description: "Capturing and sharing God's work through photography, videography, live streaming, and social media outreach to expand our reach. We document testimonies, events, and church activities to inspire and connect with our global community.",
      color: "bg-purple-500",
      leader: "Media Team",
      meetingTime: "As needed",
      contact: "media@bccchurch.co.ke"
    },
    {
      icon: Users,
      title: "Youth Ministry",
      description: "Empowering young people with strong biblical foundations, leadership skills, and opportunities for spiritual and personal growth. We focus on mentorship, discipleship, and creating a safe space for youth to explore their faith.",
      color: "bg-green-500",
      leader: "Pastor Samuel Kirui",
      meetingTime: "Saturday 2:00 PM",
      contact: "youth@bccchurch.co.ke"
    },
    {
      icon: Heart,
      title: "Women's Ministry",
      description: "Supporting women in their spiritual journey through fellowship, mentorship, prayer groups, and community service initiatives. We provide a platform for women to grow in faith, build relationships, and develop their gifts.",
      color: "bg-pink-500",
      leader: "Women's Ministry Team",
      meetingTime: "Wednesday 10:00 AM",
      contact: "women@bccchurch.co.ke"
    },
    {
      icon: Baby,
      title: "Children's Ministry",
      description: "Creating safe, fun, and educational environments where children can learn about Jesus, build friendships, and develop strong faith foundations. Our programs are age-appropriate and designed to nurture young hearts.",
      color: "bg-yellow-500",
      leader: "Children's Team",
      meetingTime: "Sunday 9:00 AM",
      contact: "children@bccchurch.co.ke"
    },
    {
      icon: HandHeart,
      title: "Outreach Ministry",
      description: "Serving our local communities through food distribution, healthcare support, education programs, and evangelistic outreach activities. We demonstrate Christ's love through practical acts of service and compassion.",
      color: "bg-red-500",
      leader: "Pastor David Seur",
      meetingTime: "Monthly Programs",
      contact: "outreach@bccchurch.co.ke"
    },
    {
      icon: BookOpen,
      title: "Bible Study Groups",
      description: "Deepening understanding of God's Word through small group Bible studies, theological discussions, and discipleship programs. We offer various study groups for different age groups and spiritual maturity levels.",
      color: "bg-indigo-500",
      leader: "Church Elders",
      meetingTime: "Wednesday 6:00 PM",
      contact: "biblestudy@bccchurch.co.ke"
    },
    {
      icon: Mic,
      title: "Evangelism Ministry",
      description: "Reaching the lost and unchurched through street evangelism, door-to-door ministry, and community events. We train believers to share the Gospel effectively and with love in their daily interactions.",
      color: "bg-orange-500",
      leader: "Evangelism Team",
      meetingTime: "Saturday 10:00 AM",
      contact: "evangelism@bccchurch.co.ke"
    },
    {
      icon: Headphones,
      title: "Prayer Ministry",
      description: "Interceding for the church, community, and nation through organized prayer meetings, prayer chains, and spiritual warfare. We believe in the power of prayer to transform lives and circumstances.",
      color: "bg-teal-500",
      leader: "Prayer Warriors",
      meetingTime: "Friday 7:00 PM",
      contact: "prayer@bccchurch.co.ke"
    },
    {
      icon: UserCheck,
      title: "Discipleship Ministry",
      description: "Mentoring new believers and helping them grow in their faith through one-on-one discipleship, leadership training, and spiritual development programs. We equip saints for the work of ministry.",
      color: "bg-cyan-500",
      leader: "Discipleship Team",
      meetingTime: "Flexible Schedule",
      contact: "discipleship@bccchurch.co.ke"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold font-serif mb-6 text-white">
            Our <span className="gold-accent">Ministries</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover the various ways you can grow in faith, serve the community, and use your gifts 
            to build God's kingdom through our diverse ministry programs.
          </p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
              Find Your <span className="gold-accent">Calling</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every believer has been gifted by God to serve in His kingdom. Explore our ministries 
              and discover where your passion and God's purpose intersect.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => (
              <Card key={index} className="shadow-lg card-hover" data-testid={`card-ministry-${index}`}>
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${ministry.color} rounded-full flex items-center justify-center mb-4`}>
                    <ministry.icon className="text-white text-2xl" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3" data-testid={`text-ministry-title-${index}`}>
                    {ministry.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed" data-testid={`text-ministry-description-${index}`}>
                    {ministry.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-primary">Leader:</span>
                      <span className="text-muted-foreground" data-testid={`text-ministry-leader-${index}`}>
                        {ministry.leader}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-primary">Meets:</span>
                      <span className="text-muted-foreground" data-testid={`text-ministry-time-${index}`}>
                        {ministry.meetingTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-primary">Contact:</span>
                      <span className="text-muted-foreground text-xs" data-testid={`text-ministry-contact-${index}`}>
                        {ministry.contact}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    data-testid={`button-ministry-join-${index}`}
                  >
                    Join This Ministry
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
              Ready to <span className="gold-accent">Get Involved?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Don't see a ministry that fits your passion? We'd love to help you discover your calling 
              or even start a new ministry that serves our community's needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-volunteer">
                <Heart className="mr-2" size={20} />
                Volunteer Today
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" data-testid="button-ministry-info">
                <BookOpen className="mr-2" size={20} />
                Get More Information
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
