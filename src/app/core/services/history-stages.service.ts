import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HandlerErrorService } from './handler-error.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryStagesService {
  private parametrosSubject = new BehaviorSubject<{ [key: string]: any }>({});
  parametros$ = this.parametrosSubject.asObservable();

  private optionValueSource = new BehaviorSubject<string>('Home'); 
  optionValue$ = this.optionValueSource.asObservable();
  constructor(
    private http:HttpClient,
    private router:Router,
    private HandlerErrorSrv: HandlerErrorService
  ) { }

  getHistoryStage(appt_id: any, tenant_id: any): Observable<any[]>{
    return this.http.get<any>(`${environment.API_URL}assign_appointment/get_customer_portal_experience_date/${appt_id}/${tenant_id}`)
    .pipe(
      map(
        response => response.assignAppointment
      ),
      catchError((err: any) => this.HandlerErrorSrv.handlerError(err))
    )
  }

  setParametros(parametros: { [key: string]: any }) {
    this.parametrosSubject.next(parametros);
  }

  getParametros() {
    return this.parametrosSubject.getValue();
  }

  setOptionValue(value: string) {
    this.optionValueSource.next(value);
  }
}
