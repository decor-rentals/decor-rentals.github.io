import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  socialLinks = [
    {
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://www.facebook.com/profile.php?id=61579613446283',
      color: '#1877F2'
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com/decor_rentals_ireland/',
      color: '#E4405F'
    },
    {
      name: 'Email',
      icon: 'email',
      url: 'mailto:decor.rentalsireland@gmail.com',
      color: '#EA4335'
    },
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      url: 'https://wa.me/353899737746',
      color: '#25D366'
    }
  ];
}
