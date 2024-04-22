import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { CellService } from '../../../../_services/cell.service';
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
  readonly formula = computed(() => {
    const selectedCell = this.cellService.selectedCell();
    return selectedCell
      ? this.cellService.getFormulaSignal(selectedCell)()
      : '';
  });
  readonly mentionedCells = this.cellService.mentionedCells;

  setFormula(value: string) {
    const selectedCell = this.cellService.selectedCell();
    if (!selectedCell) {
      return;
    }
    this.cellService.getFormulaSignal(selectedCell).set(value);
  }

  apply() {
    this.cellService.unselect();
    this.formulaInput().nativeElement.blur();
  }
}
