import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CellService } from '../../_services/cell/cell.service';
import { FormsModule } from '@angular/forms';
import { CellProperties, FontWeight } from '../../_interfaces/cell-properties';

@Component({
  selector: 'app-cell-properties',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cell-properties.component.html',
  styleUrl: './cell-properties.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellPropertiesComponent {
  private readonly cellService = inject(CellService);
  private readonly selectedCellMapEntry = computed(() => {
    const selectedCell = this.cellService.selectedCell();
    return selectedCell 
      ? this.cellService.cellSignalMap().get(selectedCell)
      : null;
  });
  readonly properties = computed(() => 
    this.selectedCellMapEntry()
      ? this.selectedCellMapEntry().properties()
      : null
  );
  FontWeight = FontWeight;

  setProperty(property: keyof CellProperties, value: unknown) {
    this.selectedCellMapEntry().properties.update((properties) => ({ ...properties, [property]: value }));
  }
}
