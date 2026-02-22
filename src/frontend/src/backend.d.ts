import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Property {
    id: bigint;
    status: PropertyStatus;
    propertyType: PropertyType;
    acquisitionDate: bigint;
    name: string;
    address: string;
    estimatedCompletionDate?: bigint;
}
export interface DevelopmentProject {
    id: bigint;
    currentPhase: string;
    targetCompletionDate?: bigint;
    name: string;
    description: string;
    propertyId: bigint;
    budget: bigint;
    startDate: bigint;
}
export interface TeamMember {
    id: Principal;
    name: string;
    role: string;
    email: string;
    projectIds: Array<bigint>;
}
export interface Task {
    id: bigint;
    status: TaskStatus;
    name: string;
    dueDate?: bigint;
    description: string;
    projectId: bigint;
    priority: TaskPriority;
    assignedTeamMember?: Principal;
}
export interface UserProfile {
    name: string;
    email: string;
    department: string;
}
export enum PropertyStatus {
    completed = "completed",
    development = "development",
    planning = "planning"
}
export enum PropertyType {
    commercial = "commercial",
    residential = "residential",
    mixedUse = "mixedUse"
}
export enum TaskPriority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum TaskStatus {
    notStarted = "notStarted",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTeamMember(id: Principal, name: string, role: string, email: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(name: string, description: string, budget: bigint, startDate: bigint, targetCompletionDate: bigint | null, currentPhase: string, propertyId: bigint): Promise<bigint>;
    createProperty(name: string, address: string, propertyType: PropertyType, status: PropertyStatus, acquisitionDate: bigint, estimatedCompletionDate: bigint | null): Promise<bigint>;
    createTask(name: string, description: string, assignedTeamMember: Principal | null, status: TaskStatus, priority: TaskPriority, dueDate: bigint | null, projectId: bigint): Promise<bigint>;
    deleteProject(id: bigint): Promise<void>;
    deleteProperty(id: bigint): Promise<void>;
    deleteTask(id: bigint): Promise<void>;
    getAllProjects(): Promise<Array<DevelopmentProject>>;
    getAllProperties(): Promise<Array<Property>>;
    getAllTasks(): Promise<Array<Task>>;
    getAllTeamMembers(): Promise<Array<TeamMember>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(id: bigint): Promise<DevelopmentProject | null>;
    getProperty(id: bigint): Promise<Property | null>;
    getTask(id: bigint): Promise<Task | null>;
    getTeamMember(id: Principal): Promise<TeamMember | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeTeamMember(id: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProject(id: bigint, name: string, description: string, budget: bigint, startDate: bigint, targetCompletionDate: bigint | null, currentPhase: string, propertyId: bigint): Promise<boolean>;
    updateProperty(id: bigint, name: string, address: string, propertyType: PropertyType, status: PropertyStatus, acquisitionDate: bigint, estimatedCompletionDate: bigint | null): Promise<boolean>;
    updateTask(id: bigint, name: string, description: string, assignedTeamMember: Principal | null, status: TaskStatus, priority: TaskPriority, dueDate: bigint | null, projectId: bigint): Promise<boolean>;
    updateTeamMember(id: Principal, name: string, role: string, email: string, projectIds: Array<bigint>): Promise<boolean>;
}
