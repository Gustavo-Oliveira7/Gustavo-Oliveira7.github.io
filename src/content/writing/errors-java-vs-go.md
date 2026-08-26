---
title: "if err != nil, and treating errors as values"
summary: "The verbosity of Go's error handling is the most common complaint about the language. After writing a fair amount of both, my conclusion is that the if was never the problem — what the exception lets you avoid deciding is."
date: 2026-07-22
tags: ["Go", "Java", "Design"]
---

Everyone who moves from Java to Go goes through the same phase: write three functions, count how many times you typed `if err != nil`, conclude the language is primitive. I went through it. I changed my mind for a specific reason, and it was not an aesthetic one.

## What an exception hides

In Java, the signature below tells you nothing about failure:

```java
public Order findOrder(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new OrderNotFoundException(id));
}
```

The caller is not required to know this can blow up. The `RuntimeException` travels up the stack until something catches it — sometimes a `@ControllerAdvice` three layers above, sometimes nothing. That is excellent for the happy path and miserable when you need to audit every failure point in a flow.

Checked exceptions were the attempt to fix this, and they failed socially: the ecosystem's response was to wrap everything in `RuntimeException` to quiet the compiler.

```java
try {
    return objectMapper.readValue(json, Order.class);
} catch (JsonProcessingException e) {
    throw new RuntimeException(e); // the famous "I'll fix it later"
}
```

In Go the same contract is explicit in the signature, and the compiler will not let you drop the value on the floor:

```go
func (r *Repo) FindOrder(ctx context.Context, id int64) (*Order, error) {
    var o Order
    err := r.db.QueryRowContext(ctx, findOrderQuery, id).Scan(&o.ID, &o.Total)
    if errors.Is(err, sql.ErrNoRows) {
        return nil, fmt.Errorf("order %d: %w", id, ErrNotFound)
    }
    if err != nil {
        return nil, fmt.Errorf("find order %d: %w", id, err)
    }
    return &o, nil
}
```

The `%w` is the part that matters. It wraps the error while preserving the chain, so code higher up can ask about the cause without matching on message text:

```go
if errors.Is(err, ErrNotFound) {
    w.WriteHeader(http.StatusNotFound)
    return
}
```

And for errors carrying data, `errors.As` recovers the concrete type:

```go
type ValidationError struct {
    Field  string
    Reason string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("field %s is invalid: %s", e.Field, e.Reason)
}

var ve *ValidationError
if errors.As(err, &ve) {
    writeJSON(w, 422, map[string]string{"field": ve.Field})
}
```

## The verbosity is real, and it is the right price

I will not pretend it is pretty. A function making four calls has four three-line blocks. The honest defence is this: **each of those blocks is a decision you were forced to make.** In Java, four throwing calls produce zero decisions at the call site, and the decision appears — if it appears — in a generic handler far from the context.

The mistake I saw most often in Go written by Java developers was treating `if err != nil` as ceremony and passing the error along bare:

```go
// bad: the log reads "sql: no rows in result set" and nobody knows where it came from
if err != nil {
    return err
}

// good: each layer adds a clue, and the final log tells the whole story
if err != nil {
    return fmt.Errorf("charge order %d: %w", order.ID, err)
}
```

The second form produces messages like `charge order 4711: call card processor: timeout after 3s`. That is a readable stack trace, assembled by hand, carrying exactly the domain information that matters.

## The Java equivalent

Nothing stops you from modelling errors as values in Java. A sealed `Result<T, E>` with pattern matching gets close:

```java
public sealed interface Result<T> {
    record Ok<T>(T value) implements Result<T> {}
    record Failure<T>(String context, Throwable cause) implements Result<T> {}
}

var r = service.findOrder(id);
return switch (r) {
    case Result.Ok<Order> ok      -> ResponseEntity.ok(ok.value());
    case Result.Failure<Order> f  -> ResponseEntity.status(404).body(f.context());
};
```

It works, and the exhaustive `switch` gives you the same compiler guarantee. The problem is cultural: Java libraries throw, so at every boundary you become a translator and end up with both models in the same codebase. This is worth adopting inside a well-bounded domain core, not across the whole application.

## In short

`if err != nil` is not a missing language feature. It is a deliberate refusal to let the failure path be invisible. After maintaining services under both models, what convinced me was reading a production incident: in the Go service, the error message already contained the chain of decisions that led to the failure. In the Java service, it contained a `NullPointerException` and fifty frames of framework.
