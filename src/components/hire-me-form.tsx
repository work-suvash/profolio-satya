'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

const hireMeFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  projectTitle: z.string().min(3, { message: 'Edit title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(1000),
  budget: z.string().optional(),
  deadline: z.string().optional(),
});

type HireMeFormValues = z.infer<typeof hireMeFormSchema>;

interface HireMeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HireMeForm({ open, onOpenChange }: HireMeFormProps) {
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm<HireMeFormValues>({
    resolver: zodResolver(hireMeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectTitle: '',
      description: '',
      budget: '',
      deadline: '',
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const scrollAmount = 50; // pixels to scroll
      if (scrollContainerRef.current) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          scrollContainerRef.current.scrollTop += scrollAmount;
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          scrollContainerRef.current.scrollTop -= scrollAmount;
        }
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);


  function onSubmit(values: HireMeFormValues) {
    const subject = encodeURIComponent(`Editing Inquiry: ${values.projectTitle}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\n` +
      `Email: ${values.email}\n` +
      `Phone: ${values.phone || 'N/A'}\n` +
      `Budget: ${values.budget || 'N/A'}\n` +
      `Deadline: ${values.deadline || 'N/A'}\n\n` +
      `Description:\n${values.description}`
    );

    const mailtoLink = `mailto:satyaraj@gmaul.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');

    toast({
      title: 'Email client opened!',
      description: 'Please review and send the email from your mail application.',
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-2xl border-primary/20 text-foreground p-0 max-w-2xl w-[95vw] sm:w-[90vw] rounded-[24px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
         <DialogHeader className="p-6 pb-2 flex-shrink-0 border-b border-primary/5">
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
            Hire Me
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/90">
            Let's create amazing visuals together. Fill out the form below to get started.
          </DialogDescription>
        </DialogHeader>
        <div ref={scrollContainerRef} className="px-6 py-4 overflow-y-auto flex-grow custom-scrollbar space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold ml-1">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="h-12 rounded-[16px] bg-secondary/30 border-primary/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold ml-1">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} className="h-12 rounded-[16px] bg-secondary/30 border-primary/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold ml-1">Edit / Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cinematic travel reel" {...field} className="h-12 rounded-[16px] bg-secondary/30 border-primary/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold ml-1">Message / Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me about your footage, editing style, platform, and goals..."
                        className="resize-none rounded-[16px] bg-secondary/30 border-primary/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold ml-1">Phone <span className="text-xs text-muted-foreground/60 font-normal ml-1">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 234 567 890" {...field} className="h-12 rounded-[16px] bg-secondary/30 border-primary/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold ml-1">Budget <span className="text-xs text-muted-foreground/60 font-normal ml-1">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $100 - $300" {...field} className="h-12 rounded-[16px] bg-secondary/30 border-primary/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold ml-1">Deadline <span className="text-xs text-muted-foreground/60 font-normal ml-1">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3-4 days" {...field} className="h-12 rounded-[16px] bg-secondary/30 border-primary/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 flex-shrink-0">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost" className="h-12 rounded-full border border-border/50 hover:bg-secondary/50 font-semibold px-8 transition-all">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold px-10 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">Submit Request</Button>
                </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
