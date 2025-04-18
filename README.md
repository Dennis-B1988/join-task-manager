# 🧩 Join – Task Manager

**Join** is a modern task management dashboard that lets you create, organize, and manage tasks visually. Inspired by Kanban-style productivity tools, Join offers a clean UI and smart features like urgency indicators and contact assignments.

---

## 🚀 Features

### 📊 Summary Dashboard

- Displays the total number of tasks
- Grouped by **status** (e.g., To Do, In Progress, Done)
- Shows the **next upcoming deadline** for urgent tasks

### ✅ Task Management

- Create detailed tasks with:
  - Title & Description
  - Priority (Low, Medium, Urgent)
  - Due Date
  - Subtasks (with completion tracking)
  - Contact assignments
- Assign tasks to one or more contacts

### 🗂️ Board View

- Drag-and-drop task management
- View all tasks by status: **To Do**, **In Progress**, **Awaiting Feedback**, **Done**
- Edit or delete existing tasks directly from the board

### 👥 Contact Management

- Add, edit, or remove contacts
- Each contact has a display name and color-coded initials
- Assign contacts to tasks for collaboration tracking

---

## 🔧 Tech Stack

- **Angular** for frontend
- **Firebase** for backend (Auth, Firestore)
- **TypeScript** for logic and type safety
- **RxJS** and Angular Signals for reactive state management
- **SCSS / CSS** for styling

---

## 🚀 Getting Started

### 🔨 Installation

```bash
npm install
```

## 🔑 Firebase Setup

src/ ├── evironment/ │ ├── firebase.template.ts

src/ ├── evironment/ │ ├── firebase.prod.ts

src/ ├── app/ │ ├── services/ # Firebase, Tasks, Auth, Contacts │ ├── components/ # Summary, Board, Task Card, Edit Task, etc. │ ├── pages/ # SummaryPage, BoardPage, ContactsPage │ ├── models/ # Interfaces for Task, Contact, Subtask │ └── app.module.ts ├── assets/ # Icons, Images, Styling Assets └── environments/ # Firebase config

- Rename environment/firebase.template.ts to environment/firebase.prod.ts

- Replace the firebaseConfig with your credentials:

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## 🏃 Run Locally

```bash
ng serve
```

- Open http://localhost:4200/ in your browser.
