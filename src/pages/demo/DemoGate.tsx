import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Shield } from 'lucide-react';

export default function DemoGate() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const { startDemo } = useDemoMode();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
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
            <p className="text-xs text-center text-muted-foreground">
              This is a read-only demo with sample data. No real information is stored.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
