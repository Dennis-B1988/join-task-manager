import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent implements OnInit, OnDestroy {
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

  /**
   * Initializes the component by updating the image paths based on the window
   * size, and sets up an event listener to update the image paths when the
   * window is resized.
   */
  ngOnInit(): void {
    this.updateImagePaths();
    window.addEventListener("resize", this.resizeListener);
  }

  /**
   * Removes the event listener from the window for resizing, to prevent
   * memory leaks.
   */
  ngOnDestroy(): void {
    window.removeEventListener("resize", this.resizeListener);
  }

  /**
   * Updates the image paths for the sidebar based on the current window size.
   * Sets the paths for summary, add tasks, board, and contacts images, using
   * mobile-specific images if the window width is less than 1280 pixels.
   */
  private updateImagePaths(): void {
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
