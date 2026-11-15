import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline } from 'ionicons/icons';
import { DatabaseService } from '../../services/database.service';
import { Produto } from '../../models/tuna.models';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.page.html',
  styleUrls: ['./estoque.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class EstoquePage {
  ultimaAtualizacao = '';

  qtdEmAlta = 0;
  qtdEncalhados = 0;
  qtdParaRepor = 0;
  qtdSemTendencia = 0;

  graficoDonutStyle = '';

  recomendacoes: string[] = [];
  oportunidades: string[] = [];

  constructor(private db: DatabaseService) {
    addIcons({ cloudDownloadOutline });
  }

  async ionViewWillEnter() {
    this.db.status$.subscribe(status => {
      this.ultimaAtualizacao = status.ultimaAtualizacao;
    });

    this.db.produtos$.subscribe(produtos => {
      this.processarDadosEstoque(produtos);
    });

    await this.sincronizarDados(true);
  }

  private processarDadosEstoque(produtos: Produto[]) {
    this.qtdEmAlta = produtos.filter(p => p.situacao === 'em_alta').length;
    this.qtdEncalhados = produtos.filter(p => p.situacao === 'encalhado').length;
    this.qtdParaRepor = produtos.filter(p => p.quantidadeEstoque <= p.estoqueMinimo || p.situacao === 'repor').length;
    this.qtdSemTendencia = produtos.filter(p => p.situacao === 'sem_tendencia').length;

    
    const listaRec: string[] = [];
    produtos.forEach(p => {
      if (p.quantidadeEstoque <= p.estoqueMinimo || p.situacao === 'repor') {
        listaRec.push(`Repor ${p.nome}`);
      } else if (p.situacao === 'encalhado') {
        listaRec.push(`Revisar ${p.nome} (${p.diasSemVenda} dias em estoque)`);
      }
    });
    this.recomendacoes = listaRec;

    this.oportunidades = produtos
      .filter(p => p.situacao === 'em_alta')
      .map(p => p.nome);

const total = this.qtdEmAlta + this.qtdSemTendencia + this.qtdEncalhados;
    if (total > 0) {
      const pctAlta = (this.qtdEmAlta / total) * 100;
      const pctSemTend = pctAlta + ((this.qtdSemTendencia / total) * 100);

      this.graficoDonutStyle = `conic-gradient(
        #8B6EFF 0% ${pctAlta}%,
        #D4D4D8 ${pctAlta}% ${pctSemTend}%,
        #121117 ${pctSemTend}% 100%
      )`;
    } else {
      this.graficoDonutStyle = `conic-gradient(#E4E4E7 0% 100%)`;
    }
  }

  async sincronizarDados(silencioso = false) {
    const online = this.db.verificarInternet();

    if (!online && !silencioso) {
      alert('Sem conexão com a internet. Utilizando dados locais.');
      return;
    }

    const sucesso = await this.db.importarOuSincronizarEstoque();
    if (sucesso && !silencioso) {
      alert('Estoque sincronizado e importado com sucesso!');
    }
  }
}