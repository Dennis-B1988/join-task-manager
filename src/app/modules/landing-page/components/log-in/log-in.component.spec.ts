import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockComponent, MockProvider } from "ng-mocks";

import { signal } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { Firestore } from "firebase/firestore";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { LogInComponent } from "./log-in.component";

describe("LogInComponent", () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let mockService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogInComponent],
      providers: [
        MockProvider(AuthService, {
          wrongEmail: signal(false),
          wrongPassword: signal(false),
          loadingUser: signal(false),
        }),
        MockProvider(Auth),
        MockProvider(Firestore),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("computed signals", () => {
    it("reflects service.wrongEmail", () => {
      expect(component.wrongEmail()).toBe(false);
      mockService.wrongEmail.set(true);
      fixture.detectChanges();
      expect(component.wrongEmail()).toBe(true);
    });

    it("reflects service.wrongPassword", () => {
      expect(component.wrongPassword()).toBe(false);
      mockService.wrongPassword.set(true);
      fixture.detectChanges();
      expect(component.wrongPassword()).toBe(true);
    });

    it("reflects service.loadingUser", () => {
      expect(component.loadingUser()).toBe(false);
      mockService.loadingUser.set(true);
      fixture.detectChanges();
      expect(component.loadingUser()).toBe(true);
    });
  });
});
