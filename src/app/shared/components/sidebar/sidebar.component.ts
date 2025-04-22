import { Component, HostListener } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  private resizeListener = () => this.updateImagePaths();
  private isMobile: boolean = false;

  summaryPath!: string;
  summaryPathActive!: string;
  summaryCurrentPath!: string;

  addTasksPath!: string;
  addTasksPathActive!: string;
  addTasksCurrentPath!: string;

  boardPath!: string;
  boardPathActive!: string;
  boardCurrentPath!: string;

  contactsPath!: string;
  contactsPathActive!: string;
  contactsCurrentPath!: string;

  ngOnInit() {
    this.updateImagePaths();
    window.addEventListener("resize", this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.resizeListener);
  }

  private updateImagePaths() {
    this.isMobile = window.innerWidth < 1280;

    const base = this.isMobile ? "assets/img/mobile" : "assets/img";
    this.summaryPath = `${base}/summary.png`;
    this.summaryPathActive = `${base}/summary-hover.png`;
    this.summaryCurrentPath = this.summaryPath;

    this.addTasksPath = `${base}/add-task.png`;
    this.addTasksPathActive = `${base}/add-task-hover.png`;
    this.addTasksCurrentPath = this.addTasksPath;

    this.boardPath = `${base}/board.png`;
    this.boardPathActive = `${base}/board-hover.png`;
    this.boardCurrentPath = this.boardPath;

    this.contactsPath = `${base}/contacts.png`;
    this.contactsPathActive = `${base}/contacts-hover.png`;
    this.contactsCurrentPath = this.contactsPath;
  }
}
