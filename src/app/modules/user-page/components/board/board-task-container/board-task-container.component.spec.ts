import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BoardTaskContainerComponent } from "./board-task-container.component";

describe("BoardTaskContainerComponent", () => {
  let component: BoardTaskContainerComponent;
  let fixture: ComponentFixture<BoardTaskContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardTaskContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardTaskContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
