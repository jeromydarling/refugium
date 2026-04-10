import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Construction, ArrowLeft } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description: string;
  crosPage?: string;
}

export default function ComingSoonPage({ title, description, crosPage }: ComingSoonPageProps) {
  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <Card className="parchment p-8 text-center border border-[hsl(var(--ignatian-border))]">
        <Construction className="h-10 w-10 text-[hsl(var(--ignatian-gold))] mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Badge variant="secondary" className="text-xs">
          Ready for Lovable integration
        </Badge>
        {crosPage && (
          <p className="text-[10px] text-muted-foreground mt-4">
            CROS source: <code className="bg-muted px-1 py-0.5 rounded">{crosPage}</code>
          </p>
        )}
        <Link to="/demo/app/dashboard" className="inline-flex items-center gap-1 text-xs text-primary mt-4 hover:underline">
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
      </Card>
    </div>
  );
}
