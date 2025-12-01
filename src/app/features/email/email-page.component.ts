
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { DrawService } from '../../core/services/draw.service';
import { EmailService } from '../../core/services/email.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-page',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="email-title">
      <h1 id="email-title">Envoyer les Secret Santa</h1>
      @if (drawId()) {
        <p>Dernier tirage: <code>{{drawId()}}</code></p>
        <button type="button" class="btn primary" (click)="send()">Envoyer les emails</button>
      } @else {
        <p>Aucun tirage trouvé. <a routerLink="/draw">Faire un tirage</a></p>
      }

      @if (status()) { <p class="status" aria-live="polite">{{status()}}</p> }

      @if (assignments().length > 0) {
        <details>
          <summary>Affectations (Tirage)</summary>
          <ul>
            @for (a of assignments(); track a.id) {
              <li>{{a.giver.fullName}} -> 🔒🔒🔒🔒🔒</li>
            }
          </ul>
        </details>
      }
    </section>
  `,
  styles: [`
    .btn { padding:.375rem .625rem; border:1px solid #0a66c2; color:#0a66c2; background:#fff; border-radius:.375rem; }
    .btn.primary { background:#0a66c2; color:#fff; }
    .status { margin-top:.5rem; color:#333; }
    details { margin-top:.75rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailPageComponent {
  private drawSvc = inject(DrawService);
  private emailSvc = inject(EmailService);

  readonly drawId = computed(() => this.drawSvc.lastDrawId());
  readonly assignments = this.drawSvc.assignments;
  readonly status = signal<string>('');

  async send(): Promise<void> {
    const id = this.drawId();
    if (!id) { this.status.set('Aucun tirage disponible.'); return; }
    this.status.set('Envoi en cours...');
    try {
      const res = await this.emailSvc.send(id);
      this.status.set(`Emails envoyés: ${res?.count ?? 0}.`);
    } catch (e) {
      this.status.set((e as Error).message);
    }
  }
}
