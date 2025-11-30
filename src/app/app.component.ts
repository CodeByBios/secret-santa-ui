
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './shared/ui/app-header.component';

interface Flake {
  id: number;
  left: number;      // position horizontale en %
  duration: number;  // durée de chute en s
  delay: number;     // délai de départ en s
  size: number;      // taille en rem (très petits)
  opacity: number;   // variations légères pour le réalisme
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent],
  template: `
    <app-header />
    <main class="container" role="main">
        <div class="snow" aria-hidden="true">
          @for (flake of flakes(); track flake.id) {
            <div class="flake" [style.left.%]="flake.left" [style.animation-delay.s]="flake.delay">
                <span class="flake__glyph" [style.animation-duration.s]="flake.duration" [style.font-size.rem]="flake.size"
                  [style.opacity]="flake.opacity">
                  ❄
                </span>
            </div>
          }
        </div>
      <router-outlet />
    </main>
  `,
  styles: [`
    .container { margin: 0 auto; padding: 1rem; };
    .snow {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    }
    .flake {
        position: absolute;
        top: -10vh;
        animation: sway ease-in-out infinite;
    }
    .flake__glyph {
        display: block;
        animation: fall linear infinite;
    }
    @keyframes fall {
        0% {
            transform: translateY(0) rotate(0deg);
        }

        100% {
            transform: translateY(110vh) rotate(360deg);
        }
    }
    @keyframes sway {
        0%,
        100% {
            transform: translateX(0);
        }

        50% {
            transform: translateX(15px);
        }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly flakes = signal<Flake[]>(createFlakes(100));
}

function createFlakes(count: number): Flake[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 6 + Math.random() * 9,   // 6–15 s
    delay: Math.random() * 10,         // 0–10 s
    size: 0.18 + Math.random() * 0.45, // très petits: 0.18–0.63 rem
    opacity: 0.45 + Math.random() * 0.55,
  }));
}