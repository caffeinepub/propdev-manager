import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    department : Text;
  };

  // Data Types
  public type PropertyType = { #residential; #commercial; #mixedUse };
  public type PropertyStatus = { #planning; #development; #completed };
  public type TaskStatus = { #notStarted; #inProgress; #completed };
  public type TaskPriority = { #low; #medium; #high };

  public type Property = {
    id : Nat;
    name : Text;
    address : Text;
    propertyType : PropertyType;
    status : PropertyStatus;
    acquisitionDate : Nat;
    estimatedCompletionDate : ?Nat;
  };

  public type DevelopmentProject = {
    id : Nat;
    name : Text;
    description : Text;
    budget : Nat;
    startDate : Nat;
    targetCompletionDate : ?Nat;
    currentPhase : Text;
    propertyId : Nat;
  };

  public type Task = {
    id : Nat;
    name : Text;
    description : Text;
    assignedTeamMember : ?Principal;
    status : TaskStatus;
    priority : TaskPriority;
    dueDate : ?Nat;
    projectId : Nat;
  };

  public type TeamMember = {
    id : Principal;
    name : Text;
    role : Text;
    email : Text;
    projectIds : [Nat];
  };

  // Storage Maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let properties = Map.empty<Nat, Property>();
  let projects = Map.empty<Nat, DevelopmentProject>();
  let tasks = Map.empty<Nat, Task>();
  let teamMembers = Map.empty<Principal, TeamMember>();

  // ID Counters
  var propertyIdCounter = 0;
  var projectIdCounter = 0;
  var taskIdCounter = 0;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Property Functions
  public shared ({ caller }) func createProperty(
    name : Text,
    address : Text,
    propertyType : PropertyType,
    status : PropertyStatus,
    acquisitionDate : Nat,
    estimatedCompletionDate : ?Nat,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create properties");
    };

    propertyIdCounter += 1;
    let newProperty : Property = {
      id = propertyIdCounter;
      name;
      address;
      propertyType;
      status;
      acquisitionDate;
      estimatedCompletionDate;
    };
    properties.add(propertyIdCounter, newProperty);
    propertyIdCounter;
  };

  public query ({ caller }) func getProperty(id : Nat) : async ?Property {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view properties");
    };
    properties.get(id);
  };

  public query ({ caller }) func getAllProperties() : async [Property] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view properties");
    };
    properties.values().toArray();
  };

  public shared ({ caller }) func updateProperty(
    id : Nat,
    name : Text,
    address : Text,
    propertyType : PropertyType,
    status : PropertyStatus,
    acquisitionDate : Nat,
    estimatedCompletionDate : ?Nat,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update properties");
    };

    switch (properties.get(id)) {
      case null { false };
      case (?_) {
        let updatedProperty : Property = {
          id;
          name;
          address;
          propertyType;
          status;
          acquisitionDate;
          estimatedCompletionDate;
        };
        properties.add(id, updatedProperty);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteProperty(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete properties");
    };
    properties.remove(id);
  };

  // Development Project Functions
  public shared ({ caller }) func createProject(
    name : Text,
    description : Text,
    budget : Nat,
    startDate : Nat,
    targetCompletionDate : ?Nat,
    currentPhase : Text,
    propertyId : Nat,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create projects");
    };

    projectIdCounter += 1;
    let newProject : DevelopmentProject = {
      id = projectIdCounter;
      name;
      description;
      budget;
      startDate;
      targetCompletionDate;
      currentPhase;
      propertyId;
    };
    projects.add(projectIdCounter, newProject);
    projectIdCounter;
  };

  public query ({ caller }) func getProject(id : Nat) : async ?DevelopmentProject {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    projects.get(id);
  };

  public query ({ caller }) func getAllProjects() : async [DevelopmentProject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    projects.values().toArray();
  };

  public shared ({ caller }) func updateProject(
    id : Nat,
    name : Text,
    description : Text,
    budget : Nat,
    startDate : Nat,
    targetCompletionDate : ?Nat,
    currentPhase : Text,
    propertyId : Nat,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update projects");
    };

    switch (projects.get(id)) {
      case null { false };
      case (?_) {
        let updatedProject : DevelopmentProject = {
          id;
          name;
          description;
          budget;
          startDate;
          targetCompletionDate;
          currentPhase;
          propertyId;
        };
        projects.add(id, updatedProject);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete projects");
    };
    projects.remove(id);
  };

  // Task Functions
  public shared ({ caller }) func createTask(
    name : Text,
    description : Text,
    assignedTeamMember : ?Principal,
    status : TaskStatus,
    priority : TaskPriority,
    dueDate : ?Nat,
    projectId : Nat,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tasks");
    };

    taskIdCounter += 1;
    let newTask : Task = {
      id = taskIdCounter;
      name;
      description;
      assignedTeamMember;
      status;
      priority;
      dueDate;
      projectId;
    };
    tasks.add(taskIdCounter, newTask);
    taskIdCounter;
  };

  public query ({ caller }) func getTask(id : Nat) : async ?Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.get(id);
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray();
  };

  public shared ({ caller }) func updateTask(
    id : Nat,
    name : Text,
    description : Text,
    assignedTeamMember : ?Principal,
    status : TaskStatus,
    priority : TaskPriority,
    dueDate : ?Nat,
    projectId : Nat,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };

    switch (tasks.get(id)) {
      case null { false };
      case (?existingTask) {
        // Users can only update tasks assigned to them, admins can update any task
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          switch (existingTask.assignedTeamMember) {
            case null {
              Runtime.trap("Unauthorized: Task is not assigned to you");
            };
            case (?assignedTo) {
              if (assignedTo != caller) {
                Runtime.trap("Unauthorized: Task is not assigned to you");
              };
            };
          };
        };

        let updatedTask : Task = {
          id;
          name;
          description;
          assignedTeamMember;
          status;
          priority;
          dueDate;
          projectId;
        };
        tasks.add(id, updatedTask);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteTask(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete tasks");
    };
    tasks.remove(id);
  };

  // Team Member Functions
  public shared ({ caller }) func addTeamMember(
    id : Principal,
    name : Text,
    role : Text,
    email : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add team members");
    };

    let newMember : TeamMember = {
      id;
      name;
      role;
      email;
      projectIds = [];
    };
    teamMembers.add(id, newMember);
  };

  public query ({ caller }) func getTeamMember(id : Principal) : async ?TeamMember {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view team members");
    };
    teamMembers.get(id);
  };

  public query ({ caller }) func getAllTeamMembers() : async [TeamMember] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view team members");
    };
    teamMembers.values().toArray();
  };

  public shared ({ caller }) func updateTeamMember(
    id : Principal,
    name : Text,
    role : Text,
    email : Text,
    projectIds : [Nat],
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update team members");
    };

    switch (teamMembers.get(id)) {
      case null { false };
      case (?_) {
        let updatedMember : TeamMember = {
          id;
          name;
          role;
          email;
          projectIds;
        };
        teamMembers.add(id, updatedMember);
        true;
      };
    };
  };

  public shared ({ caller }) func removeTeamMember(id : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove team members");
    };
    teamMembers.remove(id);
  };
};
