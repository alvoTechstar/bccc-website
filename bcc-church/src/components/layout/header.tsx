import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ChevronDown, Church, Heart, MapPin, Menu, Users, X } from "lucide-react";

export const aboutSubItems = [
  { label: "About the Church", desc: "Our story, values & impact", path: "/about", icon: Church },
  { label: "Leadership", desc: "Bishop JB Tajeu & pastors", path: "/about/leadership", icon: Users },
  { label: "What We Believe", desc: "Our statement of faith", path: "/about/beliefs", icon: BookOpen },
  { label: "Our Branches", desc: "Nakuru & Narok locations", path: "/branches", icon: MapPin },
];

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setAboutOpen(false);
    setMobileAboutOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  type NavItem = { label: string; path: string; children?: typeof aboutSubItems };
  const navigationItems: NavItem[] = [
    { label: "About", path: "/about", children: aboutSubItems },
    { label: "Ministries", path: "/ministries" },
    { label: "Sermons", path: "/sermons" },
    { label: "Blog", path: "/blog" },
    { label: "Events", path: "/events" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const isAboutActive =
    location === "/about" || location.startsWith("/about/") || location.startsWith("/branches");

  return (
    <>
      {/* Main nav */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-primary/85 backdrop-blur-xl shadow-2xl shadow-primary/30 ring-1 ring-white/10"
            : "bg-primary shadow-lg"
        }`}
      >
        {/* Scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="absolute inset-x-0 top-0 h-[3px] origin-left gold-surface"
        />
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${isScrolled ? "py-2" : "py-3.5"}`}>
            <Link href="/" data-testid="link-home-logo">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-3"
              >
                <motion.img
                  src="/logo-icon.svg"
                  alt="BCCC logo"
                  className="rounded-full bg-white object-contain p-0.5 shadow-md ring-2 ring-accent/60"
                  width={48}
                  height={48}
                  animate={{ width: isScrolled ? 40 : 48, height: isScrolled ? 40 : 48 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="leading-none">
                  <p className="font-serif text-[19px] font-black text-white">
                    Beautiful Courts
                  </p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.32em] text-accent">
                    Christian Church
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop nav — pill container */}
            <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.07] px-2 py-1.5 backdrop-blur" aria-label="Primary">
              <Link href="/" data-testid="link-nav-home">
                <span
                  className={`nav-link relative rounded-full px-4 py-2 text-sm font-semibold ${
                    isActive("/") ? "text-primary" : "text-primary-foreground/85"
                  }`}
                >
                  {isActive("/") && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">Home</span>
                </span>
              </Link>
              {navigationItems.map((item) =>
                item.children ? (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => setAboutOpen(true)}
                    onMouseLeave={() => setAboutOpen(false)}
                  >
                    <Link href={item.path} data-testid={`link-nav-${item.label.toLowerCase()}`}>
                      <span
                        className={`nav-link relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold ${
                          isAboutActive ? "text-primary" : "text-primary-foreground/85"
                        }`}
                      >
                        {isAboutActive && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-full bg-accent"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className="relative">{item.label}</span>
                        <ChevronDown
                          size={14}
                          className={`relative transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </Link>
                    <AnimatePresence>
                      {aboutOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3"
                        >
                          <div className="overflow-hidden rounded-2xl border border-white/10 bg-primary p-2 shadow-2xl shadow-black/40">
                            {item.children.map((sub, i) => (
                              <motion.div
                                key={sub.path}
                                initial={{ opacity: 0, x: -14 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.04 * i, duration: 0.22 }}
                              >
                                <Link href={sub.path} data-testid={`link-nav-${sub.label.toLowerCase().replace(/\s+/g, "-")}`}>
                                  <span
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                                      isActive(sub.path) && sub.path !== "/branches"
                                        ? "bg-accent/15"
                                        : "hover:bg-white/10"
                                    }`}
                                  >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                                      <sub.icon size={18} />
                                    </span>
                                    <span>
                                      <span className="block text-sm font-bold text-white">{sub.label}</span>
                                      <span className="block text-xs text-primary-foreground/60">{sub.desc}</span>
                                    </span>
                                  </span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={item.path} href={item.path} data-testid={`link-nav-${item.label.toLowerCase()}`}>
                    <span
                      className={`nav-link relative rounded-full px-4 py-2 text-sm font-semibold ${
                        isActive(item.path) ? "text-primary" : "text-primary-foreground/85"
                      }`}
                    >
                      {isActive(item.path) && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </span>
                  </Link>
                )
              )}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/giving">
                <Button className="btn-shine rounded-full bg-accent px-6 font-bold text-accent-foreground hover:bg-accent/90" data-testid="button-header-give">
                  Give Now <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <Link href="/giving">
                <Button
                  size="sm"
                  className="rounded-full bg-accent px-4 py-2 font-bold text-accent-foreground hover:bg-accent/90"
                  data-testid="button-header-give-mobile"
                >
                  <Heart size={15} className="mr-1" /> Give
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:text-accent hover:bg-white/10 rounded-full"
                onClick={() => setIsMenuOpen(true)}
                data-testid="button-mobile-menu"
                aria-label="Open menu"
              >
                <Menu size={26} />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen drawer from the right */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-primary/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-primary text-primary-foreground shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src="/logo-icon.svg" alt="BCCC logo" className="h-10 w-10 rounded-full bg-white p-0.5 ring-2 ring-accent/60" />
                  <div className="leading-none">
                    <p className="font-serif font-black text-white">
                      Beautiful Courts
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-accent font-bold">Christian Church</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-primary-foreground hover:text-accent hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile">
                <div className="space-y-1.5">
                  {[{ label: "Home", path: "/" }, ...navigationItems].map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 48 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * i + 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {item.children ? (
                        <div
                          className={`rounded-2xl transition-colors ${
                            isAboutActive ? "bg-accent/10" : ""
                          }`}
                        >
                          <button
                            onClick={() => setMobileAboutOpen((v) => !v)}
                            className={`drawer-link flex w-full items-center justify-between rounded-2xl px-5 py-4 text-lg font-bold ${
                              isAboutActive
                                ? "text-accent"
                                : "text-primary-foreground"
                            }`}
                            aria-expanded={mobileAboutOpen}
                          >
                            {item.label}
                            <ChevronDown
                              size={20}
                              className={`transition-transform duration-300 ${mobileAboutOpen ? "rotate-180 text-accent" : "text-accent"}`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileAboutOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-1 px-2 pb-3">
                                  {item.children.map((sub) => (
                                    <Link key={sub.path} href={sub.path} data-testid={`link-mobile-nav-${sub.label.toLowerCase().replace(/\s+/g, "-")}`}>
                                      <span className="flex items-center gap-3 rounded-xl px-4 py-3 text-primary-foreground hover:bg-white/10 transition-colors">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                                          <sub.icon size={16} />
                                        </span>
                                        <span className="text-[15px] font-bold">{sub.label}</span>
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link href={item.path} data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}>
                          <span
                            className={`drawer-link flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-bold ${
                              isActive(item.path)
                                ? "bg-accent text-primary"
                                : "text-primary-foreground"
                            }`}
                          >
                            {item.label}
                            <ArrowRight size={18} className={`drawer-arrow ${isActive(item.path) ? "text-primary" : "text-accent"}`} />
                          </span>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.35 }}
                  className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5"
                >
                  <p className="text-sm font-bold uppercase tracking-widest text-accent">Sundays</p>
                  <p className="mt-1 font-serif text-xl font-bold">8:30 & 10:30</p>
                  <p className="text-sm text-primary-foreground/70">Nakuru · Narok · Online</p>
                  <Link href="/giving">
                    <Button
                      className="btn-shine mt-4 w-full rounded-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
                      data-testid="button-mobile-nav-give"
                    >
                      <Heart size={16} className="mr-1" /> Give Now
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="mt-2.5 w-full rounded-full border-white/25 text-white hover:bg-white/10 hover:text-accent"
                    >
                      Plan Your Visit <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </Link>
                </motion.div>
              </nav>

              <p className="px-6 pb-6 text-xs text-primary-foreground/50">
                Beautiful Courts Christian Church — Raising Kingdom Champions.
              </p>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
