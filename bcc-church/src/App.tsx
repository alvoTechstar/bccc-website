import { Switch, Route, Redirect, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./views/pages/not-found";
import Home from "./views/pages/home";
import About from "./views/pages/about";
import Leadership from "./views/pages/leadership";
import Beliefs from "./views/pages/beliefs";
import Ministries from "./views/pages/ministries";
import Branches from "./views/pages/branches";
import Blog from "./views/pages/blog";
import Sermons from "./views/pages/sermons";
import Events from "./views/pages/events";
import Giving from "./views/pages/giving";
import Contact from "./views/pages/contact";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { lazy, Suspense, useEffect, useState } from "react";
import { EASE_OUT } from "./lib/animations";
import { adminEnabled, publicEnabled } from "./lib/site";

// Lazy-load the admin console (recharts + tables) so public pages stay light.
const AdminLogin = lazy(() => import("./views/auth/login"));
const AdminForgotPassword = lazy(() => import("./views/auth/forgot-password"));
const AdminSetPassword = lazy(() => import("./views/auth/set-password"));
const AdminLayout = lazy(() => import("./views/admin/layout"));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <p className="text-sm font-semibold text-slate-500">Loading admin…</p>
    </div>
  );
}

function AnimatedRouter() {
  const [location] = useLocation();
  const hostAllowedAdmin = adminEnabled();
  const hostAllowedPublic = publicEnabled();
  const isAdmin = location.startsWith("/admin");
  if (isAdmin) {
    // Dedicated admin URL: the console only exists on its own host.
    if (!hostAllowedAdmin) {
      return <NotFound />;
    }
    return (
      <Suspense fallback={<AdminFallback />}>
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/forgot-password" component={AdminForgotPassword} />
          <Route path="/admin/set-password" component={AdminSetPassword} />
          <Route path="/admin/:rest*" component={AdminLayout} />
          <Route path="/admin" component={AdminLayout} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    );
  }
  // On the dedicated admin host there is no public website — send all
  // visitors straight to the sign-in page.
  if (!hostAllowedPublic) {
    return <Redirect to="/admin/login" />;
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about/leadership" component={Leadership} />
          <Route path="/about/beliefs" component={Beliefs} />
          <Route path="/about" component={About} />
          <Route path="/ministries" component={Ministries} />
          <Route path="/branches" component={Branches} />
          <Route path="/blog" component={Blog} />
          <Route path="/sermons" component={Sermons} />
          <Route path="/events" component={Events} />
          <Route path="/giving" component={Giving} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <motion.button
      data-testid="button-scroll-to-top"
      onClick={scrollToTop}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 12 }}
      transition={{ duration: 0.3 }}
      className={`fixed z-40 flex shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl hover:bg-accent/90 ${
        isVisible ? '' : 'pointer-events-none'
      }`}
      style={{ width: 48, height: 48, right: 16, bottom: 24 }}
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </motion.button>
  );
}

function AppShell() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  // On the dedicated admin host there is no public chrome at all.
  if (isAdmin || !publicEnabled()) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <AnimatedRouter />
        </main>
        <Toaster />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatedRouter />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppShell />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
