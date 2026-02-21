import { useState, useEffect } from "react";
import { Menu, X, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.jpg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="RAHE KABA Logo" className="h-14 w-14 rounded-md object-cover" />
          <div className="hidden sm:block">
            <span className="font-heading text-xl font-bold text-primary">RAHE KABA</span>
            <span className="block text-xs tracking-[0.25em] text-muted-foreground uppercase">Tours & Travels</span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+8801601505050" className="flex items-center gap-2 text-sm text-primary">
            <Phone className="h-4 w-4" />
            +880 1601-505050
          </a>
          {user ? (
            <a href="/dashboard" className="flex items-center gap-2 text-sm text-primary border border-primary/40 px-4 py-2.5 rounded-md hover:bg-primary/10 transition-colors">
              <User className="h-4 w-4" />
              Dashboard
            </a>
          ) : (
            <a href="/auth" className="flex items-center gap-2 text-sm text-primary border border-primary/40 px-4 py-2.5 rounded-md hover:bg-primary/10 transition-colors">
              <User className="h-4 w-4" />
              Sign In
            </a>
          )}
          <a
            href="#packages"
            className="bg-gradient-gold text-primary-foreground font-semibold px-6 py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
          >
            Book Now
          </a>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground/80 hover:text-primary py-2 uppercase tracking-wide"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#packages"
                onClick={() => setOpen(false)}
                className="bg-gradient-gold text-primary-foreground font-semibold px-6 py-3 rounded-md text-sm text-center"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
