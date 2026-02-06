/**
 * Header navigation component with fixed navbar and hamburger menu for mobile
 */

import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  /** Tracks whether the mobile menu is open */
  isMenuOpen = false;

  /** Navigation items for the menu */
  navItems = [
    { path: '/predict', label: 'Predictions', icon: '🔮' },
    { path: '/planner', label: 'Planner', icon: '📅' },
    { path: '/record', label: 'Record Entry', icon: '📝' },
    { path: '/history', label: 'History', icon: '📋' },
    { path: '/statistics', label: 'Statistics', icon: '📊' },
    { path: '/adel', label: 'I am Adel', icon: '👑' }
  ];

  /**
   * Toggles the mobile menu open/closed state
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevent body scroll when menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Closes the mobile menu (used when a nav link is clicked)
   */
  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  /**
   * Handles clicks outside the menu to close it
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const navbar = target.closest('.navbar');
    const mobileMenu = target.closest('.mobile-menu');
    
    // Close menu if click is outside navbar and mobile menu
    if (!navbar && !mobileMenu && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Handles escape key to close the menu
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }
}
