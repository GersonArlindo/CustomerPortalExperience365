import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HistoryStagesService } from 'src/app/core/services/history-stages.service';
import Swal from 'sweetalert2';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit{
  @Input() title: string;
  //@Input() optionValue: string;
  @ViewChild('fileInput') fileInput!: ElementRef;
  files: File[] = [];
  myProgressTracker: any
  appt_id: any
  tenant_id: any
  subTitle: string = 'Loading...';
  formRefer!: FormGroup
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  type: string = "Horizontally"
  updateYear: number = new Date().getFullYear();
  optionValue: string = 'Home';
  constructor(
    private historyStagesSrv: HistoryStagesService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    //this.optionValue = '';
    this.title = '';
    this.formRefer = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', Validators.pattern(this.emailPattern)],
      phone: ['', Validators.required],
      address: ['']
    })
  }

  ngOnInit(): void {
    this.appt_id = this.route.snapshot.paramMap.get('appt_id') || '';
    this.tenant_id = this.route.snapshot.paramMap.get('tenant_id') || '';
    this.loadProgressTracker();
    this.historyStagesSrv.optionValue$.subscribe(value => {
      this.optionValue = value;
    });
  }

  private loadProgressTracker(): void {
    this.historyStagesSrv.getHistoryStage(this.appt_id, this.tenant_id)
      .pipe(
        tap(data => this.filterCanceledStages(data)),  // Elimina los stages "Canceled"
        tap(data => this.myProgressTracker = data),    // Asigna los datos
        finalize(() => this.updateSubTitle())          // Actualiza el título
      )
      .subscribe();
      console.log("Llamado al servicio")
  }

  private filterCanceledStages(data: any): void {
    if (data?.tbl_history_stages) {
      data.tbl_history_stages = data.tbl_history_stages.filter(
        (stage: any) => stage.tbl_stage?.stage_name !== 'Canceled'
      );
    }
  }

  private updateSubTitle(): void {
    if (this.myProgressTracker?.contact) {
      const { firstName, lastName } = this.myProgressTracker.contact;
      this.subTitle = `Welcome ${firstName} ${lastName}`;
      // Setear parámetros después de actualizar el título
      const param1 = this.appt_id;
      const param2 = this.tenant_id;
      const param3 = `${firstName} ${lastName}`;

      this.historyStagesSrv.setParametros({ param1, param2, param3 });
    } else {
      this.subTitle = 'No data available';
    }
  }

  // Manejador de eventos para el dragover
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Evitar que el navegador abra el archivo
    const element = event.currentTarget as HTMLElement;
    element.classList.add('dragging'); // Agregar clase para estilizar
  }

  // Manejador de eventos para el dragleave
  onDragLeave(event: DragEvent): void {
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('dragging'); // Remover clase
  }

  // Manejador de eventos para el drop
  onDrop(event: DragEvent): void {
    event.preventDefault(); // Evitar el comportamiento por defecto
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('dragging'); // Remover clase

    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      this.files.push(...droppedFiles);

      // Puedes procesar los archivos aquí o enviarlos al input para reutilizar su lógica
      droppedFiles.forEach((file) => {
        console.log(`Dropped file: ${file.name}`);
      });
    }
  }

  // Manejador de eventos para el input de archivos
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFiles = Array.from(input.files);
      this.files.push(...selectedFiles);

      selectedFiles.forEach((file) => {
        console.log(`Selected file: ${file.name}`);
      });
    }
  }

  // Función para cancelar los archivos con animación
  cancelUploadedFiles(): void {  
    const removeFileAtIndex = (index: number) => {
      if (index < this.files.length) {
        this.files.splice(index, 1);
        setTimeout(() => removeFileAtIndex(index), 100);
      } else {
        console.log('Todos los archivos han sido eliminados.');
      }
    };
    removeFileAtIndex(0);
  }

  // getMyProgressTracker(appt_id: any, tenant_id: any){
  //   //const storageKey = `progressTracker_${appt_id}`;
  //   //const storedData = localStorage.getItem(storageKey);
  //   // if (storedData) {
  //   //   this.myProgressTracker = JSON.parse(storedData);
  //   //   this.updateSubTitle();
  //   // } else {
  //   this.historyStagesSrv.getHistoryStage(appt_id, tenant_id).subscribe((data: any) => {
  //     if (data) {
  //       data.tbl_history_stages = data.tbl_history_stages.filter(
  //         (stage: any) => stage.tbl_stage?.stage_name !== 'Canceled'
  //       );
  //     }
      
  //     this.myProgressTracker = data;
  //     // localStorage.setItem(storageKey, JSON.stringify(data));
  //     this.updateSubTitle();
  //   });
  //  // }
  //   const param1 = this.route.snapshot.paramMap.get('appt_id') || '';
  //   const param2 = this.route.snapshot.paramMap.get('tenant_id') || '';
  //   const param3 = this.myProgressTracker?.contact?.firstName + ' ' + this.myProgressTracker?.contact?.lastName
    
  //   this.historyStagesSrv.setParametros({ param1, param2, param3 });
  // }

  // updateSubTitle() {
  //   if (this.myProgressTracker?.contact) {
  //     this.subTitle = `Welcome ${this.myProgressTracker.contact.firstName} ${this.myProgressTracker.contact.lastName}`;
  //   } else {
  //     this.subTitle = 'Loading...';
  //   }
  // }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return '-';
    }
    const dateParts = dateString.split('/'); // Divide la fecha por "/"
    if (dateParts.length !== 3) {
      return '-'; // Si no tiene 3 partes, no es válida
    }
    // Ajusta el orden de las partes según el formato d/m/YYYY
    const [day, month, year] = dateParts.map(part => parseInt(part, 10));
    // Verifica si los valores son válidos
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return '-';
    }
    // Crea un objeto de fecha
    const date = new Date(year, month - 1, day);
    // Verifica si la fecha es válida
    if (isNaN(date.getTime())) {
      return '-';
    }
    // Opciones para formatear la fecha
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    // Retorna la fecha formateada
    return date.toLocaleDateString('en-US', options);
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  }

  saveNewRefer() {
    if (this.formRefer.invalid) {
      this.formRefer.markAllAsTouched(); // Marca todos los campos como tocados
      return; // Evita que se procese el formulario si no es válido
    }

    const data: any = {
      email: this.formRefer.value.email,
      phone: this.formRefer.value.phone,
      firstName: this.formRefer.value.firstName,
      lastName: this.formRefer.value.lastName,
      name: this.formRefer.value.firstName + ' ' + this.formRefer.value.lastName,
      address1: this.formRefer.value.address,
      tags: [
        "Referred by " +
          this.myProgressTracker?.contact?.firstName +
          ' ' +
          this.myProgressTracker?.contact?.lastName
      ],
      source: "public api"
    };

    const url = 'https://rest.gohighlevel.com/v1/contacts/';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6InM2Z0Z4QlREZE1aSU92TzE0MVQ4IiwiY29tcGFueV9pZCI6IjEwcmxDYlhncGhXOGp5Q0hEckNJIiwidmVyc2lvbiI6MSwiaWF0IjoxNjg0MzUzNDI1MzY1LCJzdWIiOiJic2xMYVlxOUdKdXVITnVDZnhDbiJ9.HWYzxBypdZ4hOKCd_hobPf2v0nzZDG69DkJl94_pWuI` // Reemplaza <token> con tu token real
    });

    this.http.post(url, data, { headers }).subscribe({
      next: (response) => {
        console.log('Contact successfully created:', response);
        this.formRefer.reset()
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
      },
      error: (error) => {
        console.error('Error creating contact:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    });
  }

  isValidField(fieldName: string): boolean {
    const field = this.formRefer.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

}
