import { NgModule } from "@angular/core";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

@NgModule({
  imports: [HeaderComponent, SidebarComponent],
  exports: [HeaderComponent, SidebarComponent],
  declarations: [],
  providers: [],
})
export class SharedModule {}
