
import { ChangeDetectionStrategy, Component, output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-participant-form-couple',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (submit)="onSubmit($event)" class="card" aria-labelledby="add-couple-title">
      <h2 id="add-couple-title">Ajouter un couple</h2>

      <fieldset>
        <legend>Personne A</legend>
        <label>
          Nom complet
          <input formControlName="a_fullName" required />
        </label>
        <label>
          Email
          <input type="email" formControlName="a_email" required />
        </label>
        <label>
          Idée cadeau
          <textarea formControlName="a_giftIdea" required></textarea>
        </label>
      </fieldset>

      <fieldset>
        <legend>Personne B</legend>
        <label>
          Nom complet
          <input formControlName="b_fullName" required />
        </label>
        <label>
          Email
          <input type="email" formControlName="b_email" required />
        </label>
        <label>
          Idée cadeau
          <textarea formControlName="b_giftIdea" required></textarea>
        </label>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary" [disabled]="form.invalid">Ajouter le couple</button>
        <button type="button" class="btn" (click)="cancelled.emit()">Annuler</button>
      </div>
    </form>
  `,
  styles: [`
    .card { border:1px solid #ddd; padding:.75rem; border-radius:.5rem; margin:.5rem 0; background:#fff; }
    fieldset { border:1px solid #ccc; border-radius:.5rem; margin:.5rem 0; padding:.5rem; }
    legend { font-weight:600; }
    label { display:grid; gap:.25rem; margin:.25rem 0; }
    input, textarea { padding:.4rem; border:1px solid #ccc; border-radius:.375rem; }
    .actions { display:flex; gap:.5rem; margin-top:.5rem; }
    .btn { padding:.375rem .625rem; border:1px solid #0a66c2; color:#0a66c2; background:#fff; border-radius:.375rem; }
    .btn.primary { background:#0a66c2; color:#fff; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantFormCoupleComponent {
  private fb = inject(FormBuilder);

  submitted = output<{ a: { fullName: string; email: string; giftIdea: string }, b: { fullName: string; email: string; giftIdea: string } }>();
  cancelled = output<void>();

  form = this.fb.nonNullable.group({
    a_fullName: ['', [Validators.required]],
    a_email: ['', [Validators.required, Validators.email]],
    a_giftIdea: ['', [Validators.required]],
    b_fullName: ['', [Validators.required]],
    b_email: ['', [Validators.required, Validators.email]],
    b_giftIdea: ['', [Validators.required]],
  });

  onSubmit(e: Event): void {
    e.preventDefault();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.submitted.emit({
      a: { fullName: v.a_fullName, email: v.a_email, giftIdea: v.a_giftIdea },
      b: { fullName: v.b_fullName, email: v.b_email, giftIdea: v.b_giftIdea },
    });
  }
}
