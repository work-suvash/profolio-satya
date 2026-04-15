'use client';

import { useState, useEffect } from 'react';
import { getMessages, deleteMessage, type Message } from '@/lib/supabase/admin';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Mail, Phone, Briefcase, Clock, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export default function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const { error } = await deleteMessage(id) as { error: unknown };
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Message deleted' });
      if (expanded === id) setExpanded(null);
    } else {
      toast({ title: 'Failed to delete message', variant: 'destructive' });
    }
    setDeleting(null);
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Contact form submissions from visitors</p>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          )}
          <button onClick={loadMessages} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-card rounded-xl animate-pulse border border-border/30" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground bg-card rounded-2xl border border-border/30">
          <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No messages yet</p>
          <p className="text-sm mt-1 opacity-70">Messages from your contact form will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="bg-card border border-border/40 rounded-xl p-5 hover:border-border/80 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3">
                    <span className="font-semibold text-foreground">{msg.first_name} {msg.last_name}</span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />{msg.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />{msg.service}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                      <Clock className="h-3 w-3" />{new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-sm text-foreground/80 leading-relaxed ${expanded !== msg.id ? 'line-clamp-2' : ''}`}>
                    {msg.message}
                  </p>
                  {msg.message.length > 120 && (
                    <button
                      onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                      className="mt-1.5 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {expanded === msg.id ? (
                        <><ChevronUp className="h-3 w-3" /> Show less</>
                      ) : (
                        <><ChevronDown className="h-3 w-3" /> Read more</>
                      )}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={deleting === msg.id}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                >
                  {deleting === msg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
