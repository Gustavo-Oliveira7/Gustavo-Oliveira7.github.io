/**
 * ============================================================
 *  CONFIGURACAO CENTRAL DO SITE
 *  Este e o unico arquivo que voce precisa editar para mudar
 *  seus dados pessoais, links e o que aparece em destaque.
 * ============================================================
 */

export const site = {
  /** Nome que aparece no cabecalho e no <title> */
  nome: 'Gustavo Oliveira',
  /** Sub-titulo curto, aparece embaixo do nome no hero */
  cargo: 'Desenvolvedor Backend',
  /** Uma linha. Usada em meta tags e no compartilhamento em redes sociais. */
  descricao:
    'Desenvolvedor backend focado em Java e Go — APIs, sistemas distribuidos e codigo que aguenta producao.',
  /** Paragrafo do hero na home. Pode usar 2-3 frases. */
  bio: [
    'Construo o lado do servidor: APIs, integracoes e servicos que precisam ser corretos antes de serem rapidos.',
    'Meu foco e Java (Spring) e Go — duas linguagens que resolvem o mesmo problema por caminhos bem diferentes, e escrevo sobre isso aqui.',
  ],
  /** Localizacao exibida no rodape e na pagina Sobre. Deixe '' para ocultar. */
  local: 'Brasil',
  /** Idioma do documento HTML */
  lang: 'pt-BR',
} as const;

export const links = {
  github: 'https://github.com/Gustavo-Oliveira7',
  /** ATENCAO: confirme se esta e a URL real do seu perfil.
   *  Abra seu LinkedIn e copie a URL da barra de enderecos. */
  linkedin: 'https://www.linkedin.com/in/gustavo-oliveira7/',
  email: 'gustavo.h.oliveira7531@gmail.com',
} as const;

/** Usuario do GitHub usado para buscar os repositorios automaticamente. */
export const githubUser = 'Gustavo-Oliveira7';

/**
 * Repositorios em DESTAQUE, na ordem em que devem aparecer na home.
 * Use exatamente o nome do repo no GitHub.
 * Os dados (descricao, estrelas, linguagem) sao puxados da API — aqui
 * voce so escolhe QUAIS e pode sobrescrever o texto se quiser.
 */
export const projetosDestaque: Array<{
  repo: string;
  /** Sobrescreve a descricao do GitHub. Deixe de fora para usar a do repo. */
  descricao?: string;
  /** Badges extras de tecnologia mostrados no card. */
  tags?: string[];
}> = [
  {
    repo: 'chess-plataform',
    descricao: 'Plataforma de xadrez em Java: modelagem de dominio, regras do jogo e validacao de movimentos.',
    tags: ['Java', 'POO'],
  },
  {
    repo: 'guERP',
    descricao: 'ERP em Java — modulos de cadastro, estoque e persistencia relacional.',
    tags: ['Java', 'SQL'],
  },
  {
    repo: 'sudokuGame',
    descricao: 'Engine de Sudoku em Java com geracao de tabuleiro e solver por backtracking.',
    tags: ['Java', 'Algoritmos'],
  },
];

/**
 * Repositorios que NUNCA devem aparecer no site (rascunhos, testes, cursos).
 * A pagina /projetos ja esconde forks automaticamente.
 */
export const projetosOcultos: string[] = [
  'Gustavo-Oliveira7.github.io',
  'testandoClaude',
  'aprendendo-git',
  'trybe-exercicios',
  'dio-lab-open-source',
  'dioCI-T',
  'dioCIeT',
  'dioAWSChallenge',
  'qa-test-project-dio',
  'html-css',
  'newHTML-CSS',
  'myPortfolio',
];

/**
 * Stack exibida na home e na pagina Sobre.
 * `nivel` e livre — use o texto que fizer sentido para voce.
 */
export const stack: Array<{ grupo: string; itens: string[] }> = [
  { grupo: 'Linguagens', itens: ['Java', 'Go', 'TypeScript', 'Python', 'SQL'] },
  { grupo: 'Backend', itens: ['Spring Boot', 'JPA / Hibernate', 'REST', 'net/http', 'JUnit'] },
  { grupo: 'Dados', itens: ['PostgreSQL', 'MySQL', 'Redis'] },
  { grupo: 'Infra', itens: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'AWS'] },
];

/** Navegacao principal do site. */
export const navegacao = [
  { href: '/', rotulo: 'Inicio' },
  { href: '/projetos', rotulo: 'Projetos' },
  { href: '/artigos', rotulo: 'Artigos' },
  { href: '/sobre', rotulo: 'Sobre' },
] as const;
