import { TaskStatus, TaskPriority, TeamMember } from '../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TaskFiltersProps {
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
  memberFilter: string;
  teamMembers: TeamMember[];
  onStatusChange: (status: TaskStatus | 'all') => void;
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  onMemberChange: (memberId: string) => void;
  onClear: () => void;
}

export default function TaskFilters({
  statusFilter,
  priorityFilter,
  memberFilter,
  teamMembers,
  onStatusChange,
  onPriorityChange,
  onMemberChange,
  onClear,
}: TaskFiltersProps) {
  const hasFilters = statusFilter !== 'all' || priorityFilter !== 'all' || memberFilter !== 'all';

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
            <SelectItem value={TaskStatus.notStarted}>Not Started</SelectItem>
            <SelectItem value={TaskStatus.inProgress}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.completed}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Priority:</span>
        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={TaskPriority.low}>Low</SelectItem>
            <SelectItem value={TaskPriority.medium}>Medium</SelectItem>
            <SelectItem value={TaskPriority.high}>High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Assigned:</span>
        <Select value={memberFilter} onValueChange={onMemberChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id.toString()} value={member.id.toString()}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
