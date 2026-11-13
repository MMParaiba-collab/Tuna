import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  notificationsOutline, 
  alertCircleOutline, 
  peopleOutline, 
  arrowForwardOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon]
})
export class HomePage {

  constructor(private router: Router) {
    addIcons({
      notificationsOutline,
      alertCircleOutline,
      peopleOutline,
      arrowForwardOutline
    });
  }

  irPara(rota: string) {
    this.router.navigateByUrl(`/tabs/${rota}`);
  }
}