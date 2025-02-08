import { Routes } from "@angular/router";
import { LandingPageComponent } from "./modules/landing-page/landing-page.component";
import { UserPageComponent } from "./modules/user-page/user-page.component";

export const routes: Routes = [
  //   {
  //     path: "",
  //     redirectTo: "landing-page",
  //     pathMatch: "full",
  //   },
  {
    path: "",
    component: LandingPageComponent,
    // loadChildren: () =>
    //   import("./modules/user-page/user-page.routes").then((m) => m.routes),
  },
  {
    path: "user/:userId",
    component: UserPageComponent,
    loadChildren: () =>
      import("./modules/user-page/user-page.routes").then((m) => m.routes),
  },
];
