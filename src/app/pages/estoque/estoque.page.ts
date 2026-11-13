import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cubeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.page.html',
  styleUrls: ['./estoque.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon]
})
export class EstoquePage {
  constructor() {
    addIcons({ cubeOutline });
  }
}