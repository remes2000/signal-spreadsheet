import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CellService } from './_services/cell/cell.service';
import { ColumnAliasPipe } from './_features/column-alias.pipe';
import { CellComponent } from './_features/cell/cell.component';
import { TopBarComponent } from './_features/top-bar/top-bar.component';
import { HistoryService } from './_services/history.service';
import { HistoryComponent } from './_features/history/history.component';
import { CellPropertiesComponent } from './_features/cell-properties/cell-properties.component';
import { snapshot as SHAPES_SNAPSHOT } from './_snapshots/shapes';

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
    this.cellService.applySnapshot(SHAPES_SNAPSHOT);
  }
}
