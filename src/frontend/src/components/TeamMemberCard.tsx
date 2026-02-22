import { TeamMember, DevelopmentProject } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Mail, Briefcase, FolderKanban } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
  projects: DevelopmentProject[];
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

export default function TeamMemberCard({ member, projects, onEdit, onDelete }: TeamMemberCardProps) {
  const memberProjects = projects.filter((p) => member.projectIds.some((id) => id === p.id));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{member.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Role:</span>
            <span className="flex items-center gap-1 font-medium">
              <Briefcase className="h-3 w-3" />
              {member.role}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Email:</span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {member.email}
            </span>
          </div>
          {memberProjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <FolderKanban className="h-3 w-3" />
                <span>Active Projects:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {memberProjects.map((project) => (
                  <span
                    key={project.id.toString()}
                    className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    {project.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(member)} className="flex-1">
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(member.id.toString())}
              className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
