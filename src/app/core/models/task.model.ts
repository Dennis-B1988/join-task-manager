export interface Task {
  id?: string;
  title: string;
  description: string;
  assignedTo: { displayName: string }[];
  dueDate: string;
  priority: string;
  category: string;
  subtask: {
    open: Subtask[];
    done: Subtask[];
  };
  status: string;
}

export interface Subtask {
  id?: string;
  subtaskValue: string;
  done: boolean;
}
