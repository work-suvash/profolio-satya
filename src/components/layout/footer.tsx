'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
);

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About me', href: '#about' },
  { label: 'Project', href: '#projects' },
  { label: 'Contact me', href: '#contact' },
];

const socialLinks = [
  { Icon: Facebook, href: 'https://www.facebook.com/suvash.mukhiya.752' },
  { Icon: Instagram, href: 'https://www.instagram.com/aint_suvash' },
  { Icon: WhatsAppIcon, href: 'https://wa.me/9779828223787' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/work-suvash-476673376/' },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 rounded-t-[25px]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Bar */}
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Left Side - Navigation */}
          <nav className="flex flex-wrap gap-1 justify-start flex-1 hidden md:flex">
            {navItems.map((item, index) => (
              <Link key={item.href} href={item.href} className={`text-xs transition-colors px-2 py-1 ${index === 0 ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Center - Logo */}
          <div className="flex-shrink-0 relative">
            <Link href="#home" style={{ fontFamily: 'var(--font-script)', fontSize: '2.2rem', color: '#ffffff', lineHeight: 1 }}>
              Satya
            </Link>
          </div>

          {/* Right Side - Social Icons */}
          <div className="flex justify-end items-center flex-1 gap-2">
            {socialLinks.map(({ Icon, href }, index) => (
              <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1.5">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex flex-wrap justify-center gap-1 py-2 md:hidden border-t border-border/30">
          {navItems.map((item, index) => (
            <Link key={item.href} href={item.href} className={`text-xs transition-colors px-2 ${index === 0 ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border/30"></div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 py-3">
          <a href="mailto:satyaraj@gmaul.com" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs">
            <Mail className="h-4 w-4" />
            satyaraj@gmaul.com
          </a>
          <a href="tel:+98123344567" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs">
            <Phone className="h-4 w-4" />
            +98123344567
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-muted-foreground py-2 border-t border-border/30">
          <p>&copy; {new Date().getFullYear()} PortfolioPro. All rights reserved by Satya Raj.</p>
        </div>
      </div>
    </footer>
  );
}
