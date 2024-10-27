import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule,ContactFormComponent],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
  contacts: Contact[] = [];
  selectedContact?: Contact;

  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe((data) => {
      this.contacts = data;
    });
  }

  // openCreateContact(): void {
  //   this.router.navigate(['/create']);
  // }

  // openEditContact(contact: Contact): void {
  //   this.router.navigate(['/edit', contact.id]);
  // }

  deleteContact(id: number): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe(() => this.loadContacts());
    }
  }


  // Open form to create a new contact
  openCreateContact(): void {
    this.selectedContact = { id: 0, firstName: '', lastName: '', email: '' }; // Empty contact object
  }

  // Open form to edit an existing contact
  editContact(contact: Contact): void {
    this.selectedContact = { ...contact }; // Clone to prevent direct mutations
  }

  // Handle saving a new or edited contact
  onSave(contact: any): void {
    if (contact.id === 0) {
      // Create a new contact
      this.contactService.createContact(contact).subscribe(() => {
        this.loadContacts(); // Refresh list after adding
        this.selectedContact = undefined; // Close the form
      });
    } else {
      // Update an existing contact
      this.contactService.updateContact(contact.id, contact).subscribe(() => {
        this.loadContacts(); // Refresh list after updating
        this.selectedContact = undefined; // Close the form
      });
    }
  }

  // Close the form without saving
  onCancel(): void {
    this.selectedContact = undefined;
  }
}
