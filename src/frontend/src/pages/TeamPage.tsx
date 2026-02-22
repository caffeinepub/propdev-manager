import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAllTeamMembers,
  useGetAllProjects,
  useAddTeamMember,
  useUpdateTeamMember,
  useRemoveTeamMember,
} from '../hooks/useQueries';
import { TeamMember } from '../backend';
import TeamMemberCard from '../components/TeamMemberCard';
import TeamMemberForm, { TeamMemberFormData } from '../components/TeamMemberForm';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TeamPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: teamMembers = [], isLoading: membersLoading } = useGetAllTeamMembers();
  const { data: projects = [], isLoading: projectsLoading } = useGetAllProjects();
  const addTeamMember = useAddTeamMember();
  const updateTeamMember = useUpdateTeamMember();
  const removeTeamMember = useRemoveTeamMember();

  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleCreate = () => {
    setEditingMember(null);
    setFormOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormOpen(true);
  };

  const handleSubmit = async (data: TeamMemberFormData) => {
    try {
      if (editingMember) {
        await updateTeamMember.mutateAsync(data);
        toast.success('Team member updated successfully');
      } else {
        await addTeamMember.mutateAsync(data);
        toast.success('Team member added successfully');
      }
      setFormOpen(false);
      setEditingMember(null);
    } catch (error) {
      toast.error('Failed to save team member');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        await removeTeamMember.mutateAsync(id);
        toast.success('Team member removed successfully');
      } catch (error) {
        toast.error('Failed to remove team member');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Please log in to access team management</h2>
      </div>
    );
  }

  const isLoading = membersLoading || projectsLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Team Members</h2>
          <p className="mt-1 text-muted-foreground">Manage your team and project assignments</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No team members yet. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id.toString()}
              member={member}
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TeamMemberForm
        member={editingMember}
        projects={projects}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingMember(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
