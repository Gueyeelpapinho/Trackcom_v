import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, ComponentEvent } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AddEvent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addEvent, getComponent } = useApp();
  const component = id ? getComponent(id) : undefined;

  const [formData, setFormData] = useState({
    type: '' as ComponentEvent['type'],
    description: '',
    performedBy: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.description || !formData.performedBy) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!id) {
      toast.error('Component ID is missing');
      return;
    }

    const newEvent: Omit<ComponentEvent, 'id'> = {
      type: formData.type,
      timestamp: Date.now(),
      description: formData.description,
      performedBy: formData.performedBy,
    };

    addEvent(id, newEvent);
    toast.success('Event added successfully');
    navigate(`/component/${id}`);
  };

  if (!component) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="bg-card/30">
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">Component not found</p>
              <Button onClick={() => navigate('/')} className="mt-4" variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          onClick={() => navigate(`/component/${id}`)}
          variant="ghost"
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Component
        </Button>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add Event</CardTitle>
            <p className="text-sm text-muted-foreground">
              Record a new event for {component.name}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              NFT: {component.nftId}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as ComponentEvent['type'] })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="replacement">Replacement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the event in detail..."
                  className="bg-background min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="performedBy">Performed By *</Label>
                <Input
                  id="performedBy"
                  value={formData.performedBy}
                  onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
                  placeholder="e.g., Astronaut J. Smith"
                  className="bg-background"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 gap-2 bg-gradient-mission hover:opacity-90"
                >
                  <Save className="h-4 w-4" />
                  Save Event
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/component/${id}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
