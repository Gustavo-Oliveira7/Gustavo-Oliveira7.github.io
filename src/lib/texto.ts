/** Estimativa de tempo de leitura, a 200 palavras por minuto. */
export function tempoLeitura(texto: string): number {
  const palavras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palavras / 200));
}

/** Cores oficiais das linguagens no GitHub (as que aparecem nos seus repos). */
export const corLinguagem: Record<string, string> = {
  Java: '#b07219',
  Go: '#00ADD8',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  SQL: '#e38c00',
  Rust: '#dea584',
  Kotlin: '#A97BFF',
};

export function pegarCorLinguagem(nome: string | null): string {
  if (!nome) return 'var(--texto-fraco)';
  return corLinguagem[nome] ?? 'var(--texto-fraco)';
}

/** '2026-08-10' -> '10 de agosto de 2026' */
export function dataLonga(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** '2026-08-10' -> '10 ago 2026' */
export function dataCurta(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
