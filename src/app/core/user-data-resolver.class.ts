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

  /**
   * Resolves the route when the user data is ready.
   *
   * This resolver uses the `@angular/core` `effect` function to
   * create an effect that watches the `user` signal emitted by the
   * `AuthService`. When the user is ready, the promise is resolved
   * with the user data. The effect is automatically unsubscribed
   * when the route is destroyed.
   *
   * @returns A promise that resolves with the user data when ready.
   */
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
