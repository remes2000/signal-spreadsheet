import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { ContextMenuService } from './context-menu.service';

@Component({
  selector: 'app-context-menu-item',
  standalone: true,
  imports: [],
  template: `
    <div class="item" (click)="onSelect()">
      <ng-content />
    </div>
  `,
  styleUrl: './context-menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuItemComponent {
  @Output() selected = new EventEmitter<void>();
  contextMenuService = inject(ContextMenuService);

  onSelect() {
    this.selected.emit();
    this.contextMenuService.close();
  }
}
