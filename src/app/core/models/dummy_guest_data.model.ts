export const dummyTasks = [
  {
    title: "Implementierung der Benutzerauthentifizierung",
    description:
      "Entwicklung und Integration eines sicheren Authentifizierungssystems für Benutzer.",
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
          subtaskValue: "Entwurf des Authentifizierungssystems",
        },
        {
          done: false,
          id: "2",
          subtaskValue: "Integration in die Benutzeroberfläche",
        },
        {
          done: false,
          id: "3",
          subtaskValue: "Tests und Fehlerbehebung",
        },
      ],
      done: [],
    },
  },
  {
    title: "Optimierung der Datenbankabfragen",
    description:
      "Analyse und Optimierung der Datenbankabfragen, um die Leistung der Anwendung zu verbessern.",
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
          subtaskValue: "Datenbankanalyse",
        },
        {
          done: false,
          id: "2",
          subtaskValue: "Optimierung der SQL-Abfragen",
        },
        {
          done: false,
          id: "3",
          subtaskValue: "Überprüfung der Ergebnisse",
        },
      ],
      done: [],
    },
  },
];
