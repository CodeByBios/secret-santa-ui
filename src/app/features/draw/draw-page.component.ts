
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DrawService } from '../../core/services/draw.service';

@Component({
  selector: 'app-draw-page',
  template: `
    <section aria-labelledby="draw-title">
      <h1 id="draw-title">Lancer le tirage</h1>
      <p>Deux personnes en couple ne peuvent pas être associées lors du tirage.</p>
      <div role="group" aria-label="Actions">
        <button type="button" class="btn primary" (click)="doDraw()">Lancer le tirage</button>
        <button type="button" class="btn ms-2" (click)="reset()">Réinitialiser</button>
      </div>

      @if (status()) { <p class="status" aria-live="polite">{{status()}}</p> }

      @if (assignments().length > 0) {
        <table class="table" aria-label="Résultats du tirage">
          <thead>
            <tr><th>Donneur</th><th>Destinataire</th></tr>
          </thead>
          <tbody>
            @for (a of assignments(); track a.id) {
              <tr>
                <td>{{a.giver.fullName}}</td>
                <td>{{a.recipient.fullName}} — {{a.recipient.giftIdea}}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
  styles: [`
    .btn { padding:.375rem .625rem; border:1px solid #0a66c2; color:#0a66c2; background:#fff; border-radius:.375rem; }
    .btn.primary { background:#0a66c2; color:#fff; }
    .status { margin-top:.5rem; color:#333; }
    .table { width:100%; border-collapse:collapse; margin-top:1.2rem; }
    th, td { border:1px solid #ddd; padding:.5rem; text-align:left; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawPageComponent {
  private svc = inject(DrawService);
  readonly assignments = this.svc.assignments;
  readonly status = signal<string>('');

  async doDraw(): Promise<void> {
    this.status.set('Tirage en cours...');
    try {
      await this.svc.create();
      this.status.set('Tirage effectué ✔️');
    } catch (e) {
      this.status.set((e as Error).message);
    }
  }

  async reset(): Promise<void> {
    this.status.set('Réinitialisation des tirages en cours...');
    try {
      await this.svc.reset();
      this.status.set('Réinitialisation des tirages effectuée ✔️');
    } catch (e) {
      this.status.set((e as Error).message);
    }
  }
}
