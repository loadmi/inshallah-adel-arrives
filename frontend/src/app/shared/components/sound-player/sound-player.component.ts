/**
 * Floating sound player component with progress bar
 * Positioned bottom-left, toggleable on/off with play/pause and seek
 */

import {
  Component,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sound-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sound-player.component.html',
  styleUrls: ['./sound-player.component.scss']
})
export class SoundPlayerComponent implements AfterViewInit, OnDestroy {

  /** Whether the player is expanded (on) or collapsed (off) */
  isOn = false;

  /** Whether audio is currently playing */
  isPlaying = false;

  /** Current playback time in seconds */
  currentTime = 0;

  /** Total duration of the audio in seconds */
  duration = 0;

  /** Progress percentage (0-100) */
  progressPercent = 0;

  private audio!: HTMLAudioElement;
  private timeUpdateBound = this.onTimeUpdate.bind(this);
  private loadedMetadataBound = this.onLoadedMetadata.bind(this);
  private endedBound = this.onEnded.bind(this);

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.audio = new Audio('assets/adels_song.mp3');
    this.audio.preload = 'metadata';
    this.audio.addEventListener('timeupdate', this.timeUpdateBound);
    this.audio.addEventListener('loadedmetadata', this.loadedMetadataBound);
    this.audio.addEventListener('ended', this.endedBound);
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('timeupdate', this.timeUpdateBound);
      this.audio.removeEventListener('loadedmetadata', this.loadedMetadataBound);
      this.audio.removeEventListener('ended', this.endedBound);
    }
  }

  /** Toggle the player on/off */
  togglePlayer(): void {
    this.isOn = !this.isOn;

    if (this.isOn) {
      this.play();
    } else {
      this.stop();
    }
  }

  /** Toggle play/pause */
  togglePlayPause(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /** Seek to a position based on click on the progress bar */
  onProgressClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * this.duration;
    this.audio.currentTime = newTime;
    this.currentTime = newTime;
    this.progressPercent = percent * 100;
    this.cdr.detectChanges();
  }

  /** Format seconds to mm:ss */
  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private play(): void {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.cdr.detectChanges();
    }).catch(err => {
      console.warn('Audio playback failed:', err);
    });
  }

  private pause(): void {
    this.audio.pause();
    this.isPlaying = false;
    this.cdr.detectChanges();
  }

  private stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.currentTime = 0;
    this.progressPercent = 0;
    this.cdr.detectChanges();
  }

  private onTimeUpdate(): void {
    this.currentTime = this.audio.currentTime;
    this.duration = this.audio.duration || 0;
    this.progressPercent = this.duration > 0
      ? (this.currentTime / this.duration) * 100
      : 0;
    this.cdr.detectChanges();
  }

  private onLoadedMetadata(): void {
    this.duration = this.audio.duration;
    this.cdr.detectChanges();
  }

  private onEnded(): void {
    this.isPlaying = false;
    this.currentTime = 0;
    this.progressPercent = 0;
    this.audio.currentTime = 0;
    this.cdr.detectChanges();
  }
}
