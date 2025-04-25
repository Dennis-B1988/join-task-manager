export const dummyTasks = [
  {
    title: "Implementing user authentication",
    description:
      "Development and integration of a secure authentication system for users.",
    dueDate: "2025-05-24",
    priority: "Urgent",
    category: "User Story",
    status: "To Do",
    assignedTo: [
      { displayName: "Alice Smith" },
      { displayName: "Charlie Brown" },
    ],
    subtask: {
      open: [
        {
          done: false,
          id: "1",
          subtaskValue: "Design of the authentication system",
        },
        {
          done: false,
          id: "2",
          subtaskValue: "Integration into the user interface",
        },
        {
          done: false,
          id: "3",
          subtaskValue: "Tests and troubleshooting",
        },
      ],
      done: [],
    },
  },
  {
    title: "Optimization of database queries",
    description:
      "Analysis and optimization of database queries to improve application performance.",
    dueDate: "2025-06-20",
    priority: "Medium",
    category: "Technical Task",
    status: "To Do",
    assignedTo: [
      { displayName: "Bob Johnson" },
      { displayName: "David Davis" },
    ],
    subtask: {
      open: [
        {
          done: false,
          id: "1",
          subtaskValue: "Database analysis",
        },
        {
          done: false,
          id: "2",
          subtaskValue: "Optimization of SQL queries",
        },
        {
          done: false,
          id: "3",
          subtaskValue: "Review of the results",
        },
      ],
      done: [],
    },
  },
];

export const dummyContacts = [
  {
    displayName: "Alice Smith",
    email: "alice@example.com",
    phone: "123-456-7890",
  },
  {
    displayName: "Bob Johnson",
    email: "bob@example.com",
    phone: "987-654-3210",
  },
  {
    displayName: "Charlie Brown",
    email: "charlie@example.com",
    phone: "555-555-5555",
  },
  {
    displayName: "David Davis",
    email: "david@example.com",
    phone: "111-222-3333",
  },
];
