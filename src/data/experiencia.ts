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
  // Enquanto esta lista estiver vazia, a secao "Experiencia" nao aparece
  // no site — melhor do que publicar texto de exemplo. Descomente o bloco
  // abaixo, troque pelos seus dados reais e faca push.
  //
  // {
  //   cargo: 'Desenvolvedor Backend',
  //   empresa: 'Nome da empresa',
  //   de: '01/2024',
  //   ate: 'atual',
  //   local: 'Remoto',
  //   pontos: [
  //     'Uma entrega concreta e o impacto dela.',
  //     'Ex.: reduzi o p99 do endpoint de busca de 800ms para 120ms revisando queries e indices.',
  //   ],
  //   stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
  // },
];

export type Formacao = {
  curso: string;
  instituicao: string;
  de: string;
  ate: string;
};

export const formacoes: Formacao[] = [
  // Mesma logica: vazio = a secao nao aparece.
  //
  // {
  //   curso: 'Analise e Desenvolvimento de Sistemas',
  //   instituicao: 'Nome da instituicao',
  //   de: '01/2022',
  //   ate: 'atual',
  // },
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
