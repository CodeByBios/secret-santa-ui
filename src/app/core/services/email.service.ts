
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/emails`;

  async send(drawId: string): Promise<{ count: number } | null> {
    const res = await this.http.post<{ count: number }>(`${this.base}/send`, { drawId }).toPromise();
    return res ?? null;
  }
}
