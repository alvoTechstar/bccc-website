import { Link } from "wouter";
import { Church, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background text-primary-foreground african-pattern">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <Church className="text-primary text-2xl" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif">BCC Church</h3>
                <p className="text-accent">Beautiful Courts Christian Church</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Transforming lives through the power of Jesus Christ. Building strong Christian communities 
              across Kenya with love, faith, and hope that reaches every heart and home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.417-3.324c.876-.807 2.027-1.297 3.324-1.297s2.448.49 3.324 1.297c.927.876 1.417 2.027 1.417 3.324s-.49 2.448-1.417 3.244c-.876.807-2.027 1.297-3.324 1.297zm7.83-9.608c-.49 0-.876-.386-.876-.876s.386-.876.876-.876.876.386.876.876-.386.876-.876.876z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-youtube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-whatsapp">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-serif">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/ministries" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-ministries">Ministries</Link></li>
              <li><Link href="/branches" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-branches">Our Branches</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-accent transition-colors" data-testid="link-footer-blog">Blog & News</Link></li>
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
                <p className="text-gray-300">Sunday: 9:00 AM - 12:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-center md:text-left">
            © 2024 Beautiful Courts Christian Church. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-accent transition-colors text-sm" data-testid="link-privacy">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-accent transition-colors text-sm" data-testid="link-terms">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-accent transition-colors text-sm" data-testid="link-sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
