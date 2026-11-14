import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { churchFacebook, youtubeChannelUrl } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground african-pattern">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/logo-full.svg"
                alt="Beautiful Courts Christian Church logo"
                className="w-16 h-16 rounded-full bg-white object-contain p-1 shadow-md ring-2 ring-accent/60"
                width={64}
                height={64}
                loading="lazy"
              />
              <div className="leading-none">
                <h3 className="font-serif text-[19px] font-black text-white">Beautiful Courts</h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.32em] text-accent">Christian Church</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Transforming lives through the power of Jesus Christ. Building strong Christian communities 
              across Kenya with love, faith, and hope that reaches every heart and home.
            </p>
            <div className="flex space-x-4">
              <a href={churchFacebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={youtubeChannelUrl} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-youtube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-serif">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/about/leadership" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-leadership">Leadership</Link></li>
              <li><Link href="/about/beliefs" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-beliefs">What We Believe</Link></li>
              <li><Link href="/ministries" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-ministries">Ministries</Link></li>
              <li><Link href="/branches" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-branches">Our Branches</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-blog">Blog & News</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-events">Events</Link></li>
              <li><Link href="/giving" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-giving">Online Giving</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-contact">Contact Us</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-prayer">Prayer Requests</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-serif">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="text-accent mr-3 mt-1" size={20} />
                <div>
                  <p className="text-gray-300">Nakuru, Mawanga Kwa Budaa</p>
                  <p className="text-gray-300">Nakuru County, Kenya</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="text-accent mr-3" size={20} />
                <p className="text-gray-300">+254 720 123 456</p>
              </div>
              <div className="flex items-center">
                <Mail className="text-accent mr-3" size={20} />
                <p className="text-gray-300">info@bccchurch.co.ke</p>
              </div>
              <div className="flex items-center">
                <Clock className="text-accent mr-3" size={20} />
                <p className="text-gray-300">Sundays: 8:30 AM & 10:30 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Beautiful Courts Christian Church. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
