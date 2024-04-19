import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CellService } from '../../../../_services/cell.service';

@Component({
  selector: 'app-selected-cell',
  standalone: true,
  imports: [],
  templateUrl: './selected-cell.component.html',
  styleUrl: './selected-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedCellComponent {
  selectedCell = inject(CellService).selectedCell;
}
