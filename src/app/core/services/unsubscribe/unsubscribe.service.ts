import { Injectable, OnDestroy } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UnsubscribeService implements OnDestroy {
  private subscriptions: (() => void)[] = [];

  /**
   * Registers an unsubscribe function with the service.
   *
   * This method adds the provided unsubscribe function to the internal
   * array of subscriptions. This allows the service to keep track of
   * all active subscriptions and ensure they can be unsubscribed
   * collectively when needed.
   *
   * @param unsub - A function that will be called to unsubscribe from
   *                an observable or event.
   */
  add(unsub: () => void): void {
    this.subscriptions.push(unsub);
  }

  /**
   * Unsubscribes all subscriptions that have been registered with the service.
   *
   * This method will call each unsubscribe function in the array of
   * subscriptions, and then reset the array to an empty array. This is
   * useful for situations where you want to unsubscribe all subscriptions
   * at once, like in the ngOnDestroy lifecycle hook.
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];
  }

  /**
   * Cleans up all subscriptions when the component is destroyed.
   *
   * This lifecycle hook is used to call unsubscribeAll, which will
   * unsubscribe all subscriptions that have been registered with the
   * service. This is useful for preventing memory leaks when the
   * component is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
