import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ContextMenuModule } from '../../context-menu/context-menu.module';
import { CellService } from '../../../_services/cell/cell.service';
import { Address } from '../../../_interfaces/address';

@Component({
  selector: 'app-cell-context-menu',
  standalone: true,
  imports: [ContextMenuModule],
  templateUrl: './cell-context-menu.component.html',
  styleUrl: './cell-context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellContextMenuComponent {
  @Input({ required: true }) address: string;
  private readonly cellService = inject(CellService);

  deleteRow() {
    this.cellService.unselect();
    this.cellService.deleteRow(new Address(this.address).getRow());
  }

  deleteColumn() {
    this.cellService.unselect();
    this.cellService.deleteColumn(new Address(this.address).getColumn());
  }
}
