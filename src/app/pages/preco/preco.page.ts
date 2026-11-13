import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pricetagOutline } from 'ionicons/icons';

@Component({
  selector: 'app-preco',
  templateUrl: './preco.page.html',
  styleUrls: ['./preco.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon]
})
export class PrecoPage {
  constructor() {
    addIcons({ pricetagOutline });
  }
}