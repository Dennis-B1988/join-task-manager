import { Routes } from "@angular/router";
import { LandingPageComponent } from "./modules/landing-page/landing-page.component";
import { UserPageComponent } from "./modules/user-page/user-page.component";

export const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
  },
  {
    path: "",
    component: UserPageComponent,
    loadChildren: () =>
      import("./modules/user-page/user-page.routes").then((m) => m.routes),
  },
];
