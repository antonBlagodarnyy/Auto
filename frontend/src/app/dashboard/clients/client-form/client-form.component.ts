import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsService } from '../clients.service';
import { Client } from '../client.model';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css',
})
export class ClientFormComponent {
  constructor(private clientService: ClientsService) {}
  client = input<Client | undefined>();
  clientId: number | undefined = undefined;

  mode = input<'edit' | 'create'>();
  createdOrUpdated = output();

  clientForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.pattern('')), //TODO meter regex telefono
    email: new FormControl('', Validators.email),
  });

  onSubmit() {
    if (this.mode() == 'create') {
      if (
        this.clientForm.valid &&
        this.clientForm.value.name != undefined &&
        this.clientForm.value.phone != undefined &&
        this.clientForm.value.email != undefined
      ) {
        this.clientService
          .createClient(
            this.clientForm.value.name,
            +this.clientForm.value.phone,
            this.clientForm.value.email,

          )
          ?.subscribe((client) => {
            //TODO may be better to emit the product and update only one product
            this.createdOrUpdated.emit();
          });
      }
    } else if (this.mode() == 'edit') {
      this.clientId = this.client()?.id;


      let name = this.clientForm.value.name
        ? this.clientForm.value.name
        : this.client()?.name;

      let phone = this.clientForm.value.phone
        ? +this.clientForm.value.phone
        : this.client()?.phone;

      let email = this.clientForm.value.email
        ? this.clientForm.value.email
        : this.client()?.email;


      if (name && phone && email &&  this.clientId) {
        this.clientService
          .updateClient(this.clientId, name, phone, email)
          ?.subscribe(() => this.createdOrUpdated.emit());
      }
    }
  }
}
