
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type AssignmentView = {
  id: string;
  drawId: string;
  giver: { id: string; fullName: string; email: string; giftIdea: string; coupleId?: string | null };
  recipient: { id: string; fullName: string; email: string; giftIdea: string; coupleId?: string | null };
};

@Injectable({ providedIn: 'root' })
export class DrawService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/draws`;

  readonly lastDrawId = signal<string | null>(null);
  readonly assignments = signal<AssignmentView[]>([]);

  async create(): Promise<void> {
    const res = await this.http.post<{ draw: { id: string }, assignments: unknown }>(this.base, {}).toPromise();
    const drawId = (res?.draw?.id ?? null);
    this.lastDrawId.set(drawId);
    if (drawId) await this.load(drawId);
  }

  async load(drawId: string): Promise<void> {
    const data = await this.http.get<AssignmentView[]>(`${this.base}/${drawId}`).toPromise();
    this.assignments.set(data ?? []);
  }
}
