
import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type Participant = {
  id: string;
  fullName: string;
  email: string;
  giftIdea: string;
  coupleId?: string | null;
};

@Injectable({ providedIn: 'root' })
export class ParticipantsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/participants`;

  readonly participants = signal<Participant[]>([]);
  readonly couples = computed(() => {
    const map = new Map<string, Participant[]>();
    for (const p of this.participants()) {
      if (p.coupleId) {
        const arr = map.get(p.coupleId) ?? [];
        arr.push(p);
        map.set(p.coupleId, arr);
      }
    }
    return map;
  });

  async load(): Promise<void> {
    const data = await this.http.get<Participant[]>(this.base).toPromise();
    this.participants.set(data ?? []);
  }

  async addSingle(input: Pick<Participant, 'fullName' | 'email' | 'giftIdea'>): Promise<void> {
    const created = await this.http.post<Participant>(`${this.base}/single`, input).toPromise();
    if (created) this.participants.update(list => [ ...list, created ]);
  }

  async addCouple(a: Pick<Participant, 'fullName' | 'email' | 'giftIdea'>,
                  b: Pick<Participant, 'fullName' | 'email' | 'giftIdea'>): Promise<void> {
    const created = await this.http.post<Participant[]>(`${this.base}/couple`, { a, b }).toPromise();
    if (created) this.participants.update(list => [ ...list, ...created ]);
  }

  async updateSingle(id: string, input: Pick<Participant, 'fullName' | 'email' | 'giftIdea'>): Promise<void> {
    const updated = await this.http.put<Participant>(`${this.base}/${id}`, input).toPromise();
    if (updated) this.participants.update(list => list.map(p => p.id === id ? updated : p));
  }

  async remove(id: string): Promise<void> {
    await this.http.delete(`${this.base}/${id}`).toPromise();
    this.participants.update(list => list.filter(p => p.id !== id));
  }
}
