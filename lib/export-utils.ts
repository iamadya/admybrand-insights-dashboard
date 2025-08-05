// Export utilities for CSV and PDF generation

// CSV Export functionality
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.csv',
  columns?: { key: keyof T; label: string }[]
) {
  if (!data.length) {
    throw new Error('No data to export');
  }

  // If no columns specified, use all keys from first object
  const exportColumns = columns || Object.keys(data[0]).map(key => ({
    key: key as keyof T,
    label: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  // Create CSV header
  const headers = exportColumns.map(col => col.label).join(',');
  
  // Create CSV rows
  const rows = data.map(row => 
    exportColumns.map(col => {
      const value = row[col.key];
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value?.toString() || '';
    }).join(',')
  );

  // Combine header and rows
  const csvContent = [headers, ...rows].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// PDF Export functionality (using browser's print to PDF)
export function exportToPDF(
  data: any[],
  columns: { key: string; label: string }[],
  filename: string = 'export.pdf',
  title?: string
) {
  if (!data.length) {
    throw new Error('No data to export');
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Unable to open print window. Please check popup blockers.');
  }

  // Calculate column widths based on content
  const getColumnWidth = (colKey: string) => {
    switch (colKey) {
      case 'name': return '25%';
      case 'startDate':
      case 'endDate': return '12%';
      case 'spend': return '12%';
      case 'impressions': return '15%';
      case 'clicks': return '10%';
      case 'conversions': return '12%';
      case 'status': return '10%';
      default: return 'auto';
    }
  };

  // Generate table HTML with proper column sizing
  const tableHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; table-layout: fixed;">
      <thead>
        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
          ${columns.map(col =>
            `<th style="padding: 8px 6px; text-align: left; font-weight: 600; border: 1px solid #dee2e6; width: ${getColumnWidth(col.key)}; font-size: 10px; word-wrap: break-word;">${col.label}</th>`
          ).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr style="border-bottom: 1px solid #dee2e6;">
            ${columns.map(col => {
              let value = row[col.key];
              // Format specific data types
              if (col.key.includes('Date') && value) {
                value = new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
              } else if (col.key === 'spend' && typeof value === 'number') {
                value = `$${value.toLocaleString()}`;
              } else if ((col.key === 'impressions' || col.key === 'clicks' || col.key === 'conversions') && typeof value === 'number') {
                value = value.toLocaleString();
              } else if (col.key === 'status') {
                value = value || '';
              }
              return `<td style="padding: 8px 6px; border: 1px solid #dee2e6; font-size: 9px; word-wrap: break-word; overflow-wrap: break-word;">${value || ''}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Create the print document
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || filename}</title>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11px;
            line-height: 1.3;
          }
          @media print {
            @page {
              margin: 0.5in;
              size: landscape;
            }
            body { margin: 0; }
            .no-print { display: none !important; }
            table {
              page-break-inside: auto;
              width: 100% !important;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
              page-break-after: avoid;
            }
            th, td {
              page-break-inside: avoid;
            }
          }
          .print-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            text-align: center;
            color: #333;
          }
          .print-date {
            text-align: center;
            color: #666;
            margin-bottom: 15px;
            font-size: 10px;
          }
          table {
            font-size: 9px;
            width: 100%;
            max-width: 100%;
          }
          th {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            print-color-adjust: exact;
          }
          th, td {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .summary {
            margin-top: 15px;
            font-size: 10px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${title ? `<div class="print-title">${title}</div>` : ''}
        <div class="print-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
        ${tableHTML}
        <div class="summary">Total records: ${data.length}</div>
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
}

// Format data for export (remove React components, format dates, etc.)
export function formatDataForExport<T extends Record<string, any>>(
  data: T[],
  formatters?: Partial<Record<keyof T, (value: any) => string>>
): Record<string, any>[] {
  return data.map(row => {
    const formattedRow: Record<string, any> = {};
    
    Object.entries(row).forEach(([key, value]) => {
      const formatter = formatters?.[key as keyof T];
      
      if (formatter) {
        formattedRow[key] = formatter(value);
      } else if (value instanceof Date) {
        formattedRow[key] = value.toLocaleDateString();
      } else if (typeof value === 'object' && value !== null) {
        // Skip React components and complex objects
        formattedRow[key] = value.toString?.() || '[Object]';
      } else {
        formattedRow[key] = value;
      }
    });
    
    return formattedRow;
  });
}

// Campaign-specific export columns
export const campaignExportColumns = [
  { key: 'name' as const, label: 'Campaign Name' },
  { key: 'startDate' as const, label: 'Start Date' },
  { key: 'endDate' as const, label: 'End Date' },
  { key: 'spend' as const, label: 'Spend ($)' },
  { key: 'impressions' as const, label: 'Impressions' },
  { key: 'clicks' as const, label: 'Clicks' },
  { key: 'conversions' as const, label: 'Conversions' },
  { key: 'status' as const, label: 'Status' }
];

// Campaign data formatters
export const campaignFormatters = {
  startDate: (date: string) => new Date(date).toLocaleDateString(),
  endDate: (date: string) => new Date(date).toLocaleDateString(),
  spend: (amount: number) => `$${amount.toLocaleString()}`,
  impressions: (count: number) => count.toLocaleString(),
  clicks: (count: number) => count.toLocaleString(),
  conversions: (count: number) => count.toLocaleString()
};
