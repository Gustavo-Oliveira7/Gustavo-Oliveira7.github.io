import { githubUser, projetosOcultos } from '../site.config';

/**
 * Camada de integracao com a API do GitHub.
 *
 * Roda em tempo de BUILD (o site gerado ja sai com os dados dentro do HTML,
 * entao carrega rapido e o Google indexa). O workflow do GitHub Actions
 * reconstroi o site de tempos em tempos, o que mantem tudo atualizado
 * sem voce fazer nada. A pagina /projetos ainda faz um refresh no
 * navegador para pegar mudancas que aconteceram desde o ultimo build.
 *
 * Se a API falhar (rate limit, rede fora), o build NAO quebra: as funcoes
 * devolvem dados vazios e a pagina mostra um estado de fallback.
 */

export type Repo = {
  nome: string;
  descricao: string | null;
  url: string;
  homepage: string | null;
  linguagem: string | null;
  estrelas: number;
  forks: number;
  topicos: string[];
  atualizadoEm: string;
  arquivado: boolean;
};

export type Perfil = {
  nome: string | null;
  login: string;
  avatar: string;
  bio: string | null;
  reposPublicos: number;
  seguidores: number;
  perfilUrl: string;
};

const API = 'https://api.github.com';

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': `${githubUser}-portfolio`,
  };
  // Em CI o Actions injeta GITHUB_TOKEN: sobe o limite de 60 para 5000 req/h.
  // Localmente ele nao existe e a API responde no limite anonimo, o que basta.
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function pegar<T>(caminho: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(`${API}${caminho}`, { headers: headers() });
    if (!r.ok) {
      console.warn(`[github] ${caminho} respondeu ${r.status} — usando fallback`);
      return fallback;
    }
    return (await r.json()) as T;
  } catch (e) {
    console.warn(`[github] falha de rede em ${caminho} — usando fallback`, e);
    return fallback;
  }
}

/** Perfil publico do usuario. */
export async function buscarPerfil(): Promise<Perfil | null> {
  const d = await pegar<any>(`/users/${githubUser}`, null);
  if (!d) return null;
  return {
    nome: d.name,
    login: d.login,
    avatar: d.avatar_url,
    bio: d.bio,
    reposPublicos: d.public_repos,
    seguidores: d.followers,
    perfilUrl: d.html_url,
  };
}

/**
 * Repositorios publicos, ja filtrados e ordenados pela ultima atualizacao.
 * Remove forks, arquivados e os listados em `projetosOcultos`.
 */
export async function buscarRepositorios(): Promise<Repo[]> {
  const dados = await pegar<any[]>(
    `/users/${githubUser}/repos?per_page=100&sort=updated&type=owner`,
    [],
  );

  const ocultos = new Set(projetosOcultos.map((n) => n.toLowerCase()));

  return dados
    .filter((r) => !r.fork && !r.archived && !r.private)
    .filter((r) => !ocultos.has(String(r.name).toLowerCase()))
    .map(
      (r): Repo => ({
        nome: r.name,
        descricao: r.description,
        url: r.html_url,
        homepage: r.homepage || null,
        linguagem: r.language,
        estrelas: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        topicos: r.topics ?? [],
        atualizadoEm: r.pushed_at ?? r.updated_at,
        arquivado: r.archived ?? false,
      }),
    )
    .sort((a, b) => +new Date(b.atualizadoEm) - +new Date(a.atualizadoEm));
}

/** Quantos repositorios por linguagem — alimenta o filtro da pagina /projetos. */
export function contarLinguagens(repos: Repo[]): Array<{ nome: string; total: number }> {
  const mapa = new Map<string, number>();
  for (const r of repos) {
    if (!r.linguagem) continue;
    mapa.set(r.linguagem, (mapa.get(r.linguagem) ?? 0) + 1);
  }
  return [...mapa.entries()]
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total);
}

/** '2026-08-20T10:00:00Z' -> '20 ago 2026' */
export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
