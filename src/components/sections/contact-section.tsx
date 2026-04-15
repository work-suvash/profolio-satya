'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  service: z.string().min(1, { message: 'Please select a service.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }).max(500),
});

export default function ContactSection() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            service: '',
            message: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { supabase } = await import('@/lib/supabase/client');
            if (!supabase) throw new Error('Database is not configured. Please set Supabase environment variables.');
            const { error } = await supabase.from('contact_messages').insert({
                first_name: values.firstName,
                last_name: values.lastName,
                phone: values.phone,
                service: values.service,
                message: values.message,
            });
            if (error) throw error;

            toast({
                title: "Message Sent!",
                description: "Thanks for reaching out. I'll get back to you soon.",
            });
            form.reset();
        } catch (error) {
            console.error("Error submitting contact form:", error);
            toast({
                title: "Submission Failed",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        }
    }

  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">Contact me</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Hire me for editing. Let's create amazing visuals together.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="+977 9812345678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service of interest</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select an editing service" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="video-editing">Video Editing</SelectItem>
                                            <SelectItem value="reels-shorts">Reels / Shorts Editing</SelectItem>
                                            <SelectItem value="color-grading">Color Grading</SelectItem>
                                            <SelectItem value="motion-graphics">Motion Graphics</SelectItem>
                                            <SelectItem value="thumbnail-design">Thumbnail Design</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell me about the edit, video style, platform, and deadline..."
                                        className="resize-none"
                                        rows={5}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="text-center">
                        <Button type="submit" size="lg" className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold px-10 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] w-full md:w-auto">Send Message</Button>
                    </div>
                </form>
            </Form>
        </div>

      </div>
    </section>
  );
}
