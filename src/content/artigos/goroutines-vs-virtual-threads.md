---
titulo: "Goroutines e Virtual Threads: o mesmo problema, duas apostas"
resumo: "Java 21 trouxe virtual threads e a comparação com goroutines virou inevitável. As duas resolvem o custo da thread do sistema operacional — mas escolhem trade-offs diferentes no agendamento e no que acontece quando algo bloqueia."
data: 2026-08-10
tags: ["Java", "Go", "Concorrência"]
---

Por muito tempo a resposta do Java para concorrência em I/O foi "use um pool de threads e reze". Uma thread de plataforma custa cerca de 1 MB de stack reservado e um agendamento que passa pelo kernel. Criar dez mil delas não é uma opção, então o ecossistema inteiro se moldou em torno dessa escassez: pools, `CompletableFuture`, programação reativa, e a complexidade que vem junto.

Go nunca teve esse problema porque começou do outro lado.

## O custo de uma unidade de execução

Uma goroutine nasce com um stack de 2 KB que cresce sob demanda. O runtime do Go multiplexa N goroutines sobre M threads do sistema operacional — o famoso agendador M:N. Criar um milhão delas é viável e as pessoas fazem isso.

```go
func main() {
    var wg sync.WaitGroup
    for i := 0; i < 100_000; i++ {
        wg.Add(1)
        go func(n int) {
            defer wg.Done()
            resp, err := http.Get(fmt.Sprintf("https://api.exemplo.com/item/%d", n))
            if err != nil {
                return
            }
            defer resp.Body.Close()
        }(i)
    }
    wg.Wait()
}
```

As virtual threads do Java 21 fazem essencialmente a mesma aposta. A JVM passou a montar o stack no heap e a desmontá-lo quando a thread bloqueia, então o mesmo código imperativo de sempre passa a escalar:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 100_000).forEach(n ->
        executor.submit(() -> {
            var req = HttpRequest.newBuilder()
                .uri(URI.create("https://api.exemplo.com/item/" + n))
                .build();
            return client.send(req, BodyHandlers.ofString());
        })
    );
}
```

O ponto importante: **nenhum dos dois exemplos usa callback ou `async/await`**. Você escreve código bloqueante e o runtime cuida de não desperdiçar a thread do sistema operacional durante a espera.

## Onde os dois divergem

A diferença que mais dói na prática é o que conta como "ponto de parada".

No Go, o agendador é preemptivo desde a versão 1.14. Um loop apertado sem chamada de função pode ser interrompido por sinal, e a goroutine cede o processador. Você raramente precisa pensar nisso.

No Java, a virtual thread é desmontada da thread carregadora em pontos de bloqueio que a JVM conhece — I/O de rede, `sleep`, boa parte do `java.util.concurrent`. Mas existem casos de *pinning*, em que ela fica presa à thread de plataforma e você perde o benefício. Os dois clássicos:

- código dentro de um bloco `synchronized` que bloqueia;
- chamadas nativas via JNI.

```java
// Isso prende a virtual thread na carrier thread durante o I/O.
synchronized (lock) {
    conexao.executarQueryLenta();
}

// Troque por um lock explícito, que o runtime sabe desmontar.
private final ReentrantLock lock = new ReentrantLock();

lock.lock();
try {
    conexao.executarQueryLenta();
} finally {
    lock.unlock();
}
```

Essa troca de `synchronized` por `ReentrantLock` é a mudança mais frequente ao migrar uma base Java antiga para virtual threads. Vale rodar com `-Djdk.tracePinnedThreads=full` para achar os pontos.

## Cancelamento: aqui o Go ainda ganha

Go padronizou o `context.Context` e o ecossistema inteiro o respeita. Cancelar uma árvore de chamadas é uma linha:

```go
ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
defer cancel()

resultado, err := repo.Buscar(ctx, id) // aborta sozinho no timeout
```

O Java respondeu com *structured concurrency* (`StructuredTaskScope`), que amarra o ciclo de vida das subtarefas ao escopo léxico e cancela as irmãs quando uma falha:

```java
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var usuario  = scope.fork(() -> buscarUsuario(id));
    var pedidos  = scope.fork(() -> buscarPedidos(id));

    scope.join().throwIfFailed();
    return new Painel(usuario.get(), pedidos.get());
}
```

Conceitualmente é mais limpo que passar `ctx` como primeiro parâmetro em todas as funções do código. Na prática, o ecossistema Go já está inteiro adaptado a esse modelo, e o do Java ainda está chegando lá.

## O que eu levo pro dia a dia

Virtual threads não deixam o código mais rápido — deixam o código **simples** ser rápido o suficiente. O ganho real é poder apagar a camada reativa que existia só para contornar a escassez de threads, e voltar a escrever um stack trace que dá para ler.

Se você mantém um serviço Java com pool saturado em I/O, virtual threads provavelmente são a melhor relação custo-benefício disponível hoje. Se está começando um serviço novo cuja natureza é orquestrar dezenas de chamadas concorrentes, o modelo do Go continua sendo o mais direto — não por ser mais rápido, mas porque a linguagem inteira foi desenhada em volta dele.
