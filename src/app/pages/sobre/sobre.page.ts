import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon]
})
export class SobrePage {
  constructor() {
    addIcons({ informationCircleOutline });
  }
}
