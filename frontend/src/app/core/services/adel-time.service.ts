/**
 * Main API service for Adel Time operations
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TimeEntry,
  CreateTimeEntryRequest
} from '../models/time-entry.model';
import {
  PredictionRequest,
  PredictionResponse,
  BatchPredictionRequest,
  BatchPredictionResponse
} from '../models/prediction.model';
import { Statistics } from '../models/statistics.model';

@Injectable({
  providedIn: 'root'
})
export class AdelTimeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Entries
  createEntry(request: CreateTimeEntryRequest): Observable<TimeEntry> {
    return this.http.post<ApiResponse<TimeEntry>>(
      `${this.apiUrl}/entries`,
      request
    ).pipe(map(res => this.parseEntry(res.data)));
  }

  getAllEntries(): Observable<TimeEntry[]> {
    return this.http.get<ApiResponse<TimeEntry[]>>(
      `${this.apiUrl}/entries`
    ).pipe(map(res => res.data.map(e => this.parseEntry(e))));
  }

  deleteEntry(id: number, password: string): Observable<void> {
    const headers = new HttpHeaders().set('x-delete-password', password);
    return this.http.delete<void>(`${this.apiUrl}/entries/${id}`, { headers });
  }

  // Predictions
  getPrediction(worldTime: Date): Observable<PredictionResponse> {
    const request: PredictionRequest = {
      worldTime: worldTime.toISOString()
    };

    return this.http.post<ApiResponse<PredictionResponse>>(
      `${this.apiUrl}/predictions/predict`,
      request
    ).pipe(map(res => this.parsePrediction(res.data)));
  }

  getBatchPredictions(worldTimes: Date[]): Observable<PredictionResponse[]> {
    const request: BatchPredictionRequest = {
      worldTimes: worldTimes.map(t => t.toISOString())
    };

    return this.http.post<ApiResponse<BatchPredictionResponse>>(
      `${this.apiUrl}/predictions/predict-batch`,
      request
    ).pipe(map(res => res.data.predictions.map(p => this.parsePrediction(p))));
  }

  // Statistics
  getStatistics(): Observable<Statistics> {
    return this.http.get<ApiResponse<Statistics>>(
      `${this.apiUrl}/statistics/summary`
    ).pipe(map(res => res.data));
  }

  private parseEntry(entry: any): TimeEntry {
    return {
      ...entry,
      worldTime: new Date(entry.worldTime),
      adelTime: new Date(entry.adelTime),
      createdAt: new Date(entry.createdAt)
    };
  }

  private parsePrediction(pred: any): PredictionResponse {
    return {
      ...pred,
      worldTime: new Date(pred.worldTime),
      predictedAdelTime: new Date(pred.predictedAdelTime)
    };
  }
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
