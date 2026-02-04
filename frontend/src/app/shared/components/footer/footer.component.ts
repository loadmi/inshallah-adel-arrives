/**
 * Footer component with fixed positioning at bottom of viewport
 * Contains copyright, optional tagline, and quick links
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AboutModalComponent } from '../about-modal/about-modal.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, AboutModalComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  /** Current tagline being displayed */
  tagline = '';

  /** Whether to show the about modal */
  showAboutModal = false;

  /** List of possible taglines */
  private taglines = [
    'Powered by data. Undermined by Adel.',
    'Arrival times subject to Adel.',
    'Trusted by everyone except Adel.',
    'No Adels were harmed during data collection',
    'Model accuracy drops sharply when Adel promises anything.',
    'Neural networks fear this man.',
    'Inshallah, he arrives.',
    'Protected against unauthorized Adel activity.',
    'Past performance is not indicative of future arrival.',
    'Yes, this is necessary.'
  ];

  /** Quick links for the footer */
  quickLinks = [
    { label: 'GitHub', url: 'https://github.com/loadmi/inshallah-adel-arrives', ariaLabel: 'Visit GitHub repository' },
    { label: 'About', url: '#', ariaLabel: 'About this application' }
  ];

  private lastIndex = -1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateTagline();

    // Update tagline on every successful navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTagline();
    });
  }

  /**
   * Sets a random tagline from the available list, avoiding immediate repeats
   */
  private updateTagline(): void {
    if (this.taglines.length === 0) return;
    
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.taglines.length);
    } while (randomIndex === this.lastIndex && this.taglines.length > 1);
    
    this.lastIndex = randomIndex;
    this.tagline = this.taglines[randomIndex];
  }

  /**
   * Toggles the visibility of the about modal
   */
  toggleAboutModal(show: boolean): void {
    this.showAboutModal = show;
  }
}
