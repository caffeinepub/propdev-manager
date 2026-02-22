import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Property,
  DevelopmentProject,
  Task,
  TeamMember,
  UserProfile,
  PropertyType,
  PropertyStatus,
  TaskStatus,
  TaskPriority,
} from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Property Queries
export function useGetAllProperties() {
  const { actor, isFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProperties();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      address: string;
      propertyType: PropertyType;
      status: PropertyStatus;
      acquisitionDate: bigint;
      estimatedCompletionDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProperty(
        data.name,
        data.address,
        data.propertyType,
        data.status,
        data.acquisitionDate,
        data.estimatedCompletionDate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      address: string;
      propertyType: PropertyType;
      status: PropertyStatus;
      acquisitionDate: bigint;
      estimatedCompletionDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProperty(
        data.id,
        data.name,
        data.address,
        data.propertyType,
        data.status,
        data.acquisitionDate,
        data.estimatedCompletionDate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useDeleteProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProperty(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Project Queries
export function useGetAllProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<DevelopmentProject[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      budget: bigint;
      startDate: bigint;
      targetCompletionDate: bigint | null;
      currentPhase: string;
      propertyId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProject(
        data.name,
        data.description,
        data.budget,
        data.startDate,
        data.targetCompletionDate,
        data.currentPhase,
        data.propertyId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      description: string;
      budget: bigint;
      startDate: bigint;
      targetCompletionDate: bigint | null;
      currentPhase: string;
      propertyId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(
        data.id,
        data.name,
        data.description,
        data.budget,
        data.startDate,
        data.targetCompletionDate,
        data.currentPhase,
        data.propertyId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Task Queries
export function useGetAllTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      assignedTeamMember: Principal | null;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: bigint | null;
      projectId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(
        data.name,
        data.description,
        data.assignedTeamMember,
        data.status,
        data.priority,
        data.dueDate,
        data.projectId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      description: string;
      assignedTeamMember: Principal | null;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: bigint | null;
      projectId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTask(
        data.id,
        data.name,
        data.description,
        data.assignedTeamMember,
        data.status,
        data.priority,
        data.dueDate,
        data.projectId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Team Member Queries
export function useGetAllTeamMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<TeamMember[]>({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTeamMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTeamMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: Principal; name: string; role: string; email: string; projectIds: bigint[] }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addTeamMember(data.id, data.name, data.role, data.email);
      if (data.projectIds.length > 0) {
        await actor.updateTeamMember(data.id, data.name, data.role, data.email, data.projectIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
}

export function useUpdateTeamMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: Principal; name: string; role: string; email: string; projectIds: bigint[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTeamMember(data.id, data.name, data.role, data.email, data.projectIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
}

export function useRemoveTeamMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeTeamMember(Principal.fromText(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
}
