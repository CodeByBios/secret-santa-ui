
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
      <nav class="navbar navbar-expand-lg navbar-dark bg-christmas px-3">
        <a routerLink="/" class="navbar-brand"  aria-label="Accueil Secret Santa">
          🎅 Secret Santa
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <nav aria-label="Navigation principale">
            <a routerLink="/" class="nav__link">Participants</a>
            <a routerLink="/draw" class="nav__link">Tirage</a>
            <a routerLink="/emails" class="nav__link">Envoyer les emails</a>
          </nav>
        </div>
      </nav>
  `,
  styles: [`
    .header { display:flex; align-items:center; justify-content:space-between; gap:.5rem; padding:.75rem 1rem; border-bottom:1px solid #ddd; background:#fff; }
    .brand { display:flex; align-items:center; gap:.5rem; text-decoration:none; }
    .brand__text { font-weight:600; color:#111; }
    .nav__link { text-decoration:none; color:white; }
    .nav__link:not(:first-child) { margin-left: 1rem }
    .bg-christmas {
    background: linear-gradient(90deg, #b30000, #006400);
    }
    .navbar-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: #fff;
    }
    .navbar-text {
        font-size: 1.2rem;
    }
    .navbar-toggler {
        border-color: #fff;
    }
    .navbar-toggler-icon {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='white' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent { }
