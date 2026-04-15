'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getServices, type Service } from '@/lib/supabase/admin';
import {
  Code, Palette, Smartphone, Globe, Database, Server, Layout, Layers, Cpu,
  Zap, Monitor, Shield, Camera, Video, FileText, ShoppingCart, Users, BarChart,
  Mail, Wifi, type LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Code, Palette, Smartphone, Globe, Database, Server, Layout, Layers, Cpu,
  Zap, Monitor, Shield, Camera, Video, FileText, ShoppingCart, Users, BarChart, Mail, Wifi,
};

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Code;
  return <Icon className={className} />;
}

const DEFAULT_SERVICES = [
  { id: 'd1', icon_name: 'Video', title: 'Adobe Premiere Pro', description: 'Professional timeline editing, pacing, music syncing, captions, and polished exports for long-form and short-form content.', thumbnail: '', link: '', sort_order: 0 },
  { id: 'd2', icon_name: 'Zap', title: 'After Effects', description: 'Motion graphics, animated text, visual effects, transitions, and branded elements that make edits feel more dynamic.', thumbnail: '', link: '', sort_order: 1 },
  { id: 'd3', icon_name: 'Smartphone', title: 'CapCut & Reels', description: 'Fast social media edits for TikTok, Instagram Reels, and YouTube Shorts with hooks, captions, and trend-ready pacing.', thumbnail: '', link: '', sort_order: 2 },
  { id: 'd4', icon_name: 'Palette', title: 'DaVinci Resolve', description: 'Color correction, cinematic color grading, contrast control, and visual mood shaping for a stronger final look.', thumbnail: '', link: '', sort_order: 3 },
  { id: 'd5', icon_name: 'Camera', title: 'Color Grading', description: 'Clean tones, cinematic looks, skin tone balance, and before/after polish that makes footage feel professional.', thumbnail: '', link: '', sort_order: 4 },
  { id: 'd6', icon_name: 'Layers', title: 'Motion Graphics', description: 'Animated titles, lower thirds, callouts, and graphic overlays that support the story without distracting from it.', thumbnail: '', link: '', sort_order: 5 },
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then(data => {
      setServices(data.length > 0 ? data : DEFAULT_SERVICES);
      setLoading(false);
    });
  }, []);

  const displayServices = loading ? DEFAULT_SERVICES : services;

  return (
    <section id="services" className="py-16 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">Skills</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            I use professional editing tools and creative techniques to turn raw footage into cinematic, engaging content.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <Card key={service.id ?? index} className="bg-background border-border/50 hover:border-primary/50 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col rounded-lg">
              <CardHeader className="items-center text-center">
                <ServiceIcon name={service.icon_name} className="h-10 w-10 text-primary" />
                <CardTitle className="pt-4 text-2xl font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground flex-grow">
                <p>{service.description}</p>
                {service.link && (
                  <a href={service.link} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs text-primary hover:underline">
                    Learn more →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
