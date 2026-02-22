import { Task, TeamMember } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  teamMember?: TeamMember;
  onEdit: (task: Task) => void;
  onDelete: (id: bigint) => void;
}

const statusColors = {
  notStarted: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  inProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusLabels = {
  notStarted: 'Not Started',
  inProgress: 'In Progress',
  completed: 'Completed',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export default function TaskCard({ task, teamMember, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.name}</CardTitle>
          <div className="flex gap-2">
            <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>
            <Badge className={priorityColors[task.priority]}>{priorityLabels[task.priority]}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          {teamMember && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Assigned to:</span>
              <span className="flex items-center gap-1 font-medium">
                <User className="h-3 w-3" />
                {teamMember.name}
              </span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Due Date:</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(task)} className="flex-1">
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
