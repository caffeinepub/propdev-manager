import { Property } from '../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProjectFiltersProps {
  propertyFilter: string;
  properties: Property[];
  onPropertyChange: (propertyId: string) => void;
  onClear: () => void;
}

export default function ProjectFilters({
  propertyFilter,
  properties,
  onPropertyChange,
  onClear,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Property:</span>
        <Select value={propertyFilter} onValueChange={onPropertyChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties.map((prop) => (
              <SelectItem key={prop.id.toString()} value={prop.id.toString()}>
                {prop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {propertyFilter !== 'all' && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 h-4 w-4" />
          Clear Filter
        </Button>
      )}
    </div>
  );
}
