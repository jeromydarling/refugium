import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Shield } from 'lucide-react';

export default function DemoGate() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const { startDemo } = useDemoMode();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startDemo({
      name,
      email,
      organization: org || 'Demo Organization',
      grantedAt: new Date().toISOString(),
    });
    navigate('/demo/app');
  };

  const formCard = (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="font-serif text-2xl">Experience Refugium</CardTitle>
        <CardDescription>
          See how Refugium helps disaster recovery teams track households, coordinate volunteers, and strengthen the refuge of community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@organization.org"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org">Organization (optional)</Label>
            <Input
              id="org"
              value={org}
              onChange={e => setOrg(e.target.value)}
              placeholder="Community Recovery Alliance"
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Enter Demo
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => {
              startDemo({
                name: 'Demo User',
                email: 'demo@refugium.app',
                organization: 'Demo Organization',
                grantedAt: new Date().toISOString(),
              });
              navigate('/demo/app');
            }}
          >
            Skip — enter as guest
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            This is a read-only demo with sample data. No real information is stored.
          </p>
        </form>
      </CardContent>
    </Card>
  );

  // ── Desktop: two-column split ──
  if (isDesktop) {
    return (
      <div className="min-h-screen flex">
        {/* Left decorative panel */}
        <div className="flex-1 relative bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center p-12 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="relative max-w-lg text-center space-y-6">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              See the person.<br />
              Discern the need.<br />
              Strengthen the refuge.
            </h1>
            <p className="text-lg text-muted-foreground">
              Technology in service of human dignity and community resilience.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full max-w-md flex items-center justify-center p-8 border-l bg-background">
          {formCard}
        </div>
      </div>
    );
  }

  // ── Mobile: centered form (unchanged) ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      {formCard}
    </div>
  );
}
