import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon]
})
export class SplashPage {

  constructor(private router: Router) {
    addIcons({ arrowForwardOutline });
  }

  entrarNoNegocio() {
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }
}