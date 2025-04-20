import { Injectable, OnDestroy } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UnsubscribeService implements OnDestroy {
  private subscriptions: (() => void)[] = [];

  add(unsub: () => void) {
    this.subscriptions.push(unsub);
  }

  unsubscribeAll() {
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }
}
