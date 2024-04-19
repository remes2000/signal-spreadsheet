import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CellService } from './_services/cell.service';
import { ColumnAliasPipe } from './_features/column-alias.pipe';
import { CellComponent } from './_features/cell/cell.component';
import { TopBarComponent } from './_features/top-bar/top-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [CellService, ColumnAliasPipe],
  imports: [RouterOutlet, CellComponent, TopBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'signal-spreadsheet';
  cellService = inject(CellService);
  columns = this.cellService.columns;
  rows = this.cellService.rows;
  selectedColumn = this.cellService.selectedColumn;
  selectedRow = this.cellService.selectedRow;
}
