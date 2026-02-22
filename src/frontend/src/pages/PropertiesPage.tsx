import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAllProperties,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
} from '../hooks/useQueries';
import { Property, PropertyType, PropertyStatus } from '../backend';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import PropertyForm, { PropertyFormData } from '../components/PropertyForm';
import PropertyFilters from '../components/PropertyFilters';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PropertiesPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: properties = [], isLoading } = useGetAllProperties();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');

  const filteredProperties = properties.filter((property) => {
    if (statusFilter !== 'all' && property.status !== statusFilter) return false;
    if (typeFilter !== 'all' && property.propertyType !== typeFilter) return false;
    return true;
  });

  const handleCreate = () => {
    setEditingProperty(null);
    setFormOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormOpen(true);
  };

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      if (editingProperty) {
        await updateProperty.mutateAsync({
          id: editingProperty.id,
          ...data,
        });
        toast.success('Property updated successfully');
      } else {
        await createProperty.mutateAsync(data);
        toast.success('Property created successfully');
      }
      setFormOpen(false);
      setEditingProperty(null);
    } catch (error) {
      toast.error('Failed to save property');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty.mutateAsync(id);
        toast.success('Property deleted successfully');
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Please log in to access properties</h2>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Properties</h2>
            <p className="mt-1 text-muted-foreground">Manage your property portfolio</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>

        <div className="mb-6">
          <PropertyFilters
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
            onClear={() => {
              setStatusFilter('all');
              setTypeFilter('all');
            }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              {properties.length === 0 ? 'No properties yet. Create your first property!' : 'No properties match your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id.toString()}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <PropertyForm
          property={editingProperty}
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingProperty(null);
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
