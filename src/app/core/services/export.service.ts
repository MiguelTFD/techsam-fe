import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Configurar las fuentes para pdfmake
const pdfMakeInstance = pdfMake as any;

// Verificar que pdfFonts esté disponible antes de asignar
if (pdfFonts && (pdfFonts as any).pdfMake && (pdfFonts as any).pdfMake.vfs) {
  pdfMakeInstance.vfs = (pdfFonts as any).pdfMake.vfs;
} else {
  console.warn('⚠️ pdfFonts.vfs no está disponible');
}

// Usar solo Roboto que viene con pdfmake
pdfMakeInstance.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf', 
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

export interface ExportConfig {
  title: string;
  columns: { key: string; label: string }[];
  data: any[];
  fileName?: string;
}

export interface ExportWithStatsConfig extends ExportConfig {
  stats?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToPDF(config: ExportConfig): void {
    try {
      const documentDefinition = this.createDocumentDefinition(config);
      // ✅ CORREGIDO: Usar pdfMakeInstance en lugar de pdfMake
      pdfMakeInstance.createPdf(documentDefinition).download(this.getFileName(config));
    } catch (error) {
      console.error('❌ Error exportando PDF:', error);
      this.fallbackExport(config);
    }
  }

  exportWithStats(config: ExportWithStatsConfig): void {
    try {
      const documentDefinition = this.createDocumentDefinitionWithStats(config);
      // ✅ CORREGIDO: Usar pdfMakeInstance
      pdfMakeInstance.createPdf(documentDefinition).download(this.getFileName(config));
    } catch (error) {
      console.error('❌ Error exportando PDF con stats:', error);
      this.fallbackExport(config);
    }
  }

  private createDocumentDefinition(config: ExportConfig): any {
    const { title, columns, data } = config;

    return {
      // ✅ Usar Roboto en lugar de Helvetica
      defaultStyle: {
        font: 'Roboto'
      },

      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      
      header: {
        text: title,
        style: 'header',
        margin: [40, 20, 40, 0]
      },
      
      footer: (currentPage: number, pageCount: number) => ({
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'center', 
        margin: [0, 20, 0, 0],
        style: 'footer'
      }),
      
      content: [
        {
          text: `Generado el: ${new Date().toLocaleDateString('es-ES')}`,
          style: 'subheader',
          margin: [0, 0, 0, 20]
        },
        
        {
          table: {
            headerRows: 1,
            widths: columns.map(() => '*'),
            body: [
              columns.map(column => ({
                text: column.label,
                style: 'tableHeader',
                alignment: 'center'
              })),
              ...data.map(row => 
                columns.map(column => ({
                  text: this.safeString(row[column.key]),
                  style: 'tableCell', 
                  alignment: this.getAlignment(row[column.key])
                }))
              )
            ]
          },
          // ✅ Layout simplificado
          layout: {
            fillColor: (rowIndex: number, node: any, columnIndex: number) => {
              return rowIndex === 0 ? '#3b82f6' : null;
            }
          }
        }
      ],
      
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          color: '#1f2937'
        },
        subheader: {
          fontSize: 10, 
          color: '#6b7280',
          alignment: 'right'
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'white',
          margin: [4, 4, 4, 4]
        },
        tableCell: {
          fontSize: 9,
          margin: [4, 4, 4, 4]
        },
        footer: {
          fontSize: 8,
          color: '#6b7280'
        }
      }
    };
  }

  private createDocumentDefinitionWithStats(config: ExportWithStatsConfig): any {
    const { title, columns, data, stats } = config;

    return {
      defaultStyle: {
        font: 'Roboto'
      },

      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      
      header: {
        text: title,
        style: 'header', 
        margin: [40, 20, 40, 0]
      },
      
      content: [
        {
          text: `Generado el: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`,
          style: 'subheader',
          margin: [0, 0, 0, 10]
        },
        
        ...(stats && Object.keys(stats).length > 0 ? [
          {
            text: 'Estadísticas',
            style: 'sectionHeader',
            margin: [0, 10, 0, 5]
          },
          {
            ul: Object.keys(stats).map(key => `${key}: ${stats[key]}`),
            margin: [0, 0, 0, 20]
          }
        ] : []),
        
        {
          table: {
            headerRows: 1,
            widths: columns.map(() => '*'),
            body: [
              columns.map(column => ({
                text: column.label,
                style: 'tableHeader',
                alignment: 'center'
              })),
              ...data.map(row => 
                columns.map(column => ({
                  text: this.safeString(row[column.key]),
                  style: 'tableCell',
                  alignment: this.getAlignment(row[column.key])
                }))
              )
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],
      
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          color: '#1f2937'
        },
        subheader: {
          fontSize: 10,
          color: '#6b7280', 
          alignment: 'right'
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          color: '#374151',
          margin: [0, 10, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: '#1f2937',
          fillColor: '#f3f4f6'
        },
        tableCell: {
          fontSize: 9
        }
      }
    };
  }

  private safeString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }

  private getAlignment(value: any): string {
    if (typeof value === 'number') return 'right';
    if (typeof value === 'boolean') return 'center';
    return 'left';
  }

  private getFileName(config: ExportConfig): string {
    const timestamp = new Date().getTime();
    return `${config.fileName || 'export'}_${timestamp}.pdf`;
  }

  private fallbackExport(config: ExportConfig): void {
    // Fallback: descargar como texto simple
    const content = config.columns.map(col => col.label).join(', ') + '\n' +
                   config.data.map(row => 
                     config.columns.map(col => row[col.key]).join(', ')
                   ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.fileName || 'export'}_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('PDF no disponible. Se descargó como archivo de texto.');
  }

  getPDFAsBlob(config: ExportConfig): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const documentDefinition = this.createDocumentDefinition(config);
        pdfMakeInstance.createPdf(documentDefinition).getBlob(resolve);
      } catch (error) {
        reject(error);
      }
    });
  }
}