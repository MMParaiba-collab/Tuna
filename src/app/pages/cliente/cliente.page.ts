import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, bulbOutline } from 'ionicons/icons';
import { DatabaseService } from '../../services/database.service';
import { Cliente } from '../../models/tuna.models';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class ClientePage implements OnInit {
  ultimaAtualizacao = 'Atualizado agora';
  
  qtdIniciantes = 0;
  qtdIntermediarios = 0;
  qtdProfissionais = 0;

  listaClientes: Cliente[] = [];

  constructor(private db: DatabaseService) {
    addIcons({ peopleOutline, bulbOutline });
  }

  ngOnInit() {
    this.carregarDadosClientes();
  }

  ionViewWillEnter() {
    this.carregarDadosClientes();
  }

  private carregarDadosClientes() {
    this.db.status$.subscribe(status => {
      this.ultimaAtualizacao = status.ultimaAtualizacao;
    });

    this.db.clientes$.subscribe(clientes => {
      if (clientes && clientes.length > 0) {
        this.listaClientes = clientes;
        this.calcularMetricasClientes(clientes);
      }
    });
  }

  private calcularMetricasClientes(clientes: Cliente[]): void {
    // Reinicia as contagens
    this.qtdIniciantes = clientes.filter(c => c.nivel === 'Iniciante').length;
    this.qtdIntermediarios = clientes.filter(c => c.nivel === 'Intermediário').length;
    this.qtdProfissionais = clientes.filter(c => c.nivel === 'Profissional').length;
  }
}