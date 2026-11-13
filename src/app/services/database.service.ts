import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private dbName: string = 'tuna_db';

  constructor() {}

  async inicializarBanco(): Promise<void> {
    const platform = Capacitor.getPlatform();

    // Modo de armazenamento em memória/indexedDB do plugin no navegador (web)
    if (platform === 'web') {
      await this.sqlite.initWebStore();
    }

    // Cria ou abre a conexão com o banco SQLite
    this.db = await this.sqlite.createConnection(
      this.dbName,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();
    await this.criarTabelas();
  }

  private async criarTabelas(): Promise<void> {
    const schema = `
      CREATE TABLE IF NOT EXISTS produto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT NOT NULL UNIQUE,
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
        nivel TEXT CHECK(nivel IN ('Iniciante', 'Intermediário', 'Profissional')) NOT NULL,
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
    console.log('Banco SQLite e as 7 tabelas inicializados com sucesso!');
  }
}