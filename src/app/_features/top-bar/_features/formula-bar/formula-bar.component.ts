import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { CellService } from '../../../../_services/cell/cell.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formula-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formula-bar.component.html',
  styleUrl: './formula-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormulaBarComponent {
  private readonly cellService = inject(CellService);
  private readonly formulaInput = viewChild<ElementRef>('formulaInput');
  private readonly selectedCellMapEntry = computed(() => {
    const selectedCell = this.cellService.selectedCell();
    return selectedCell 
      ? this.cellService.cellSignalMap().get(selectedCell)
      : null;
  });
  readonly formula = computed(() => {
    if (this.selectedCellMapEntry()) {
      return this.selectedCellMapEntry().formula();
    }
    return '';
  });
  readonly mentionedCells = this.cellService.mentionedCells;

  setFormula(value: string) {
    if (this.selectedCellMapEntry()) {
      this.selectedCellMapEntry().formula.set(value);
    }
  }

  apply() {
    this.cellService.unselect();
    this.formulaInput().nativeElement.blur();
  }
}
