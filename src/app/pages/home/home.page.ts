import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  notificationsOutline, 
  alertCircleOutline, 
  peopleOutline, 
  arrowForwardOutline 
} from 'ionicons/icons';
import { DatabaseService } from '../../services/database.service';
import { Cliente, Produto } from '../../models/tuna.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class HomePage implements OnInit {
  dataAtual = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).toUpperCase();
  saudacao = 'Boa tarde!';
  ultimaAtualizacao = (() => {
    const agora = new Date();
    const d = String(agora.getDate()).padStart(2, '0');
    const m = String(agora.getMonth() + 1).padStart(2, '0');
    const h = String(agora.getHours()).padStart(2, '0');
    const min = String(agora.getMinutes()).padStart(2, '0');
    return `Atualizado em ${d}/${m}, ${h}:${min}`;
  })();

  qtdEncalhados = 0;
  qtdEmAlta = 0;
  qtdParaRepor = 0;

  qtdForaDaMargem = 0;
  diferencaMediaMercado = 0;

  totalClientes = 0;
  nivelPredominante = 'Intermediário';

  constructor(
    private router: Router,
    private db: DatabaseService
  ) {
    addIcons({
      notificationsOutline,
      alertCircleOutline,
      peopleOutline,
      arrowForwardOutline
    });
  }

  ngOnInit() {
    this.definirCabecalhoTemporal();
    this.carregarDadosIniciais();
  }

  ionViewWillEnter() {
    this.definirCabecalhoTemporal();
    this.carregarDadosIniciais();

    const produtosAtuais = this.db.obterProdutos();
    if (produtosAtuais && produtosAtuais.length > 0) {
      this.calcularMetricasProdutos(produtosAtuais);
    }
  }

  private carregarDadosIniciais() {
    this.db.status$.subscribe(status => {
      this.ultimaAtualizacao = status.ultimaAtualizacao;
    });

    this.db.produtos$.subscribe(produtos => {
      if (produtos && produtos.length > 0) {
        this.calcularMetricasProdutos(produtos);
      }
    });

    this.db.clientes$.subscribe(clientes => {
      if (clientes && clientes.length > 0) {
        this.calcularMetricasClientes(clientes);
      }
    });
  }

  private definirCabecalhoTemporal(): void {
    const agora = new Date();
    const hora = agora.getHours();

    if (hora < 12) this.saudacao = 'Bom dia!';
    else if (hora < 18) this.saudacao = 'Boa tarde!';
    else this.saudacao = 'Boa noite!';

    const opcoes: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long' };
    this.dataAtual = agora.toLocaleDateString('pt-BR', opcoes).toUpperCase();
  }

  private calcularMetricasProdutos(produtos: Produto[]): void {
    this.qtdEncalhados = produtos.filter(p => p.situacao === 'encalhado').length;
    this.qtdEmAlta = produtos.filter(p => p.situacao === 'em_alta').length;
    this.qtdParaRepor = produtos.filter(p => p.quantidadeEstoque <= p.estoqueMinimo || p.situacao === 'repor').length;

    const produtosFora = produtos.filter(p => {
      const diff = ((p.precoLoja - p.precoMercado) / p.precoMercado) * 100;
      return Math.abs(diff) > 10; 
    });

    this.qtdForaDaMargem = produtosFora.length;

    if (produtos.length > 0) {
      const somaDiferencas = produtos.reduce((acc, p) => {
        return acc + ((p.precoLoja - p.precoMercado) / p.precoMercado) * 100;
      }, 0);
      this.diferencaMediaMercado = Math.round(somaDiferencas / produtos.length);
    }
  }

  private calcularMetricasClientes(clientes: Cliente[]): void {
    this.totalClientes = clientes.length;
    if (clientes.length === 0) return;

    const contagem: Record<string, number> = {};
    clientes.forEach(c => {
      contagem[c.nivel] = (contagem[c.nivel] || 0) + 1;
    });

    this.nivelPredominante = Object.keys(contagem).reduce((a, b) => 
      contagem[a] > contagem[b] ? a : b
    );
  }

  irPara(rota: string) {
    this.router.navigateByUrl(`/tabs/${rota}`);
  }
}