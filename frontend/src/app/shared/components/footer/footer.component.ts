/**
 * Footer component with fixed positioning at bottom of viewport
 * Contains copyright, optional tagline, and quick links
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  /** Current year for copyright */
  currentYear = new Date().getFullYear();

  /** App version or tagline */
  tagline = 'Predicting arrivals with precision';

  /** Quick links for the footer */
  quickLinks = [
    { label: 'GitHub', url: 'https://github.com', ariaLabel: 'Visit GitHub repository' },
    { label: 'About', url: '#', ariaLabel: 'About this application' }
  ];
}
