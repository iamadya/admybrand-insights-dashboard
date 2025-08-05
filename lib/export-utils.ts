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

// PDF Export functionality using jsPDF for direct download
export function exportToPDF(
  data: any[],
  columns: { key: string; label: string }[],
  filename: string = 'export.pdf',
  title?: string
) {
  if (!data.length) {
    throw new Error('No data to export');
  }

  // Import jsPDF dynamically to avoid SSR issues
  import('jspdf').then(({ default: jsPDF }) => {
    import('jspdf-autotable').then(({ default: autoTable }) => {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title if provided
      if (title) {
        doc.setFontSize(16);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
        
        // Add generation timestamp
        doc.setFontSize(10);
        const timestamp = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
        doc.text(timestamp, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
      }
      
      // Format data for autotable
      const tableData = data.map(row => {
        return columns.map(col => {
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
          }
          
          return value || '';
        });
      });
      
      // Add table to PDF
      autoTable(doc, {
        head: [columns.map(col => col.label)],
        body: tableData,
        startY: title ? 30 : 15,
        headStyles: {
          fillColor: [248, 249, 250],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: columns.reduce((styles, col, index) => {
          // Set column widths based on content type
          if (col.key === 'name') {
            styles[index] = { cellWidth: 50 };
          } else if (col.key.includes('Date')) {
            styles[index] = { cellWidth: 25 };
          } else if (col.key === 'status') {
            styles[index] = { cellWidth: 20 };
          }
          return styles;
        }, {} as Record<number, any>)
      });
      
      // Add footer with record count
      const pageCount = (doc as any).internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Total records: ${data.length}`, doc.internal.pageSize.getWidth() / 2, 
          doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 20, 
          doc.internal.pageSize.getHeight() - 10);
      }
      
      // Save PDF file
      doc.save(filename);
    });
  });
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
