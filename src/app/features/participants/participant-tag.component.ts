
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

type ParticipantView = {
  id: string;
  fullName: string;
  email: string;
  emoji: string;
  giftIdea: string;
  coupleId?: string | null;
};

@Component({
  selector: 'app-participant-tag',
  imports: [TitleCasePipe],
  template: `
    <article class="tag" tabindex="0" [class.expanded]="isEditing()" [class.collapsed]="!isEditing()" [attr.aria-labelledby]="'name-' + participant().id">
      <header class="tag__header">
        <h2 id="name-{{participant().id}}" class="tag__title">
          <strong>{{participant().fullName | titlecase }}</strong> 
          @if (participant().coupleId) { <span class="pill" aria-label="En couple">Couple</span> }
          {{participant().emoji}}
        </h2>
      </header>
      <p class="tag__line"><strong>Idée cadeau:</strong> {{participant().giftIdea}}</p>
      <footer class="tag__footer" role="group" aria-label="Actions">
        <button type="button" class="btn danger" (click)="removed.emit()">Supprimer</button>
        <button type="button" class="btn" (click)="toggleEdit()">Modifier</button>
      </footer>

      @if (isEditing()) {
        <form (submit)="onSubmit($event)" class="edit-form">
          <label>
            Nom complet
            <input #fn [value]="participant().fullName" (input)="fullName=fn.value" required />
          </label>
          <label>
            Email
            <input #em type="email" [value]="participant().email" (input)="email=em.value" required />
          </label>
          <label>
            Idée cadeau
            <textarea #gi [value]="participant().giftIdea" (input)="giftIdea=gi.value" required></textarea>
          </label>
          <div class="edit-actions mt-2">
            <button type="submit" class="btn primary me-2">Enregistrer</button>
            <button type="button" class="btn" (click)="isEditing.set(false)">Annuler</button>
          </div>
        </form>
      }
    </article>
  `,
  styles: [`
    .tag { border:1px solid #ddd; border-radius:.5rem; padding:.75rem; background:#fff; }
    .tag__title { display:flex; align-items:center; gap:.5rem; font-size:1rem; margin:0; }
    .pill { font-size:.75rem; border:1px solid #666; color:#333; padding:.1rem .4rem; border-radius:999px; }
    .tag__line { margin:.25rem 0; color:#333; }
    .tag__footer { display:flex; gap:.5rem; margin-top:.5rem; }
    .btn { padding:.375rem .625rem; border:1px solid #0a66c2; color:#0a66c2; background:#fff; border-radius:.375rem; }
    .btn.primary { background:#0a66c2; color:#fff; }
    .btn.danger { border-color:#b00020; color:#b00020; }
    .edit-form { display:grid; gap:.5rem; margin-top:.5rem; }
    label { display:grid; gap:.25rem; }
    input, textarea { padding:.4rem; border:1px solid #ccc; border-radius:.375rem; }
    .tag {
      overflow: hidden;
      transition: all 0.5s ease;
    }
    .tag.collapsed {
      max-height: 120px;
    }
    .tag.expanded {
      max-height: 500px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantTagComponent {
  participant = input.required<ParticipantView>();
  editable = input<boolean>(false);
  removed = output<void>();
  edited = output<Pick<ParticipantView, 'fullName' | 'email' | 'giftIdea'>>();
  isEditing = signal(false);

  fullName = '';
  email = '';
  giftIdea = '';

  toggleEdit(): void {
    this.isEditing.set(true);
    const p = this.participant();
    this.fullName = p.fullName;
    this.email = p.email;
    this.giftIdea = p.giftIdea;
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    this.edited.emit({ fullName: this.fullName, email: this.email, giftIdea: this.giftIdea });
    this.isEditing.set(false);
  }
}
