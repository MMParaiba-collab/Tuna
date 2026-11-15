import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pricetagOutline } from 'ionicons/icons';
import { DatabaseService } from '../../services/database.service';
import { Produto } from '../../models/tuna.models';

@Component({
  selector: 'app-preco',
  templateUrl: './preco.page.html',
  styleUrls: ['./preco.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class PrecoPage implements OnInit {
  MathAbs = Math.abs;
  MathMin = Math.min;
  produtos: Produto[] = [];
  
  totalForaMargem = 0;
  totalDentroMargem = 0;
  diferencaMedia = 0;

  readonly MARGEM_TOLERADA = 10;

  constructor(private db: DatabaseService) {
    addIcons({ pricetagOutline });
  }

  ngOnInit() {
    this.carregarDadosPrecos();
  }

  ionViewWillEnter() {
    this.carregarDadosPrecos();
  }

  carregarDadosPrecos() {
    this.produtos = this.db.obterProdutos();
    this.calcularMetricas();
  }

  calcularMetricas() {
    if (!this.produtos || this.produtos.length === 0) return;

    let fora = 0;
    let dentro = 0;
    let somaDiferencas = 0;

    this.produtos.forEach(p => {
      const diff = this.calcularDiferencaPercentual(p.precoLoja, p.precoMercado);
      
      if (Math.abs(diff) > this.MARGEM_TOLERADA) {
        fora++;
      } else {
        dentro++;
      }

      somaDiferencas += diff;
    });

    this.totalForaMargem = fora;
    this.totalDentroMargem = dentro;
    this.diferencaMedia = Math.round(somaDiferencas / this.produtos.length);
  }

  calcularDiferencaPercentual(precoLoja: number, precoMercado: number): number {
    if (!precoMercado || precoMercado === 0) return 0;
    return Math.round(((precoLoja - precoMercado) / precoMercado) * 100);
  }

  get produtosForaDaMargem(): Produto[] {
    return this.produtos.filter(p => 
      Math.abs(this.calcularDiferencaPercentual(p.precoLoja, p.precoMercado)) > this.MARGEM_TOLERADA
    );
  }
}