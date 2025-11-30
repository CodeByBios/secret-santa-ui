
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { ParticipantsService, Participant } from '../../core/services/participants.service';
import { ParticipantTagComponent } from './participant-tag.component';
import { ParticipantFormSingleComponent } from './participant-form-single.component';
import { ParticipantFormCoupleComponent } from './participant-form-couple.component';

@Component({
  selector: 'app-participants-page',
  imports: [ParticipantTagComponent, ParticipantFormSingleComponent, ParticipantFormCoupleComponent],
  template: `
    <section aria-labelledby="participants-title">
      <h1 id="participants-title">Participants ({{participants().length}})</h1>

      <div class="actions" role="group" aria-label="Actions">
        <button type="button" class="btn" (click)="openSingle()">Ajouter un participant</button>
        <button type="button" class="btn" (click)="openCouple()">Ajouter un couple</button>
      </div>

        <div class="form-container" [class.visible]="addingSingle()" [class.hidden]="!addingSingle()">
          @if (addingSingle()) {
          <app-participant-form-single
            (submitted)="onSingleSubmitted($event)"
            (cancelled)="addingSingle.set(false)" />
          }
        </div>
      
        <div class="form-container" [class.visible]="addingCouple()" [class.hidden]="!addingCouple()">
          @if (addingCouple()) {
          <app-participant-form-couple
            (submitted)="onCoupleSubmitted($event)"
            (cancelled)="addingCouple.set(false)" />
          }
        </div>

      @if(status()) {
        <div class="status" aria-live="polite">{{status()}}</div>
      }

      <ul class="tags mt-3" role="list">
        @for (p of participants(); track p.id) {
          <li role="listitem">
            <app-participant-tag
              [participant]="p"
              [editable]="!p.coupleId"
              (removed)="remove(p.id)"
              (edited)="edit(p.id, $event)" />
          </li>
        }
      </ul>
    </section>
  `,
  styles: [`
    .actions { display:flex; gap:.5rem; margin-bottom:1rem; margin-top:1rem; flex-wrap:wrap; }
    .btn { padding:.375rem .625rem; border:1px solid #0a66c2; color:#0a66c2; background:#fff; border-radius:.375rem; }
    .tags { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:.75rem; padding:0; list-style:none; }
    .status { min-height:1.25rem; color:#333; }
    .form-container {
      overflow: hidden;
      transition: max-height 0.5s ease, opacity 0.5s ease;
    }
    .form-container.hidden {
      max-height: 0;
    }
    .form-container.visible {
      max-height: 1000px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsPageComponent implements OnInit {
  private svc = inject(ParticipantsService);

  readonly participants = computed(() => this.svc.participants());
  readonly addingSingle = signal(false);
  readonly addingCouple = signal(false);
  readonly status = signal<string>('');

  async ngOnInit(): Promise<void> {
    await this.svc.load();
  }

  openSingle(): void { this.addingSingle.set(true); this.addingCouple.set(false); }
  openCouple(): void { this.addingCouple.set(true); this.addingSingle.set(false); }

  async onSingleSubmitted(data: Pick<Participant, 'fullName' | 'email' | 'giftIdea'>): Promise<void> {
    await this.svc.addSingle(data);
    this.status.set('Participant ajouté.');
    this.addingSingle.set(false);
  }

  async onCoupleSubmitted(data: { a: Pick<Participant, 'fullName' | 'email' | 'giftIdea'>, b: Pick<Participant, 'fullName' | 'email' | 'giftIdea'> }): Promise<void> {
    await this.svc.addCouple(data.a, data.b);
    this.status.set('Couple ajouté.');
    this.addingCouple.set(false);
  }

  async remove(id: string): Promise<void> {
    await this.svc.remove(id);
    this.status.set('Participant supprimé.');
  }

  async edit(id: string, data: Pick<Participant, 'fullName' | 'email' | 'giftIdea'>): Promise<void> {
    await this.svc.updateSingle(id, data);
    this.status.set('Participant modifié.');
  }
}
