---
titulo: "if err != nil e a cultura de tratar erro como valor"
resumo: "A verbosidade do tratamento de erros em Go é a crítica mais comum à linguagem. Depois de escrever bastante Java e bastante Go, minha conclusão é que o problema nunca foi o if — foi o que a exception deixa você não decidir."
data: 2026-07-22
tags: ["Go", "Java", "Design"]
---

Todo mundo que sai do Java para o Go passa pela mesma fase: escreve três funções, conta quantas vezes digitou `if err != nil` e conclui que a linguagem é primitiva. Eu passei por isso. Mudei de ideia por um motivo específico, e não foi estético.

## O que uma exception esconde

Em Java, a assinatura abaixo não te diz nada sobre falha:

```java
public Pedido buscarPedido(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new PedidoNaoEncontradoException(id));
}
```

Quem chama `buscarPedido` não é obrigado a saber que ela pode explodir. A `RuntimeException` sobe pela pilha até alguém pegar — às vezes um `@ControllerAdvice` três camadas acima, às vezes ninguém. Isso é ótimo para o caminho feliz e péssimo quando você precisa auditar todos os pontos de falha de um fluxo.

Checked exceptions foram a tentativa de resolver isso, e falharam socialmente: a reação do ecossistema foi embrulhar tudo em `RuntimeException` para calar o compilador.

```java
try {
    return objectMapper.readValue(json, Pedido.class);
} catch (JsonProcessingException e) {
    throw new RuntimeException(e); // o famoso "depois eu arrumo"
}
```

Em Go, o mesmo contrato é explícito na assinatura, e o compilador não deixa você ignorar o valor:

```go
func (r *Repo) BuscarPedido(ctx context.Context, id int64) (*Pedido, error) {
    var p Pedido
    err := r.db.QueryRowContext(ctx, queryBuscarPedido, id).Scan(&p.ID, &p.Total)
    if errors.Is(err, sql.ErrNoRows) {
        return nil, fmt.Errorf("pedido %d: %w", id, ErrNaoEncontrado)
    }
    if err != nil {
        return nil, fmt.Errorf("buscar pedido %d: %w", id, err)
    }
    return &p, nil
}
```

O `%w` é a parte que importa. Ele embrulha o erro preservando a cadeia, então lá em cima alguém pode perguntar pela causa sem depender do texto da mensagem:

```go
if errors.Is(err, ErrNaoEncontrado) {
    w.WriteHeader(http.StatusNotFound)
    return
}
```

E para erros com dados dentro, `errors.As` recupera o tipo concreto:

```go
type ErroValidacao struct {
    Campo  string
    Motivo string
}

func (e *ErroValidacao) Error() string {
    return fmt.Sprintf("campo %s invalido: %s", e.Campo, e.Motivo)
}

var ve *ErroValidacao
if errors.As(err, &ve) {
    responderJSON(w, 422, map[string]string{"campo": ve.Campo})
}
```

## A verbosidade é real — e é o preço certo

Não vou fingir que é bonito. Uma função que faz quatro chamadas tem quatro blocos de três linhas. A defesa honesta é: **cada um desses blocos é uma decisão que você foi obrigado a tomar**. Em Java, quatro chamadas que lançam exception produzem zero decisões no ponto de uso, e a decisão aparece — se aparecer — num handler genérico distante do contexto.

O erro que eu via com frequência em código Go de quem vem do Java é tratar `if err != nil` como cerimônia e repassar sem contexto:

```go
// ruim: o erro chega no log como "sql: no rows in result set" e ninguem sabe de onde veio
if err != nil {
    return err
}

// bom: cada camada acrescenta uma pista, e o log final conta a historia inteira
if err != nil {
    return fmt.Errorf("processar pagamento do pedido %d: %w", pedido.ID, err)
}
```

O segundo formato produz mensagens como `processar pagamento do pedido 4711: cobrar cartao: timeout apos 3s`. Isso é um stack trace legível, construído à mão, com exatamente a informação de domínio que importa.

## O equivalente disso em Java

Nada impede modelar erro como valor em Java. Um `Result<T, E>` selado com pattern matching chega perto:

```java
public sealed interface Resultado<T> {
    record Ok<T>(T valor) implements Resultado<T> {}
    record Falha<T>(String contexto, Throwable causa) implements Resultado<T> {}
}

var r = servico.buscarPedido(id);
return switch (r) {
    case Resultado.Ok<Pedido> ok    -> ResponseEntity.ok(ok.valor());
    case Resultado.Falha<Pedido> f  -> ResponseEntity.status(404).body(f.contexto());
};
```

Funciona, e o `switch` exaustivo dá a mesma garantia do compilador. O problema é cultural: bibliotecas Java lançam exceptions, então na fronteira você vira tradutor e acaba com os dois modelos convivendo. Adotar isso vale a pena em um núcleo de domínio bem delimitado, não na base inteira.

## Resumo

`if err != nil` não é falta de recurso da linguagem. É a recusa deliberada em deixar o caminho de falha invisível. Depois de manter serviços nos dois modelos, o que me convenceu foi ler um incidente de produção: no serviço Go, a mensagem de erro já continha a cadeia de decisões que levou até a falha. No serviço Java, ela continha um `NullPointerException` e cinquenta frames de framework.
