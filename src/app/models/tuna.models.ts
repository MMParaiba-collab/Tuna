export type SituacaoEstoque = 'em_alta' | 'sem_tendencia' | 'encalhado' | 'repor';
export type NivelCliente = 'Iniciante' | 'Intermediário' | 'Profissional';

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  precoLoja: number;
  precoMercado: number;
  fonteMercado: 'Mercado Livre' | 'Amazon' | 'Shopee';
  quantidadeEstoque: number;
  estoqueMinimo: number;
  diasSemVenda: number;
  vendasUltimos30Dias: number;
  situacao: SituacaoEstoque;
}

export interface Cliente {
  id: string;
  nome: string;
  iniciais: string;
  nivel: NivelCliente;
  diasUltimaCompra: number;
  totalGasto: number;
  ativo30Dias: boolean;
  sugestaoCompra: string;
}

export interface SincronizacaoStatus {
  ultimaAtualizacao: string;
  modoOffline: boolean;
}