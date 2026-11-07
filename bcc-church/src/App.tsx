import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import About from "./pages/about";
import Leadership from "./pages/leadership";
import Beliefs from "./pages/beliefs";
import Ministries from "./pages/ministries";
import Branches from "./pages/branches";
import Blog from "./pages/blog";
import Sermons from "./pages/sermons";
import Events from "./pages/events";
import Giving from "./pages/giving";
import Contact from "./pages/contact";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { useEffect, useState } from "react";
import { EASE_OUT } from "./lib/animations";

function AnimatedRouter() {
  const [location] = useLocation();
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
      className={`fixed bottom-8 right-8 w-12 h-12 bg-accent text-accent-foreground rounded-full shadow-xl hover:bg-accent/90 z-40 ${
        isVisible ? '' : 'pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </motion.button>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <AnimatedRouter />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
