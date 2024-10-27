import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  @Input() contact!: Contact; // Receives contact for editing or creating
  @Output() save = new EventEmitter<Contact>(); // Emits the saved contact
  @Output() cancel = new EventEmitter<void>(); // Emits a cancel event

  contactForm!: FormGroup;
  emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: [this.contact.firstName, Validators.required],
      lastName: [this.contact.lastName, Validators.required],
      email: [this.contact.email, [Validators.required, Validators.email,Validators.pattern(this.emailRegEx)]],
    });
  }

  onSave(): void {
    if (this.contactForm.valid) {
      const updatedContact: Contact = { ...this.contact, ...this.contactForm.value };
      this.save.emit(updatedContact); // Emit the saved contact
    }
  }

  onCancel(): void {
    this.cancel.emit(); // Emit a cancel event to close the form
  }
}
