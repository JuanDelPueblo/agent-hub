import { OnDestroy, Service, signal } from '@angular/core';

/** One seconds-resolution wall clock shared by every working status badge. */
@Service()
export class ActivityClockService implements OnDestroy {
  readonly now = signal(Date.now());
  private readonly interval = setInterval(() => this.now.set(Date.now()), 1000);

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
