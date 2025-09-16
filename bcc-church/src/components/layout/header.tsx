import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Church, Menu, X } from "lucide-react";
import { ModeToggle } from "../ui/theme-toggle";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Ministries", path: "/ministries" },
    { label: "Branches", path: "/branches" },
    { label: "Blog", path: "/blog" },
    { label: "Giving", path: "/giving" },
    { label: "Contact", path: "/contact" }
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`bg-primary shadow-lg sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center bg-red">
          <Link href="/" data-testid="link-home-logo">
            <div className="flex items-center space-x-3 hover-elevate rounded-lg p-2 -m-2">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Church className="text-primary text-xl" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground font-serif">BCC Church</h1>
                <p className="text-xs text-accent">Beautiful Courts Christian Church</p>
              </div>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                <span className={`text-primary-foreground hover:text-accent transition-colors font-medium pb-1 border-b-2 ${
                  isActive(item.path) 
                    ? 'text-accent border-accent' 
                    : 'border-transparent hover:border-accent/50'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
            <ModeToggle />
          </div>

          
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:text-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary-foreground/20">
            <div className="flex flex-col space-y-3 pt-4">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`block text-primary-foreground hover:text-accent transition-colors font-medium py-2 px-4 rounded-lg ${
                    isActive(item.path) 
                      ? 'text-accent bg-accent/10' 
                      : 'hover:bg-primary-foreground/10'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
