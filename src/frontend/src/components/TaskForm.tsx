import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, DevelopmentProject, TeamMember } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Principal } from '@dfinity/principal';

interface TaskFormProps {
  task?: Task | null;
  projects: DevelopmentProject[];
  teamMembers: TeamMember[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
}

export interface TaskFormData {
  name: string;
  description: string;
  assignedTeamMember: Principal | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: bigint | null;
  projectId: bigint;
}

export default function TaskForm({ task, projects, teamMembers, open, onClose, onSubmit }: TaskFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTeamMember, setAssignedTeamMember] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.notStarted);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.medium);
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setAssignedTeamMember(task.assignedTeamMember ? task.assignedTeamMember.toString() : '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(Number(task.dueDate)).toISOString().split('T')[0] : '');
      setProjectId(task.projectId.toString());
    } else {
      setName('');
      setDescription('');
      setAssignedTeamMember('');
      setStatus(TaskStatus.notStarted);
      setPriority(TaskPriority.medium);
      setDueDate('');
      setProjectId(projects.length > 0 ? projects[0].id.toString() : '');
    }
  }, [task, projects, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      assignedTeamMember: assignedTeamMember ? Principal.fromText(assignedTeamMember) : null,
      status,
      priority,
      dueDate: dueDate ? BigInt(new Date(dueDate).getTime()) : null,
      projectId: BigInt(projectId),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select value={projectId} onValueChange={setProjectId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((proj) => (
                  <SelectItem key={proj.id.toString()} value={proj.id.toString()}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedTeamMember">Assigned To</Label>
            <Select value={assignedTeamMember} onValueChange={setAssignedTeamMember}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id.toString()} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.notStarted}>Not Started</SelectItem>
                  <SelectItem value={TaskStatus.inProgress}>In Progress</SelectItem>
                  <SelectItem value={TaskStatus.completed}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskPriority.low}>Low</SelectItem>
                  <SelectItem value={TaskPriority.medium}>Medium</SelectItem>
                  <SelectItem value={TaskPriority.high}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{task ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
