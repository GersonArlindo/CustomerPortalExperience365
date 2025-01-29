import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../dashboard.service";
import { HistoryStagesService } from 'src/app/core/services/history-stages.service';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit  {
  param1: any;
  param2: any;
  constructor(
    private dashboard: DashboardService,
    private historyStagesSrv: HistoryStagesService
  ) {
   
  }
  ngOnInit(): void {
    this.imprimir()
  }
   
  imprimir(){
    // Esperar a que los parámetros estén cargados
    this.historyStagesSrv.parametros$.subscribe((parametros: any) => {
      this.param1 = parametros.param1;
      this.param2 = parametros.param2;

      if (this.param1 === undefined || this.param2 === undefined) {
        console.warn('Parámetros aún no están listos.');
      } else {
        // Aquí puedes trabajar con los parámetros una vez que estén cargados
        console.log('Parámetros listos:', this.param1, this.param2);
      }
    });
  }

  openSidebar(){
    this.dashboard.openSidebar()
    
  }
  

}
