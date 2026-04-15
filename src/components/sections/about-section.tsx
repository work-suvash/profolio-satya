'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, Award, Briefcase, Smile } from 'lucide-react';
import { getSetting, defaultHero, defaultAbout, type HeroSettings, type AboutSettings } from '@/lib/supabase/admin';

type ExtendedAbout = AboutSettings & { photo_position: string; photo_scale: number };

export default function AboutSection() {
  const [hero, setHero] = useState<HeroSettings>(defaultHero);
  const [about, setAbout] = useState<ExtendedAbout>({ ...defaultAbout, photo_position: 'center', photo_scale: 1 });

  useEffect(() => {
    getSetting('hero', defaultHero).then(setHero);
    getSetting<ExtendedAbout>('about', { ...defaultAbout, photo_position: 'center', photo_scale: 1 }).then(setAbout);
  }, []);

  const stats = [
    { icon: <Award className="h-6 w-6 text-primary" />, value: `${hero.experiences} Years`, label: 'Experience' },
    { icon: <Briefcase className="h-6 w-6 text-primary" />, value: hero.projects_done, label: 'Edits Completed' },
    { icon: <Smile className="h-6 w-6 text-primary" />, value: hero.rating, label: 'Happy Clients' },
  ];

  const scale = about.photo_scale ?? 1;

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-5xl font-headline font-bold text-primary tracking-tight">About Me</h2>
          <p className="text-muted-foreground text-lg">{about.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 flex justify-center lg:sticky lg:top-20">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-[20px] blur-xl"></div>
              <div className="relative w-full aspect-[3/4] rounded-[20px] overflow-hidden shadow-2xl group border border-primary/20">
                <Image
                  src={about.photo || '/profile.png'}
                  alt={`${hero.name} working on a video edit`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 400px"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8AKpT8S9mgAAAABJRU5ErkJggg=="
                  style={{
                    objectPosition: about.photo_position ?? 'center',
                    transform: scale !== 1 ? `scale(${scale})` : undefined,
                    transformOrigin: about.photo_position ?? 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-foreground leading-tight">{about.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{about.bio}</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {stats.map(stat => (
                <div key={stat.label} className="group text-center space-y-2">
                  <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {hero.cv_link && (
              <div className="pt-4">
                <a href={hero.cv_link} download className="gradient-btn w-full sm:w-auto rounded-full min-h-[48px] shrink-0 inline-flex">
                  <span className="gradient-btn-inner px-8 py-3 text-lg gap-3 rounded-full whitespace-nowrap">
                    <Download className="h-5 w-5" />
                    Download Portfolio
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
