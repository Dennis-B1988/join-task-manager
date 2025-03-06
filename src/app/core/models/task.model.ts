export interface Task {
  // id: number;
  title: string;
  description: string;
  assignedTo: string[];
  dueDate: string;
  priority: string;
  category: string;
  subtask: string[];
  status: string;
}
