import { DevelopmentProject, Property } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, DollarSign, Calendar, Building2 } from 'lucide-react';

interface ProjectCardProps {
  project: DevelopmentProject;
  property?: Property;
  onEdit: (project: DevelopmentProject) => void;
  onDelete: (id: bigint) => void;
}

export default function ProjectCard({ project, property, onEdit, onDelete }: ProjectCardProps) {
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleDateString();
  };

  const formatCurrency = (amount: bigint) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{project.name}</CardTitle>
            {property && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {property.name}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Budget:</span>
            <span className="flex items-center gap-1 font-medium">
              <DollarSign className="h-3 w-3" />
              {formatCurrency(project.budget)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Phase:</span>
            <span className="font-medium">{project.currentPhase}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(project.startDate)}
            </span>
          </div>
          {project.targetCompletionDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Target Completion:</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(project.targetCompletionDate)}
              </span>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(project)} className="flex-1">
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(project.id)}
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
