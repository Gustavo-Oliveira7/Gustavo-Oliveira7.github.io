---
title: "Goroutines and virtual threads: one problem, two bets"
summary: "Java 21 shipped virtual threads and the comparison with goroutines became unavoidable. Both attack the cost of an OS thread — but they make different bets on scheduling and on what happens when something blocks."
date: 2026-08-10
tags: ["Java", "Go", "Concurrency"]
---

For a long time Java's answer to I/O-bound concurrency was "use a thread pool and hope." A platform thread costs roughly 1 MB of reserved stack and a scheduling decision that goes through the kernel. Creating ten thousand of them is not an option, so the whole ecosystem shaped itself around that scarcity: pools, `CompletableFuture`, reactive programming, and the complexity that comes with them.

Go never had that problem, because it started from the other side.

## What a unit of execution costs

A goroutine starts with a 2 KB stack that grows on demand. The runtime multiplexes N goroutines across M OS threads — the M:N scheduler. Creating a million of them is viable, and people do it.

```go
func main() {
    var wg sync.WaitGroup
    for i := 0; i < 100_000; i++ {
        wg.Add(1)
        go func(n int) {
            defer wg.Done()
            resp, err := http.Get(fmt.Sprintf("https://api.example.com/item/%d", n))
            if err != nil {
                return
            }
            defer resp.Body.Close()
        }(i)
    }
    wg.Wait()
}
```

Java 21's virtual threads make essentially the same bet. The JVM now parks the stack on the heap and unmounts it when the thread blocks, so ordinary imperative code starts to scale:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 100_000).forEach(n ->
        executor.submit(() -> {
            var req = HttpRequest.newBuilder()
                .uri(URI.create("https://api.example.com/item/" + n))
                .build();
            return client.send(req, BodyHandlers.ofString());
        })
    );
}
```

The important part: **neither example uses a callback or `async/await`**. You write blocking code and the runtime takes care of not wasting an OS thread while it waits.

## Where the two diverge

The difference that actually bites is what counts as a yield point.

In Go the scheduler has been preemptive since 1.14. A tight loop with no function call can be interrupted by a signal, and the goroutine gives up the processor. You rarely have to think about it.

In Java a virtual thread is unmounted from its carrier at blocking points the JVM knows about — network I/O, `sleep`, most of `java.util.concurrent`. But there are *pinning* cases where it stays stuck to the platform thread and you lose the benefit entirely. The two classics:

- blocking work inside a `synchronized` block;
- native calls through JNI.

```java
// This pins the virtual thread to its carrier for the duration of the I/O.
synchronized (lock) {
    connection.runSlowQuery();
}

// Swap in an explicit lock, which the runtime knows how to unmount around.
private final ReentrantLock lock = new ReentrantLock();

lock.lock();
try {
    connection.runSlowQuery();
} finally {
    lock.unlock();
}
```

Trading `synchronized` for `ReentrantLock` is the single most common change when moving an older Java codebase onto virtual threads. Run with `-Djdk.tracePinnedThreads=full` to find the spots.

## Cancellation: Go still wins here

Go standardised on `context.Context` and the entire ecosystem honours it. Cancelling a call tree is one line:

```go
ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
defer cancel()

result, err := repo.Find(ctx, id) // aborts itself on timeout
```

Java's answer is structured concurrency (`StructuredTaskScope`), which ties subtask lifetime to lexical scope and cancels the siblings when one fails:

```java
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var user   = scope.fork(() -> findUser(id));
    var orders = scope.fork(() -> findOrders(id));

    scope.join().throwIfFailed();
    return new Dashboard(user.get(), orders.get());
}
```

Conceptually that is cleaner than threading a `ctx` through every function signature in the codebase. In practice, Go's ecosystem is already fully adapted to its model and Java's is still getting there.

## What I take into day-to-day work

Virtual threads do not make code faster. They make *simple* code fast enough. The real win is being able to delete the reactive layer that existed only to work around thread scarcity, and going back to a stack trace you can actually read.

If you maintain a Java service whose pool saturates on I/O, virtual threads are probably the best return on effort available today. If you are starting a new service whose whole job is orchestrating dozens of concurrent calls, Go's model is still the most direct — not because it is faster, but because the entire language was designed around it.
