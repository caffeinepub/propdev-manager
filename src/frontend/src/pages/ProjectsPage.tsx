import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAllProjects,
  useGetAllProperties,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '../hooks/useQueries';
import { DevelopmentProject } from '../backend';
import ProjectCard from '../components/ProjectCard';
import ProjectForm, { ProjectFormData } from '../components/ProjectForm';
import ProjectFilters from '../components/ProjectFilters';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: projects = [], isLoading: projectsLoading } = useGetAllProjects();
  const { data: properties = [], isLoading: propertiesLoading } = useGetAllProperties();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DevelopmentProject | null>(null);
  const [propertyFilter, setPropertyFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    if (propertyFilter !== 'all' && project.propertyId.toString() !== propertyFilter) return false;
    return true;
  });

  const handleCreate = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const handleEdit = (project: DevelopmentProject) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          ...data,
        });
        toast.success('Project updated successfully');
      } else {
        await createProject.mutateAsync(data);
        toast.success('Project created successfully');
      }
      setFormOpen(false);
      setEditingProject(null);
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject.mutateAsync(id);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Please log in to access projects</h2>
      </div>
    );
  }

  const isLoading = projectsLoading || propertiesLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Development Projects</h2>
          <p className="mt-1 text-muted-foreground">Track and manage your development projects</p>
        </div>
        <Button onClick={handleCreate} disabled={properties.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Create a property first before adding projects.</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <ProjectFilters
              propertyFilter={propertyFilter}
              properties={properties}
              onPropertyChange={setPropertyFilter}
              onClear={() => setPropertyFilter('all')}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                {projects.length === 0 ? 'No projects yet. Create your first project!' : 'No projects match your filter.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const property = properties.find((p) => p.id === project.propertyId);
                return (
                  <ProjectCard
                    key={project.id.toString()}
                    project={project}
                    property={property}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      <ProjectForm
        project={editingProject}
        properties={properties}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
