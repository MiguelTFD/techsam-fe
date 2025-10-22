import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService, ExportConfig } from '../../../core/services/export.service';

@Component({
  selector: 'app-export-button',
  imports: [CommonModule],
  templateUrl: './export-button.html',
  styleUrls: ['./export-button.scss']
})
export class ExportButton {
  @Input() title: string = 'Reporte';
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];
  @Input() fileName: string = 'reporte';
  @Input() loading: boolean = false;
  @Input() showStats: boolean = false;
  @Input() stats: any = {};
  
  @Output() export = new EventEmitter<void>();

  constructor(private exportService: ExportService) {}

  onExport() {
    if (this.loading || this.data.length === 0) return;

    const exportConfig: ExportConfig = {
      title: this.title,
      columns: this.columns,
      data: this.data,
      fileName: this.fileName
    };

    if (this.showStats && Object.keys(this.stats).length > 0) {
      this.exportService.exportWithStats({
        ...exportConfig,
        stats: this.stats
      });
    } else {
      this.exportService.exportToPDF(exportConfig);
    }

    this.export.emit();
  }
}