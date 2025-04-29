import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";

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
          resetErrorMessages: jasmine
            .createSpy("resetErrorMessages")
            .and.callFake(() => {
              mockService.wrongEmail.set(false);
              mockService.wrongPassword.set(false);
            }),
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

  describe("toggle state", () => {
    it("toggleSignUp", () => {
      component.toggleRememberMe();
      expect(component.rememberMe).toBe(true);
    });

    it("toggleFocusPassword", () => {
      component.toggleFocusPassword();
      expect(component.focusPassword).toBe(true);
    });

    it("togglePassword", () => {
      component.togglePassword();
      expect(component.showPassword).toBe(true);
    });
  });

  describe("on destroy", () => {
    it("should reset all signals", () => {
      mockService.wrongEmail.set(true);
      mockService.wrongPassword.set(true);
      fixture.detectChanges();

      component.ngOnDestroy();
      fixture.detectChanges();

      expect(mockService.resetErrorMessages).toHaveBeenCalled();
      expect(mockService.wrongEmail()).toBe(false);
      expect(mockService.wrongPassword()).toBe(false);
    });
  });

  describe("form email", () => {
    beforeEach(() => {
      component.loginForm.get("email")?.patchValue("patched@example.com");
      fixture.detectChanges();
    });

    it("should reflect patched value in the input", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("#email");
      expect(input.value).toBe("patched@example.com");
    });

    it("should update form control value when typing", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("#email");

      input.value = "test@example.com";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.loginForm.get("email")?.value).toBe("test@example.com");
    });
  });

  describe("should call login methods", () => {
    it("should call onSubmit", () => {
      const spy = spyOn(component, "onSubmit").and.callThrough();
      component.onSubmit();
      expect(spy).toHaveBeenCalled();
    });

    it("should call guestLogin", () => {
      const spy = spyOn(component, "guestLogin").and.callThrough();
      component.guestLogin();
      expect(spy).toHaveBeenCalled();
    });

    it("should not call logIn when loading", () => {
      component.isLoading = true;

      component.loginForm.setValue({
        email: "test@example.com",
        password: "123456",
      });

      const logInSpy = spyOn(mockService, "logIn");

      component.onSubmit();
      expect(logInSpy).not.toHaveBeenCalled();

      component.guestLogin();
      expect(logInSpy).not.toHaveBeenCalled();

      component.isLoading = false;
    });
  });
});
