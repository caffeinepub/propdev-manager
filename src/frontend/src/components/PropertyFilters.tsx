import { PropertyType, PropertyStatus } from '../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PropertyFiltersProps {
  statusFilter: PropertyStatus | 'all';
  typeFilter: PropertyType | 'all';
  onStatusChange: (status: PropertyStatus | 'all') => void;
  onTypeChange: (type: PropertyType | 'all') => void;
  onClear: () => void;
}

export default function PropertyFilters({
  statusFilter,
  typeFilter,
  onStatusChange,
  onTypeChange,
  onClear,
}: PropertyFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={PropertyStatus.planning}>Planning</SelectItem>
            <SelectItem value={PropertyStatus.development}>Development</SelectItem>
            <SelectItem value={PropertyStatus.completed}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Type:</span>
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={PropertyType.residential}>Residential</SelectItem>
            <SelectItem value={PropertyType.commercial}>Commercial</SelectItem>
            <SelectItem value={PropertyType.mixedUse}>Mixed Use</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(statusFilter !== 'all' || typeFilter !== 'all') && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
