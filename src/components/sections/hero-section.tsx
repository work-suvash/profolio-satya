'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Download, User } from 'lucide-react';
import { HireMeForm } from '../hire-me-form';
import type { HeroSettings } from '@/lib/supabase/admin';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
);

interface Props {
  initialHero: HeroSettings;
}

export default function HeroSection({ initialHero }: Props) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHireMeFormOpen, setIsHireMeFormOpen] = useState(false);

  const hero = initialHero ?? {
    profile_pic: '',
    name: 'Satya Raj',
    tagline: 'Video Editor / Content Editor & I create cinematic edits, reels & visual stories',
    experiences: '1+',
    projects_done: '20+',
    rating: '1+',
    cv_link: '',
    social_facebook: '',
    social_instagram: '',
    social_whatsapp: '',
    social_linkedin: '',
  };

  const stats = [
    { value: hero.experiences, label: 'Experiences' },
    { value: hero.projects_done, label: 'Edits done' },
    { value: hero.rating, label: 'Rating by clients' },
  ];

  const socialLinks = [
    { Icon: Facebook, href: hero.social_facebook },
    { Icon: Instagram, href: hero.social_instagram },
    { Icon: WhatsAppIcon, href: hero.social_whatsapp },
    { Icon: Linkedin, href: hero.social_linkedin },
  ].filter(s => !!s.href);

  return (
    <>
      <section id="home" className="container mx-auto py-12 md:py-20 px-4 md:px-6 flex items-center pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">

          {/* Profile image */}
          <div className="flex items-center justify-center order-1 md:order-2">
            <div
              className="group relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px]"
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` } as React.CSSProperties}
              aria-hidden="true"
            >
              <div className="absolute inset-[-20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mouse-glow-effect z-0" />
              {hero.profile_pic ? (
                <Image
                  src={hero.profile_pic}
                  alt={`${hero.name} - Video Editor and Content Editor`}
                  fill
                  className="rounded-full object-cover border-4 border-primary z-10 relative"
                  sizes="(max-width: 640px) 250px, (max-width: 768px) 300px, (max-width: 1024px) 350px, 400px"
                  priority
                  fetchPriority="high"
                  quality={90}
                />
              ) : (
                <div className="w-full h-full rounded-full border-4 border-primary z-10 relative bg-secondary flex items-center justify-center">
                  <User className="w-1/2 h-1/2 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-4 order-2 md:order-1 text-center md:text-left">
            <p className="text-2xl text-muted-foreground">Hi I am <br /> {hero.name}</p>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-primary rounded-lg blur-xl opacity-30 -z-10"></span>
                <span className="relative text-primary">{hero.tagline.split('&')[0]?.trim() || 'Video Editor / Content Editor'}</span>
              </span>
              <br />
              <span>{hero.tagline.split('&')[1]?.trim() || 'I create cinematic edits, reels & visual stories'}</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => setIsHireMeFormOpen(true)} className="gradient-btn w-full sm:w-auto min-h-[48px] rounded-full shrink-0">
                <span className="gradient-btn-inner w-full text-base rounded-full whitespace-nowrap">Hire me</span>
              </button>
              {hero.cv_link ? (
                <a href={hero.cv_link} download className="gradient-btn w-full sm:w-auto min-h-[48px] rounded-full shrink-0">
                  <span className="gradient-btn-inner w-full gap-2 text-base rounded-full whitespace-nowrap">
                    Download Portfolio <Download className="h-5 w-5" />
                  </span>
                </a>
              ) : (
                <button className="gradient-btn w-full sm:w-auto min-h-[48px] rounded-full shrink-0 opacity-50 cursor-not-allowed" disabled>
                  <span className="gradient-btn-inner w-full gap-2 text-base rounded-full whitespace-nowrap">
                    Download Portfolio <Download className="h-5 w-5" />
                  </span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-3 justify-center md:justify-start">
              {stats.map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-4 justify-center md:justify-start">
              {socialLinks.map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <HireMeForm open={isHireMeFormOpen} onOpenChange={setIsHireMeFormOpen} />
    </>
  );
}
