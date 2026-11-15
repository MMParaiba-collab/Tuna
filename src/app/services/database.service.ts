import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cliente, Produto, SincronizacaoStatus } from '../models/tuna.models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly STORAGE_KEYS = {
    PRODUTOS: 'tuna_produtos_v9',
    CLIENTES: 'tuna_clientes_v9',
    STATUS: 'tuna_sync_status_v9',
  };

  private produtosSubject = new BehaviorSubject<Produto[]>([]);
  public produtos$ = this.produtosSubject.asObservable();

  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  public clientes$ = this.clientesSubject.asObservable();

  private statusSubject = new BehaviorSubject<SincronizacaoStatus>({
    ultimaAtualizacao: 'Atualizado em 22/05, 14:30',
    modoOffline: true
  });
  public status$ = this.statusSubject.asObservable();

  constructor() {
    this.inicializarBanco();
  }

  private inicializarBanco(): void {
    const produtosSalvos = localStorage.getItem(this.STORAGE_KEYS.PRODUTOS);
    const clientesSalvos = localStorage.getItem(this.STORAGE_KEYS.CLIENTES);

    if (produtosSalvos && clientesSalvos) {
      this.produtosSubject.next(JSON.parse(produtosSalvos));
      this.clientesSubject.next(JSON.parse(clientesSalvos));
      this.atualizarTimestamp(); 
    } else {
      this.popularSeedInicial();
    }
  }

  private popularSeedInicial(): void {
    const produtosIniciais: Produto[] = [
      {
        id: 'prod-1',
        nome: 'Violão G. N1',
        categoria: 'Cordas',
        precoLoja: 1490,
        precoMercado: 1250,
        fonteMercado: 'Mercado Livre',
        quantidadeEstoque: 4,
        estoqueMinimo: 2,
        diasSemVenda: 12,
        vendasUltimos30Dias: 5,
        situacao: 'sem_tendencia'
      },
      {
        id: 'prod-2',
        nome: 'Pedal Boss D',
        categoria: 'Pedais',
        precoLoja: 570,
        precoMercado: 500,
        fonteMercado: 'Amazon',
        quantidadeEstoque: 6,
        estoqueMinimo: 2,
        diasSemVenda: 8,
        vendasUltimos30Dias: 9,
        situacao: 'encalhado'
      },
      {
        id: 'prod-3',
        nome: 'Cordas Sol',
        categoria: 'Acessórios',
        precoLoja: 112,
        precoMercado: 100,
        fonteMercado: 'Shopee',
        quantidadeEstoque: 18,
        estoqueMinimo: 10,
        diasSemVenda: 2,
        vendasUltimos30Dias: 24,
        situacao: 'encalhado'
      },
      {
        id: 'prod-4',
        nome: 'Teclado Mi2',
        categoria: 'Teclas',
        precoLoja: 2180,
        precoMercado: 2100,
        fonteMercado: 'Mercado Livre',
        quantidadeEstoque: 3,
        estoqueMinimo: 2,
        diasSemVenda: 25,
        vendasUltimos30Dias: 2,
        situacao: 'em_alta'
      },
      {
        id: 'prod-5',
        nome: 'Encordoamento Elixir p/ Guitarra 0.9',
        categoria: 'Acessórios',
        precoLoja: 135,
        precoMercado: 129,
        fonteMercado: 'Mercado Livre',
        quantidadeEstoque: 1,
        estoqueMinimo: 8,
        diasSemVenda: 1,
        vendasUltimos30Dias: 31,
        situacao: 'em_alta'
      },
      {
        id: 'prod-6',
        nome: 'Piano Yamaha',
        categoria: 'Teclas',
        precoLoja: 4890,
        precoMercado: 4500,
        fonteMercado: 'Mercado Livre',
        quantidadeEstoque: 2,
        estoqueMinimo: 1,
        diasSemVenda: 365,
        vendasUltimos30Dias: 0,
        situacao: 'em_alta'
      },
      {
        id: 'prod-7',
        nome: 'Pedal Distortion Boss GT-1',
        categoria: 'Pedais',
        precoLoja: 1650,
        precoMercado: 1590,
        fonteMercado: 'Mercado Livre',
        quantidadeEstoque: 5,
        estoqueMinimo: 2,
        diasSemVenda: 4,
        vendasUltimos30Dias: 14,
        situacao: 'em_alta'
      },
      {
        id: 'prod-8',
        nome: 'Bateria MasterDrums TCH-45P',
        categoria: 'Percussão',
        precoLoja: 3400,
        precoMercado: 3250,
        fonteMercado: 'Mercado Livre',
        quantidadeEstoque: 2,
        estoqueMinimo: 1,
        diasSemVenda: 6,
        vendasUltimos30Dias: 4,
        situacao: 'em_alta'
      }
    ];

    const clientesIniciais: Cliente[] = [
      {
        id: 'cli-1',
        nome: 'Mariana Souza',
        iniciais: 'MS',
        nivel: 'Intermediário',
        diasUltimaCompra: 12,
        totalGasto: 1850,
        ativo30Dias: true,
        sugestaoCompra: 'pedais de gama média'
      },
      {
        id: 'cli-2',
        nome: 'Carlos Almeida',
        iniciais: 'CA',
        nivel: 'Profissional',
        diasUltimaCompra: 5,
        totalGasto: 6400,
        ativo30Dias: true,
        sugestaoCompra: 'guitarras de linha premium'
      },
      {
        id: 'cli-3',
        nome: 'Ana Beatriz',
        iniciais: 'AB',
        nivel: 'Iniciante',
        diasUltimaCompra: 3,
        totalGasto: 620,
        ativo30Dias: true,
        sugestaoCompra: 'kit com afinador e capa'
      },
      {
        id: 'cli-4',
        nome: 'Jota',
        iniciais: 'J',
        nivel: 'Profissional',
        diasUltimaCompra: 7,
        totalGasto: 1200,
        ativo30Dias: true,
        sugestaoCompra: 'guitarras de linha premium'
      }
    ];

    this.salvarProdutos(produtosIniciais);
    this.salvarClientes(clientesIniciais);
    this.atualizarTimestamp();
  }

  public salvarProdutos(produtos: Produto[]): void {
    localStorage.setItem(this.STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
    this.produtosSubject.next(produtos);
  }

  public salvarClientes(clientes: Cliente[]): void {
    localStorage.setItem(this.STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
    this.clientesSubject.next(clientes);
  }

  // --- NOVOS MÉTODOS DE LEITURA DIRETA ---
  public obterProdutos(): Produto[] {
    const dados = localStorage.getItem(this.STORAGE_KEYS.PRODUTOS);
    return dados ? JSON.parse(dados) : [];
  }

  public obterClientes(): Cliente[] {
    const dados = localStorage.getItem(this.STORAGE_KEYS.CLIENTES);
    return dados ? JSON.parse(dados) : [];
  }
  // ----------------------------------------

  public atualizarTimestamp(): void {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const min = String(agora.getMinutes()).padStart(2, '0');

    const novoStatus: SincronizacaoStatus = {
      ultimaAtualizacao: `Atualizado em ${dia}/${mes}, ${hora}:${min}`,
      modoOffline: true
    };

    localStorage.setItem(this.STORAGE_KEYS.STATUS, JSON.stringify(novoStatus));
    this.statusSubject.next(novoStatus);
  }

  public resetarBanco(): void {
    localStorage.removeItem(this.STORAGE_KEYS.PRODUTOS);
    localStorage.removeItem(this.STORAGE_KEYS.CLIENTES);
    localStorage.removeItem(this.STORAGE_KEYS.STATUS);
    this.popularSeedInicial();
  }

  public verificarInternet(): boolean {
    return navigator.onLine;
  }

  public async importarOuSincronizarEstoque(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const temInternet = this.verificarInternet();

        if (temInternet) {        
          const statusAtual = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.STATUS) || '{}');
          const agora = new Date();
          const d = String(agora.getDate()).padStart(2, '0');
          const m = String(agora.getMonth() + 1).padStart(2, '0');
          const h = String(agora.getHours()).padStart(2, '0');
          const min = String(agora.getMinutes()).padStart(2, '0');

          statusAtual.ultimaAtualizacao = `Sincronizado em ${d}/${m}, ${h}:${min}`;
          statusAtual.modoOffline = false;
          
          localStorage.setItem(this.STORAGE_KEYS.STATUS, JSON.stringify(statusAtual));
          this.statusSubject.next(statusAtual);

          resolve(true); 
        } else {
          resolve(false); 
        }
      }, 800);
    });
  }
}