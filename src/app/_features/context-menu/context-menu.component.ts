import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [],
  template: `
    <div class="menu">
      <ng-content />
    </div>
  `,
  styleUrl: './context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {

}
