import { Directive, HostListener, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { ContextMenuService } from './context-menu.service';

@Directive({
  selector: '[contextMenu]',
  standalone: true
})
export class ContextMenuDirective {
  @Input('contextMenu') templateRef: TemplateRef<unknown>;
  readonly contextMenuService = inject(ContextMenuService);
  readonly viewContainerRef = inject(ViewContainerRef);

  @HostListener('contextmenu', ['$event'])
  showContextMenu(event: MouseEvent): void {
    this.contextMenuService.open(this.templateRef, this.viewContainerRef, event);
    event.preventDefault();
  }
}
