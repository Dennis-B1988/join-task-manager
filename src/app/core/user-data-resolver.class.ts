import {
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from "@angular/core";
import { Resolve } from "@angular/router";
import { CustomUser } from "./models/user.model";
import { AuthService } from "./services/auth/auth.service";
import { UnsubscribeService } from "./services/unsubscribe/unsubscribe.service";

@Injectable({ providedIn: "root" })
export class UserDataResolver implements Resolve<CustomUser> {
  private authService = inject(AuthService);
  private unsubscribeService = inject(UnsubscribeService);
  private injector = inject(EnvironmentInjector);

  constructor() {}

  resolve(): Promise<CustomUser> {
    return new Promise((resolve) => {
      runInInjectionContext(this.injector, () => {
        const subscription = effect(() => {
          const user = this.authService.user();
          if (user) {
            resolve(user);
            this.unsubscribeService.add(() => subscription);
          }
        });
      });
    });
  }
}
