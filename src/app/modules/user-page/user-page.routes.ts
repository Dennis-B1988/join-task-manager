import { Routes } from "@angular/router";
import { SummaryComponent } from "./components/summary/summary.component";

export const routes: Routes = [
  {
    path: "",
    children: [
      // {
      //   path: "",
      //   redirectTo: "summary",
      //   pathMatch: "full",
      // },
      {
        path: "summary",
        component: SummaryComponent,
      },
      {
        path: "add-tasks",
        loadComponent: () =>
          import("./components/add-task/add-task.component").then(
            (m) => m.AddTaskComponent,
          ),
      },
      {
        path: "board",
        loadComponent: () =>
          import("./components/board/board.component").then(
            (m) => m.BoardComponent,
          ),
      },
      {
        path: "contacts",
        loadComponent: () =>
          import("./components/contacts/contacts.component").then(
            (m) => m.ContactsComponent,
          ),
      },
      {
        path: "help",
        loadComponent: () =>
          import("../information-page/components/help/help.component").then(
            (m) => m.HelpComponent,
          ),
      },
      {
        path: "legal-notice",
        loadComponent: () =>
          import(
            "../information-page/components/legal-notice/legal-notice.component"
          ).then((m) => m.LegalNoticeComponent),
      },
      {
        path: "privacy-policy",
        loadComponent: () =>
          import(
            "../information-page/components/privacy-policy/privacy-policy.component"
          ).then((m) => m.PrivacyPolicyComponent),
      },
    ],
  },
];
