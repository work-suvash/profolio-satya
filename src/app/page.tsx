import { Suspense } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero-section';
import ServicesSection from '@/components/sections/services-section';
import AnimatedSection from '@/components/animated-section';
import ClientLayout from '@/components/layout/client-layout';
import dynamic from 'next/dynamic';
import { getSetting, defaultHero } from '@/lib/supabase/admin';

export const revalidate = 60;

const AboutSection = dynamic(() => import('@/components/sections/about-section'), {
  loading: () => <SectionSkeleton />
});
const ProjectsSection = dynamic(() => import('@/components/sections/projects-section'), {
  loading: () => <SectionSkeleton />
});
const ContactSection = dynamic(() => import('@/components/sections/contact-section'), {
  loading: () => <SectionSkeleton />
});

function SectionSkeleton() {
  return <div className="h-96 animate-pulse bg-muted/20 w-full" />;
}

export default async function Home() {
  const hero = await getSetting('hero', defaultHero).catch(() => defaultHero);

  return (
    <ClientLayout>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <AnimatedSection animation="animate-fade-in-slow">
            <HeroSection initialHero={hero} />
          </AnimatedSection>

          <AnimatedSection animation="animate-fade-in-slow">
            <ServicesSection />
          </AnimatedSection>

          <Suspense fallback={<SectionSkeleton />}>
            <AnimatedSection animation="animate-fade-in-slow">
              <AboutSection />
            </AnimatedSection>
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <AnimatedSection animation="animate-fade-in-slow">
              <ProjectsSection />
            </AnimatedSection>
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <AnimatedSection animation="animate-fade-in-slow">
              <ContactSection />
            </AnimatedSection>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ClientLayout>
  );
}
