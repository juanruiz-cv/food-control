import { Component } from '@angular/core';
import { FormGoogleService } from './services/formGoogle.service';
import { DomSanitizer } from '@angular/platform-browser';

type Items = {
  id: string;
  date: Date;
  type: string;
  whatDidIEat: string;
  img: any;
  description: string;
};

function convertToDate(dateString: string): Date {
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2].substring(0, 4), 10);
  const time = parts[2].substring(5).split(':');
  const hour = parseInt(time[0], 10);
  const minutes = parseInt(time[1], 10);
  const seconds = parseInt(time[2], 10);

  return new Date(year, month, day, hour, minutes, seconds);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  tablaString: string = '';
  items: Items[] = [];

  constructor(
    private _formGoogleService: FormGoogleService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.getItems();
    console.log(this.items);
  }

  getItems() {
    this._formGoogleService.getItems().subscribe({
      next: (response) => {
        console.log('NEXT', response);
      },
      error: (error) => {
        this.tablaString = error.error.text
          .split('<tbody>')[1]
          .split('</tbody>')[0];

        const regexFilas = /<tr[^>]*>.*?<\/tr>/gs;
        const regexCeldas = /<t[hd][^>]*>(.*?)<\/t[hd]>/gs;

        const filas = this.tablaString.match(regexFilas);

        if (!filas) return;

        for (let i = 2; i < filas.length; i++) {
          const fila = filas[i];

          const celdas = fila.match(regexCeldas);

          if (!celdas) return;
          let keyimg: string = celdas[4]
            .replace(/<\/?[^>]+(>|$)/g, '')
            .replace('https://drive.google.com/open?id=', '');
          console.log(celdas[1].replace(/<\/?[^>]+(>|$)/g, ''));

          this.items.push({
            id: celdas[0].replace(/<\/?[^>]+(>|$)/g, ''),
            type: celdas[2].replace(/<\/?[^>]+(>|$)/g, ''),
            date: convertToDate(celdas[1].replace(/<\/?[^>]+(>|$)/g, '')),
            whatDidIEat: celdas[3].replace(/<\/?[^>]+(>|$)/g, ''),
            img: this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://drive.google.com/file/d/${keyimg}/preview`
            ),

            description: celdas[5].replace(/<\/?[^>]+(>|$)/g, ''),
          });
        }
        console.log(this.items);
      },
    });
  }
}
