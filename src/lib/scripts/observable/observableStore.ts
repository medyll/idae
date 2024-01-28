class ObservableStore<T> {
  private value: T;
  private subscribers: Set<(value: T) => void>;

  constructor(initialValue: T) {
    this.value = initialValue;
    this.subscribers = new Set();
  }

  // Method to subscribe to changes
  subscribe(run: (value: T) => void, invalidate: () => void = () => {}): () => void {
    this.subscribers.add(run);
    run(this.value);

    // Return an unsubscribe function
    return () => {
      this.subscribers.delete(run);
      invalidate();
    };
  }

  // Method to set new value and notify subscribers
  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      for (const run of this.subscribers) {
        run(this.value);
      }
    }
  }

  // Method to update the value based on a function
  update(updater: (value: T) => T): void {
    this.set(updater(this.value));
  }

  notify(data: any) {
    this.subscribers.forEach((observer) => observer(data));
  }
}

/* // Usage
const countStore = new ObservableStore<number>(0);

// Subscribe to changes
const unsubscribe = countStore.subscribe((value) => {
    console.log(`The count is now ${value}`);
});

// Update the store
countStore.set(1);
countStore.update((count) => count + 1);

// Unsubscribe when done
unsubscribe(); */
