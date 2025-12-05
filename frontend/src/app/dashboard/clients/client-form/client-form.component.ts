import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../../services/clients.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface DialogData {
  id: number;
  edit: boolean;
  name: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-client-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './client-form.component.html',
  styles: `form {
    display: flex;
    justify-content: space-around;
  }
  `,
})
export class ClientFormComponent {
  constructor(private clientService: ClientService) {}
  private dialogRef = inject(MatDialogRef, { optional: true });
  data = inject<DialogData>(MAT_DIALOG_DATA, { optional: true });

  isDialog = !!this.dialogRef;

  createdOrUpdated = output();

  clientForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.pattern('')), //TODO meter regex telefono
    email: new FormControl('', Validators.email),
  });

  ngOnInit() {
    if (this.isDialog && this.data) {
      // Initialize form with dialog data
      this.clientForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.clientForm.valid) {
      if (!this.data) {
        if (
          this.clientForm.value.name != undefined &&
          this.clientForm.value.phone != undefined &&
          this.clientForm.value.email != undefined
        ) {
          this.clientService
            .createClient(
              this.clientForm.value.name,
              +this.clientForm.value.phone,
              this.clientForm.value.email
            )
            ?.subscribe((client) => {
              //TODO may be better to emit the product and update only one product
              this.createdOrUpdated.emit();
            });
        }
      } else {
        let clientId = this.data?.id;

        let name = this.clientForm.value.name
          ? this.clientForm.value.name
          : this.data?.name;

        let phone = this.clientForm.value.phone
          ? +this.clientForm.value.phone
          : +this.data?.phone;

        let email = this.clientForm.value.email
          ? this.clientForm.value.email
          : this.data?.email;

        if (name && phone && email && clientId) {
          this.clientService
            .updateClient(clientId, name, phone, email)
            ?.subscribe(() => this.dialogRef?.close());
        }
      }
    }
  }
}
