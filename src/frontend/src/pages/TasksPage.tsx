import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAllTasks,
  useGetAllProjects,
  useGetAllTeamMembers,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../hooks/useQueries';
import { Task, TaskStatus, TaskPriority } from '../backend';
import TaskCard from '../components/TaskCard';
import TaskForm, { TaskFormData } from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TasksPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: tasks = [], isLoading: tasksLoading } = useGetAllTasks();
  const { data: projects = [], isLoading: projectsLoading } = useGetAllProjects();
  const { data: teamMembers = [], isLoading: membersLoading } = useGetAllTeamMembers();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (memberFilter !== 'all') {
      if (!task.assignedTeamMember || task.assignedTeamMember.toString() !== memberFilter) return false;
    }
    return true;
  });

  const tasksByProject = projects.map((project) => ({
    project,
    tasks: filteredTasks.filter((task) => task.projectId === project.id),
  }));

  const handleCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask.mutateAsync({
          id: editingTask.id,
          ...data,
        });
        toast.success('Task updated successfully');
      } else {
        await createTask.mutateAsync(data);
        toast.success('Task created successfully');
      }
      setFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(id);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Please log in to access tasks</h2>
      </div>
    );
  }

  const isLoading = tasksLoading || projectsLoading || membersLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Tasks</h2>
          <p className="mt-1 text-muted-foreground">Manage and track project tasks</p>
        </div>
        <Button onClick={handleCreate} disabled={projects.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Create a project first before adding tasks.</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <TaskFilters
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              memberFilter={memberFilter}
              teamMembers={teamMembers}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onMemberChange={setMemberFilter}
              onClear={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setMemberFilter('all');
              }}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                {tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'No tasks match your filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {tasksByProject.map(
                ({ project, tasks }) =>
                  tasks.length > 0 && (
                    <div key={project.id.toString()}>
                      <h3 className="mb-4 text-xl font-semibold">{project.name}</h3>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task) => {
                          const teamMember = task.assignedTeamMember
                            ? teamMembers.find((m) => m.id.toString() === task.assignedTeamMember?.toString())
                            : undefined;
                          return (
                            <TaskCard
                              key={task.id.toString()}
                              task={task}
                              teamMember={teamMember}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </>
      )}

      <TaskForm
        task={editingTask}
        projects={projects}
        teamMembers={teamMembers}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
