import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, ISSComponent } from '@/contexts/AppContext';
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

export default function AddComponent() {
  const navigate = useNavigate();
  const { addComponent } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    nftId: '',
    type: '' as ISSComponent['type'],
    status: 'operational' as ISSComponent['status'],
    location: '',
    manufacturer: '',
    serialNumber: '',
    specifications: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.nftId || !formData.type || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const now = Date.now();
    const newComponent: Omit<ISSComponent, 'id' | 'events'> = {
      nftId: formData.nftId,
      name: formData.name,
      type: formData.type,
      status: formData.status,
      location: formData.location,
      installationDate: now,
      lastMaintenance: now,
      nextMaintenance: now + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      metadata: {
        manufacturer: formData.manufacturer || undefined,
        serialNumber: formData.serialNumber || undefined,
        specifications: formData.specifications || undefined,
      },
    };

    addComponent(newComponent);
    toast.success('Component added successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add New Component</CardTitle>
            <p className="text-sm text-muted-foreground">
              Register a new ISS component on the Hedera blockchain
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Component Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Primary Air Filter Unit A"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nftId">NFT ID *</Label>
                <Input
                  id="nftId"
                  value={formData.nftId}
                  onChange={(e) => setFormData({ ...formData, nftId: e.target.value })}
                  placeholder="e.g., NFT-ISS-001"
                  className="bg-background font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Component Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as ISSComponent['type'] })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air_filter">Air Filter</SelectItem>
                      <SelectItem value="battery">Battery</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="power_supply">Power Supply</SelectItem>
                      <SelectItem value="cooling_system">Cooling System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ISSComponent['status'] })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Module Destiny - Sector 3"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="e.g., NASA ISS Division"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="e.g., AF-2024-001"
                  className="bg-background font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="e.g., HEPA filtration, 99.97% efficiency"
                  className="bg-background min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 gap-2 bg-gradient-mission hover:opacity-90"
                >
                  <Save className="h-4 w-4" />
                  Add Component
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
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
