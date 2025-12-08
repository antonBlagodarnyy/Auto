import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IClient } from '../../../Interfaces/IClient';

type ClientFormModel = Omit<IClient, 'phone'> & {
  phone: string;
};

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
    padding: 2vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  mat-form-field{
  padding:2vh;
  }
  `,
})
export class ClientFormComponent {
  constructor(private snackBar: MatSnackBar) {}
  //Dependency injections
  private dialogRef = inject(MatDialogRef<ClientFormComponent>, {
    optional: true,
  });
  readonly oldClient = inject<IClient>(MAT_DIALOG_DATA, {
    optional: true,
  });
  readonly parsedOldClient: ClientFormModel | null = this.oldClient
    ? {
        ...this.oldClient,
        phone: String(this.oldClient.phone),
      }
    : null;

  //Outputs
  createdEvent = output<{ name: string; phone: number; email: string }>();

  //Should be edited or created
  editMode: boolean = !!this.dialogRef;

  //Form validatos
  clientForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.pattern('^[6-9]\\d{8}$'),
      Validators.required,
    ]),
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  ngOnInit() {
    if (this.editMode && this.parsedOldClient) {
      // Initialize form with dialog data
      this.clientForm.patchValue(this.parsedOldClient);
    }
  }

  onSubmit() {
    if (this.clientForm.valid) {
      if (!this.editMode) {
        const { name, phone, email } = this.clientForm.value;
        if (name && phone && email) {
          this.createdEvent.emit({
            name: name,
            phone: +phone,
            email: email,
          });
        }
      } else {
        if (this.parsedOldClient) {

          const newValues = this.clientForm.value;

          if (
            this.parsedOldClient.email != newValues.email ||
            this.parsedOldClient.name != newValues.name ||
            this.parsedOldClient.phone != newValues.phone
          ) {
            const changedValues = [];
            if (newValues.name && this.parsedOldClient.name != newValues.name)
              changedValues.push({ key: 'name', value: newValues.name });
            if (
              newValues.email &&
              this.parsedOldClient.email != newValues.email
            )
              changedValues.push({ key: 'email', value: newValues.email });
            if (
              newValues.phone &&
              this.parsedOldClient.phone != newValues.phone
            )
              changedValues.push({ key: 'phone', value: newValues.phone });

            this.dialogRef?.close({
              clientId: this.parsedOldClient.id,
              changedValues,
            });
          } else
            this.snackBar.open('Form was not changed.', '', {
              duration: 1000,
            });
        }
      }
    }
  }
}
