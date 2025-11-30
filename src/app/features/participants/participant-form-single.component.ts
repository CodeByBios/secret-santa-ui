
import { ChangeDetectionStrategy, Component, output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-participant-form-single',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (submit)="onSubmit($event)" class="card" aria-labelledby="add-single-title">
      <h2 id="add-single-title">Ajouter un participant</h2>
      <label>
        Nom complet
        <input formControlName="fullName" required aria-invalid="{{form.controls.fullName.invalid}}" />
      </label>
      <label>
        Email
        <input type="email" formControlName="email" required aria-invalid="{{form.controls.email.invalid}}" />
      </label>
      <label>
        Idée cadeau
        <textarea formControlName="giftIdea" required aria-invalid="{{form.controls.giftIdea.invalid}}"></textarea>
      </label>
      <div class="actions">
        <button type="submit" class="btn primary" [disabled]="form.invalid">Ajouter</button>
        <button type="button" class="btn" (click)="cancelled.emit()">Annuler</button>
      </div>
    </form>
  `,
  styles: [`
    .card { border:1px solid #ddd; padding:.75rem; border-radius:.5rem; margin:.5rem 0; background:#fff; }
    label { display:grid; gap:.25rem; margin:.25rem 0; }
    input, textarea { padding:.4rem; border:1px solid #ccc; border-radius:.375rem; }
    .actions { display:flex; gap:.5rem; margin-top:.5rem; }
    .btn { padding:.375rem .625rem; border:1px solid #0a66c2; color:#0a66c2; background:#fff; border-radius:.375rem; }
    .btn.primary { background:#0a66c2; color:#fff; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantFormSingleComponent {
  private fb = inject(FormBuilder);

  submitted = output<{ fullName: string; email: string; giftIdea: string }>();
  cancelled = output<void>();

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    giftIdea: ['', [Validators.required]],
  });

  onSubmit(e: Event): void {
    e.preventDefault();
    if (this.form.invalid) return;
    this.submitted.emit(this.form.getRawValue());
  }
}
