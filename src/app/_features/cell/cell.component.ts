import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Signal, WritableSignal, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { CellService } from '../../_services/cell.service';
import { FormsModule } from '@angular/forms';
import { Address } from '../../_interfaces/address';
import { ContextMenuModule } from '../context-menu/context-menu.module';
import { CellContextMenuComponent } from './cell-context-menu/cell-context-menu.component';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [FormsModule, ContextMenuModule, CellContextMenuComponent],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent implements OnInit {
  private readonly cellService = inject(CellService);
  readonly address = input.required<string>();
  readonly isSelected = computed(() => this.address() === this.cellService.selectedCell());
  readonly isMentioned = computed(() => this.cellService.mentionedCells().includes(this.address()));
  readonly cellInput = viewChild<ElementRef>('cellInput');
  readonly focusEffect = effect(() => {
    if (this.cellService.selectedCell() === this.address()) {
      this.cellInput().nativeElement.focus();
    }
  });
  formula: WritableSignal<string>;
  value: Signal<unknown>;
  content: Signal<unknown>;

  ngOnInit(): void {
    this.formula = this.cellService.getFormulaSignal(this.address());
    this.value = this.cellService.getValueSignal(this.address());
    this.content = computed(() => this.isSelected() ? this.formula() : this.value()); 
  }

  markAsSelected() {
    this.cellService.selectedCell.set(this.address());
  }

  setFormula(value: string) {
    this.formula.set(value);
  }

  apply() {
    this.cellService.unselect();
    this.cellInput().nativeElement.blur();
  }

  navigate(direction: 'up' | 'right' | 'down' | 'left') {
    const destination = new Address(this.address()).getNeighbor(direction);
    if (destination && this.cellService.exist(destination)) {
      this.cellService.selectedCell.set(destination);
    }
  }
}
