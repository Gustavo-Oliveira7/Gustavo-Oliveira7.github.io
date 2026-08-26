/**
 * ============================================================
 *  EXPERIENCIA E FORMACAO  ("espelho" do LinkedIn)
 *
 *  IMPORTANTE: o LinkedIn NAO oferece API publica para ler o seu
 *  proprio perfil, e fazer scraping viola os termos de uso deles
 *  (a conta pode ser bloqueada). Por isso estes dados sao mantidos
 *  aqui, a mao. Quando atualizar o LinkedIn, atualize este arquivo
 *  e faca commit — o site publica sozinho.
 *
 *  Datas: use o formato 'MM/AAAA'. Use `ate: 'atual'` para o
 *  cargo/curso em andamento.
 * ============================================================
 */

export type Experiencia = {
  cargo: string;
  empresa: string;
  de: string;
  ate: string;
  local?: string;
  /** Bullets do que voce fez. Foque em resultado, nao em tarefa. */
  pontos: string[];
  /** Tecnologias usadas, viram badges no card. */
  stack?: string[];
};

export const experiencias: Experiencia[] = [
  // ---- EDITE A PARTIR DAQUI -------------------------------
  // Este e um exemplo com a estrutura pronta. Substitua pelos
  // seus cargos reais (copie do seu LinkedIn) ou apague o bloco
  // se ainda nao quiser mostrar experiencia profissional.
  {
    cargo: 'Desenvolvedor Backend',
    empresa: 'Nome da empresa',
    de: '01/2024',
    ate: 'atual',
    local: 'Remoto',
    pontos: [
      'Descreva aqui uma entrega concreta e o impacto dela.',
      'Ex.: reduzi o tempo de resposta do endpoint X de 800ms para 120ms com cache e revisao de queries.',
    ],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
  },
  // ---------------------------------------------------------
];

export type Formacao = {
  curso: string;
  instituicao: string;
  de: string;
  ate: string;
};

export const formacoes: Formacao[] = [
  {
    curso: 'Nome do curso / graduacao',
    instituicao: 'Instituicao',
    de: '01/2022',
    ate: 'atual',
  },
];

export type Certificacao = {
  nome: string;
  emissor: string;
  ano: string;
  url?: string;
};

export const certificacoes: Certificacao[] = [
  // { nome: 'AWS Cloud Practitioner', emissor: 'AWS', ano: '2025', url: 'https://...' },
];
