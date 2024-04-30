import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HistoryService } from '../../_services/history.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {
  historyService = inject(HistoryService);
  hasUndo = computed(() => !!this.historyService.undoStack().length);
  hasRedo = computed(() => !!this.historyService.redoStack().length);

  undo() {
    this.historyService.undo();
  }

  redo() {
    this.historyService.redo();
  }
}
