import { NgModule } from "@angular/core";
import { ContextMenuDirective } from "./context-menu.directive";
import { ContextMenuComponent } from "./context-menu.component";
import { ContextMenuItemComponent } from "./context-menu-item.component";

@NgModule({
  declarations: [],
  imports: [ContextMenuDirective, ContextMenuComponent, ContextMenuItemComponent],
  exports: [ContextMenuDirective, ContextMenuComponent, ContextMenuItemComponent],
})
export class ContextMenuModule {}
