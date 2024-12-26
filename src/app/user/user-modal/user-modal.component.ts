import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent {
  @Input() userData: any = null; // Données utilisateur pour modification
  @Input() isEdit: boolean = false; // Indique si on modifie ou ajoute
  @Output() save = new EventEmitter<any>(); // Émet l'utilisateur sauvegardé
  @Output() cancel = new EventEmitter<void>(); // Émet pour annuler

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: [''],
        city: [''],
      }),
      phone: [''],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.userData) {
      this.userForm.patchValue(this.userData);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.save.emit(this.userForm.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
