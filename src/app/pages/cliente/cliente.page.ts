import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, bulbOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon]
})
export class ClientePage {
  constructor() {
    addIcons({ peopleOutline, bulbOutline });
  }
}