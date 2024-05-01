import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CellService } from './_services/cell/cell.service';
import { ColumnAliasPipe } from './_features/column-alias.pipe';
import { CellComponent } from './_features/cell/cell.component';
import { TopBarComponent } from './_features/top-bar/top-bar.component';
import { HistoryService } from './_services/history.service';
import { HistoryComponent } from './_features/history/history.component';
import { CellPropertiesComponent } from './_features/cell-properties/cell-properties.component';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [CellService, ColumnAliasPipe, HistoryService],
  imports: [RouterOutlet, CellComponent, TopBarComponent, HistoryComponent, CellPropertiesComponent],
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

  ngOnInit() {
    const map = this.cellService.cellSignalMap();
    map.get('A1').formula.set('Area of shapes');
    map.get('A3').formula.set('Square');
    map.get('A4').formula.set('a');
    map.get('B4').formula.set('5');
    map.get('A5').formula.set('Area');
    map.get('B5').formula.set('=B4 * B4');

    map.get('A7').formula.set('Rectangle');
    map.get('A8').formula.set('a');
    map.get('B8').formula.set('5');
    map.get('A9').formula.set('b');
    map.get('B9').formula.set('10');
    map.get('A10').formula.set('Area');
    map.get('B10').formula.set('=B8 * B9');
  }
}
