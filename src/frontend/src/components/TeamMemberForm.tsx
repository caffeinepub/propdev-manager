import { useState, useEffect } from 'react';
import { TeamMember, DevelopmentProject } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Principal } from '@dfinity/principal';

interface TeamMemberFormProps {
  member?: TeamMember | null;
  projects: DevelopmentProject[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TeamMemberFormData) => void;
}

export interface TeamMemberFormData {
  id: Principal;
  name: string;
  role: string;
  email: string;
  projectIds: bigint[];
}

export default function TeamMemberForm({ member, projects, open, onClose, onSubmit }: TeamMemberFormProps) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (member) {
      setId(member.id.toString());
      setName(member.name);
      setRole(member.role);
      setEmail(member.email);
      setSelectedProjects(new Set(member.projectIds.map((id) => id.toString())));
    } else {
      setId('');
      setName('');
      setRole('');
      setEmail('');
      setSelectedProjects(new Set());
    }
  }, [member, open]);

  const handleProjectToggle = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: member ? member.id : Principal.fromText(id),
      name,
      role,
      email,
      projectIds: Array.from(selectedProjects).map((id) => BigInt(id)),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!member && (
            <div className="space-y-2">
              <Label htmlFor="id">Principal ID</Label>
              <Input
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter principal ID"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Project Assignments</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border p-3">
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects available</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id.toString()} className="flex items-center space-x-2">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={selectedProjects.has(project.id.toString())}
                      onCheckedChange={() => handleProjectToggle(project.id.toString())}
                    />
                    <label
                      htmlFor={`project-${project.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {project.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{member ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
