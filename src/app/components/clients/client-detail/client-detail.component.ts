import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css'],
  imports: [DatePipe, CommonModule, RouterModule]
})
export class ClientDetailComponent implements OnInit {
  client: any;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');

    // Convertir el id a un número
    const id = clientId ? +clientId : NaN;  // Usamos el operador `+` para convertir a número

    if (!isNaN(id)) {
      this.clientService.getClientById(id).subscribe(

        (data) => {
          // Convierte la fecha del formato "YYYY/MM/DD" a Date
          this.client = {
            ...data,
            fechaNacimiento: data.fechaNacimiento
              ? new Date(data.fechaNacimiento.replace(/\//g, '-'))
              : null

          };
        },
        (error) => {
          console.error('Error fetching client data:', error);
          this.router.navigate(['/clientes']);
        }
      );
    } else {
      console.error('ID de cliente inválido');
      this.router.navigate(['/clientes']);
    }
  }
}
