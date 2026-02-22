import { useState, useEffect } from 'react';
import { Property, PropertyType, PropertyStatus } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyFormProps {
  property?: Property | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
}

export interface PropertyFormData {
  name: string;
  address: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  acquisitionDate: bigint;
  estimatedCompletionDate: bigint | null;
}

export default function PropertyForm({ property, open, onClose, onSubmit }: PropertyFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.residential);
  const [status, setStatus] = useState<PropertyStatus>(PropertyStatus.planning);
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');

  useEffect(() => {
    if (property) {
      setName(property.name);
      setAddress(property.address);
      setPropertyType(property.propertyType);
      setStatus(property.status);
      setAcquisitionDate(new Date(Number(property.acquisitionDate)).toISOString().split('T')[0]);
      setEstimatedCompletionDate(
        property.estimatedCompletionDate
          ? new Date(Number(property.estimatedCompletionDate)).toISOString().split('T')[0]
          : ''
      );
    } else {
      setName('');
      setAddress('');
      setPropertyType(PropertyType.residential);
      setStatus(PropertyStatus.planning);
      setAcquisitionDate('');
      setEstimatedCompletionDate('');
    }
  }, [property, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      address,
      propertyType,
      status,
      acquisitionDate: BigInt(new Date(acquisitionDate).getTime()),
      estimatedCompletionDate: estimatedCompletionDate
        ? BigInt(new Date(estimatedCompletionDate).getTime())
        : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{property ? 'Edit Property' : 'Add New Property'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Property Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Type</Label>
              <Select value={propertyType} onValueChange={(value) => setPropertyType(value as PropertyType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PropertyType.residential}>Residential</SelectItem>
                  <SelectItem value={PropertyType.commercial}>Commercial</SelectItem>
                  <SelectItem value={PropertyType.mixedUse}>Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as PropertyStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PropertyStatus.planning}>Planning</SelectItem>
                  <SelectItem value={PropertyStatus.development}>Development</SelectItem>
                  <SelectItem value={PropertyStatus.completed}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Acquisition Date</Label>
              <Input
                id="acquisitionDate"
                type="date"
                value={acquisitionDate}
                onChange={(e) => setAcquisitionDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCompletionDate">Est. Completion</Label>
              <Input
                id="estimatedCompletionDate"
                type="date"
                value={estimatedCompletionDate}
                onChange={(e) => setEstimatedCompletionDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{property ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
