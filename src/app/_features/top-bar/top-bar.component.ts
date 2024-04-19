import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormulaBarComponent } from './_features/formula-bar/formula-bar.component';
import { SelectedCellComponent } from './_features/selected-cell/selected-cell.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [FormulaBarComponent, SelectedCellComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {

}
