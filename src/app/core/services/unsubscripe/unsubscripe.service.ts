import { Injectable, OnDestroy } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UnsubscripeService implements OnDestroy {
  private subscriptions: (() => void)[] = [];

  add(unsub: () => void) {
    this.subscriptions.push(unsub);
  }

  unsubscripeAll() {
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];
    console.log("All subscriptions unsubscribed");
  }

  ngOnDestroy() {
    this.unsubscripeAll();
  }
}
