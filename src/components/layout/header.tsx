'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { HireMeForm } from '../hire-me-form';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#services' },
  { label: 'About me', href: '#about' },
  { label: 'Edits', href: '#projects' },
  { label: 'Contact me', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHireMeFormOpen, setIsHireMeFormOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const navLinks = navItems.map(item => ({
        id: item.href,
        element: document.querySelector(item.href)
      }));

      // Find all sections currently in the viewport
      const visibleSections = navLinks
        .filter(link => link.element instanceof HTMLElement)
        .map(link => {
          const rect = (link.element as HTMLElement).getBoundingClientRect();
          return {
            id: link.id,
            // Calculate how much of the section is visible in the top half of the screen
            visibleHeight: Math.max(0, Math.min(rect.bottom, window.innerHeight / 2) - Math.max(rect.top, 0))
          };
        })
        .filter(section => section.visibleHeight > 0);

      if (visibleSections.length > 0) {
        // The active section is the one occupying the most space in the top half of the viewport
        const mostVisible = visibleSections.reduce((prev, current) => 
          (current.visibleHeight > prev.visibleHeight) ? current : prev
        );
        setActiveSection(mostVisible.id);
      }

      // Priority override for top of page
      if (window.scrollY < 100) {
        setActiveSection('#home');
      }

      // Priority override for bottom of page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveSection('#contact');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} passHref>
      <span
        onClick={() => setIsMobileMenuOpen(false)}
        className={`cursor-pointer text-sm font-medium transition-colors hover:text-primary ${
          activeSection === href ? 'text-primary' : 'text-foreground'
        }`}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <>
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/40 backdrop-blur-md border-b border-white/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="#home" style={{ fontFamily: 'var(--font-script)', fontSize: '2.2rem', color: '#ffffff', lineHeight: 1 }}>
          Satya
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
           <button onClick={() => setIsHireMeFormOpen(true)} className="hidden sm:inline-flex gradient-btn rounded-full shrink-0">
              <span className="gradient-btn-inner px-4 py-1.5 text-xs md:text-sm md:px-5 md:py-2.5 rounded-full whitespace-nowrap">Hire me</span>
            </button>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex h-full flex-col p-6">
                  <div className="mb-8 flex items-center justify-between">
                     <Link href="#home" onClick={() => setIsMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-script)', fontSize: '2.2rem', color: '#ffffff', lineHeight: 1 }}>
                      Satya
                    </Link>
                    <SheetTrigger asChild>
                       <Button variant="ghost" size="icon">
                         <X className="h-6 w-6" />
                       </Button>
                    </SheetTrigger>
                  </div>
                  <nav className="flex flex-col items-start gap-6">
                    {navItems.map(item => (
                      <NavLink key={item.href} {...item} />
                    ))}
                     <button onClick={() => { setIsHireMeFormOpen(true); setIsMobileMenuOpen(false); }} className="w-full gradient-btn">
                        <span className="gradient-btn-inner w-full">Hire me</span>
                      </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
    <HireMeForm open={isHireMeFormOpen} onOpenChange={setIsHireMeFormOpen} />
    </>
  );
}