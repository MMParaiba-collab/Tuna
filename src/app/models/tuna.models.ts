export interface Produto {
  id?: number;
  codigo: string;
  nome: string;
  categoria: string;
  marca?: string;
  preco: number;
  quantidade: number;
  data_atualizacao: string;
}

export interface Tendencia {
  id?: number;
  categoria: string;
  marca?: string;
  indice_popularidade: number;
  fonte: string;
  data_coleta: string;
}

export interface PrecoConcorrente {
  id?: number;
  produto_id: number;
  concorrente: string;
  preco: number;
  fonte: string;
  data_coleta: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  telefone?: string;
  email?: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Profissional';
  data_atualizacao: string;
}

export interface Venda {
  id?: number;
  cliente_id: number;
  data_venda: string;
  total: number;
}

export interface ItemVenda {
  id?: number;
  venda_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}

export interface SyncLog {
  id?: number;
  tipo: string;
  data_sync: string;
  status: string;
  registros: number;
}