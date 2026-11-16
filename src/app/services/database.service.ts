import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cliente, Produto, SincronizacaoStatus } from '../models/tuna.models';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection | null = null;
  private db: SQLiteDBConnection | null = null;
  private dbName: string = 'tuna_db';
  private isNative: boolean = false;

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

  private async inicializarBanco(): Promise<void> {
    try {
      const platform = Capacitor.getPlatform();
      this.isNative = platform === 'android' || platform === 'ios';

      if (this.isNative) {
        // --- AMBIENTE NATIVO (ANDROID/APK): Usa SQLite Real do Capacitor ---
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
        const dbConn = await this.sqlite.createConnection(
          this.dbName,
          false,
          'no-encryption',
          1,
          false
        );
        this.db = dbConn;
        await this.db.open();

        await this.criarTabelasSQLite();
        await this.verificarOuPopularSeedSQLite();
        await this.carregarDadosDoSQLite();
      } else {
        // --- AMBIENTE WEB (ionic serve): Usa localStorage para agilidade e testes visuais ---
        this.inicializarSeedWeb();
      }

      this.atualizarTimestamp();
    } catch (error) {
      console.error('Erro ao inicializar banco, recorrendo ao fallback web:', error);
      this.inicializarSeedWeb();
    }
  }

  // ==========================================
  // MÉTODOS PARA AMBIENTE NATIVO (SQLite)
  // ==========================================
  private async criarTabelasSQLite(): Promise<void> {
    if (!this.db) return;
    const schema = `
      CREATE TABLE IF NOT EXISTS produto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        categoria TEXT NOT NULL,
        marca TEXT,
        preco REAL NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 0,
        data_atualizacao TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS tendencia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria TEXT NOT NULL,
        marca TEXT,
        indice_popularidade REAL NOT NULL,
        fonte TEXT NOT NULL,
        data_coleta TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS preco_concorrente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        concorrente TEXT NOT NULL,
        preco REAL NOT NULL,
        fonte TEXT NOT NULL,
        data_coleta TEXT NOT NULL,
        FOREIGN KEY (produto_id) REFERENCES produto(id)
      );
      CREATE TABLE IF NOT EXISTS cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT UNIQUE,
        email TEXT,
        nivel TEXT,
        data_atualizacao TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS venda (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        data_venda TEXT NOT NULL,
        total REAL NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES cliente(id)
      );
      CREATE TABLE IF NOT EXISTS item_venda (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        preco_unitario REAL NOT NULL,
        FOREIGN KEY (venda_id) REFERENCES venda(id),
        FOREIGN KEY (produto_id) REFERENCES produto(id)
      );
      CREATE TABLE IF NOT EXISTS sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        data_sync TEXT NOT NULL,
        status TEXT NOT NULL,
        registros INTEGER NOT NULL DEFAULT 0
      );
    `;
    await this.db.execute(schema);
  }

  private async verificarOuPopularSeedSQLite(): Promise<void> {
    if (!this.db) return;
    const resProd = await this.db.query('SELECT COUNT(*) as total FROM produto;');
    const totalProd = resProd.values?.[0]?.['total'] ?? 0;
    if (totalProd === 0) {
      await this.popularSeedSQLite();
    }
  }

  private async popularSeedSQLite(): Promise<void> {
    if (!this.db) return;
    const insertProduto = `INSERT INTO produto (codigo, nome, categoria, marca, preco, quantidade, data_atualizacao) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    const produtosIniciais = [
      ['prod-1', 'Violão G. N1', 'Cordas', 'Yamaha', 1490, 4, '2026-11-15'],
      ['prod-2', 'Pedal Boss D', 'Pedais', 'Boss', 570, 6, '2026-11-15'],
      ['prod-3', 'Cordas Sol', 'Acessórios', 'D\'Addario', 112, 18, '2026-11-15'],
      ['prod-4', 'Teclado Mi2', 'Teclas', 'Casio', 2180, 3, '2026-11-15'],
      ['prod-5', 'Encordoamento Elixir p/ Guitarra 0.9', 'Acessórios', 'Elixir', 135, 1, '2026-11-15'],
      ['prod-6', 'Piano Yamaha', 'Teclas', 'Yamaha', 4890, 2, '2026-11-15'],
      ['prod-7', 'Pedal Distortion Boss GT-1', 'Pedais', 'Boss', 1650, 5, '2026-11-15'],
      ['prod-8', 'Bateria MasterDrums TCH-45P', 'Percussão', 'MasterDrums', 3400, 2, '2026-11-15']
    ];
    for (const p of produtosIniciais) {
      await this.db.run(insertProduto, p);
    }

    const insertCliente = `INSERT INTO cliente (nome, telefone, email, nivel, data_atualizacao) VALUES (?, ?, ?, ?, ?);`;
    const clientesIniciais = [
      ['Mariana Souza', '(54) 99887-1122', 'mariana@email.com', 'Intermediário', '2026-11-15'],
      ['Carlos Almeida', '(54) 99112-3344', 'carlos@email.com', 'Profissional', '2026-11-15'],
      ['Ana Beatriz', '(54) 98877-5566', 'ana@email.com', 'Iniciante', '2026-11-15'],
      ['Jota', '(54) 98111-2233', 'jota@email.com', 'Profissional', '2026-11-15']
    ];
    for (const c of clientesIniciais) {
      await this.db.run(insertCliente, c);
    }
  }

  private async carregarDadosDoSQLite(): Promise<void> {
    if (!this.db) return;
    const resProd = await this.db.query('SELECT * FROM produto;');
    const produtosMapeados: Produto[] = (resProd.values || []).map((row: any) => ({
      id: String(row.id),
      nome: row.nome,
      categoria: row.categoria,
      precoLoja: row.preco,
      precoMercado: row.preco * 0.9,
      fonteMercado: 'Mercado Livre',
      quantidadeEstoque: row.quantidade,
      estoqueMinimo: 2,
      diasSemVenda: 10,
      vendasUltimos30Dias: 5,
      situacao: row.quantidade <= 2 ? 'em_alta' : 'sem_tendencia'
    }));

    const resCli = await this.db.query('SELECT * FROM cliente;');
    const clientesMapeados: Cliente[] = (resCli.values || []).map((row: any) => ({
      id: String(row.id),
      nome: row.nome,
      iniciais: row.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      nivel: row.nivel || 'Iniciante',
      diasUltimaCompra: 7,
      totalGasto: 1500,
      ativo30Dias: true,
      sugestaoCompra: row.nivel === 'Profissional' ? 'guitarras de linha premium' : 'pedais de gama média'
    }));

    this.produtosSubject.next(produtosMapeados);
    this.clientesSubject.next(clientesMapeados);
  }

  // ==========================================
  // MÉTODOS PARA AMBIENTE WEB (localStorage)
  // ==========================================
  private inicializarSeedWeb(): void {
    const produtosSalvos = localStorage.getItem(this.STORAGE_KEYS.PRODUTOS);
    const clientesSalvos = localStorage.getItem(this.STORAGE_KEYS.CLIENTES);

    if (produtosSalvos && clientesSalvos) {
      this.produtosSubject.next(JSON.parse(produtosSalvos));
      this.clientesSubject.next(JSON.parse(clientesSalvos));
    } else {
      const produtosIniciais: Produto[] = [
        { id: 'prod-1', nome: 'Violão G. N1', categoria: 'Cordas', precoLoja: 1490, precoMercado: 1250, fonteMercado: 'Mercado Livre', quantidadeEstoque: 4, estoqueMinimo: 2, diasSemVenda: 12, vendasUltimos30Dias: 5, situacao: 'sem_tendencia' },
        { id: 'prod-2', nome: 'Pedal Boss D', categoria: 'Pedais', precoLoja: 570, precoMercado: 500, fonteMercado: 'Amazon', quantidadeEstoque: 6, estoqueMinimo: 2, diasSemVenda: 8, vendasUltimos30Dias: 9, situacao: 'encalhado' },
        { id: 'prod-3', nome: 'Cordas Sol', categoria: 'Acessórios', precoLoja: 112, precoMercado: 100, fonteMercado: 'Shopee', quantidadeEstoque: 18, estoqueMinimo: 10, diasSemVenda: 2, vendasUltimos30Dias: 24, situacao: 'encalhado' },
        { id: 'prod-4', nome: 'Teclado Mi2', categoria: 'Teclas', precoLoja: 2180, precoMercado: 2100, fonteMercado: 'Mercado Livre', quantidadeEstoque: 3, estoqueMinimo: 2, diasSemVenda: 25, vendasUltimos30Dias: 2, situacao: 'em_alta' },
        { id: 'prod-5', nome: 'Encordoamento Elixir p/ Guitarra 0.9', categoria: 'Acessórios', precoLoja: 135, precoMercado: 129, fonteMercado: 'Mercado Livre', quantidadeEstoque: 1, estoqueMinimo: 8, diasSemVenda: 1, vendasUltimos30Dias: 31, situacao: 'em_alta' },
        { id: 'prod-6', nome: 'Piano Yamaha', categoria: 'Teclas', precoLoja: 4890, precoMercado: 4500, fonteMercado: 'Mercado Livre', quantidadeEstoque: 2, estoqueMinimo: 1, diasSemVenda: 365, vendasUltimos30Dias: 0, situacao: 'em_alta' },
        { id: 'prod-7', nome: 'Pedal Distortion Boss GT-1', categoria: 'Pedais', precoLoja: 1650, precoMercado: 1590, fonteMercado: 'Mercado Livre', quantidadeEstoque: 5, estoqueMinimo: 2, diasSemVenda: 4, vendasUltimos30Dias: 14, situacao: 'em_alta' },
        { id: 'prod-8', nome: 'Bateria MasterDrums TCH-45P', categoria: 'Percussão', precoLoja: 3400, precoMercado: 3250, fonteMercado: 'Mercado Livre', quantidadeEstoque: 2, estoqueMinimo: 1, diasSemVenda: 6, vendasUltimos30Dias: 4, situacao: 'em_alta' }
      ];

      const clientesIniciais: Cliente[] = [
        { id: 'cli-1', nome: 'Mariana Souza', iniciais: 'MS', nivel: 'Intermediário', diasUltimaCompra: 12, totalGasto: 1850, ativo30Dias: true, sugestaoCompra: 'pedais de gama média' },
        { id: 'cli-2', nome: 'Carlos Almeida', iniciais: 'CA', nivel: 'Profissional', diasUltimaCompra: 5, totalGasto: 6400, ativo30Dias: true, sugestaoCompra: 'guitarras de linha premium' },
        { id: 'cli-3', nome: 'Ana Beatriz', iniciais: 'AB', nivel: 'Iniciante', diasUltimaCompra: 3, totalGasto: 620, ativo30Dias: true, sugestaoCompra: 'kit com afinador e capa' },
        { id: 'cli-4', nome: 'Jota', iniciais: 'J', nivel: 'Profissional', diasUltimaCompra: 7, totalGasto: 1200, ativo30Dias: true, sugestaoCompra: 'guitarras de linha premium' }
      ];

      this.salvarProdutos(produtosIniciais);
      this.salvarClientes(clientesIniciais);
    }
  }

  public salvarProdutos(produtos: Produto[]): void {
    if (!this.isNative) {
      localStorage.setItem(this.STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
    }
    this.produtosSubject.next(produtos);
  }

  public salvarClientes(clientes: Cliente[]): void {
    if (!this.isNative) {
      localStorage.setItem(this.STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
    }
    this.clientesSubject.next(clientes);
  }

  public obterProdutos(): Produto[] {
    return this.produtosSubject.value;
  }

  public obterClientes(): Cliente[] {
    return this.clientesSubject.value;
  }

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

    if (!this.isNative) {
      localStorage.setItem(this.STORAGE_KEYS.STATUS, JSON.stringify(novoStatus));
    }
    this.statusSubject.next(novoStatus);
  }

  public async resetarBanco(): Promise<void> {
    if (this.isNative && this.db) {
      await this.db.execute(`
        DELETE FROM item_venda;
        DELETE FROM venda;
        DELETE FROM preco_concorrente;
        DELETE FROM tendencia;
        DELETE FROM sync_log;
        DELETE FROM cliente;
        DELETE FROM produto;
      `);
      await this.popularSeedSQLite();
      await this.carregarDadosDoSQLite();
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.PRODUTOS);
      localStorage.removeItem(this.STORAGE_KEYS.CLIENTES);
      localStorage.removeItem(this.STORAGE_KEYS.STATUS);
      this.inicializarSeedWeb();
    }
  }

  public verificarInternet(): boolean {
    return navigator.onLine;
  }

  public async importarOuSincronizarEstoque(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const temInternet = this.verificarInternet();

        if (temInternet) {
          const agora = new Date();
          const d = String(agora.getDate()).padStart(2, '0');
          const m = String(agora.getMonth() + 1).padStart(2, '0');
          const h = String(agora.getHours()).padStart(2, '0');
          const min = String(agora.getMinutes()).padStart(2, '0');

          const statusAtual: SincronizacaoStatus = {
            ultimaAtualizacao: `Sincronizado em ${d}/${m}, ${h}:${min}`,
            modoOffline: false
          };

          if (this.isNative && this.db) {
            await this.db.run(
              `INSERT INTO sync_log (tipo, data_sync, status, registros) VALUES (?, ?, ?, ?);`,
              ['ESTOQUE', `${d}/${m}/${agora.getFullYear()} ${h}:${min}`, 'SUCESSO', 8]
            );
          }

          this.statusSubject.next(statusAtual);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  }
}