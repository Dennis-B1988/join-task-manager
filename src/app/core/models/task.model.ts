export interface Task {
  // id: string;
  title: string;
  description: string;
  assignedTo: { displayName: string; initials: string }[];
  dueDate: string;
  priority: string;
  category: string;
  subtask: { open: string[]; done: string[] };
  status: string;
}
