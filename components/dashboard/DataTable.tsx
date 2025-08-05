import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable as BaseDataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { DateRangePickerWithPresets } from '@/components/ui/date-range-picker';
import { ColumnDef } from '@tanstack/react-table';
import { DateRange } from 'react-day-picker';
import { Download, FileText, Calendar } from 'lucide-react';
import { exportToCSV, exportToPDF, formatDataForExport } from '@/lib/export-utils';
import { useToast } from '@/hooks/use-toast';

interface DataTableProps<T extends Record<string, any>> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  searchKey?: string;
  searchPlaceholder?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  // Export functionality
  enableExport?: boolean;
  exportFilename?: string;
  exportColumns?: { key: keyof T; label: string }[];
  exportFormatters?: Partial<Record<keyof T, (value: any) => string>>;
  // Date filtering
  enableDateFilter?: boolean;
  dateFilterKey?: keyof T;
  dateFilterLabel?: string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  icon,
  columns,
  data,
  isLoading = false,
  searchKey,
  searchPlaceholder = "Search...",
  className = "",
  headerClassName = "",
  contentClassName = "",
  enableExport = false,
  exportFilename,
  exportColumns,
  exportFormatters,
  enableDateFilter = false,
  dateFilterKey,
  dateFilterLabel = "Filter by date range"
}: DataTableProps<T>) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!enableDateFilter || !dateFilterKey || !dateRange?.from) {
      return data;
    }

    return data.filter((item) => {
      const itemDate = new Date(item[dateFilterKey] as string);
      const fromDate = dateRange.from!;
      const toDate = dateRange.to || dateRange.from!;

      // Set time to start/end of day for proper comparison
      const startOfDay = new Date(fromDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);

      return itemDate >= startOfDay && itemDate <= endOfDay;
    });
  }, [data, dateRange, enableDateFilter, dateFilterKey]);

  // Export handlers
  const handleExportCSV = () => {
    try {
      // Type assertion to ensure the formatted data is recognized as compatible with T[]
      const formattedData = formatDataForExport<Record<string, any>>(filteredData, exportFormatters as any);
      const filename = exportFilename ? `${exportFilename}.csv` : `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;

      exportToCSV(formattedData, filename, exportColumns as any);

      toast({
        title: "Export Successful",
        description: `Data exported to ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    try {
      const formattedData = formatDataForExport<Record<string, any>>(filteredData, exportFormatters as any);
      const filename = exportFilename ? `${exportFilename}.pdf` : `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      const columnsToUse = exportColumns || Object.keys(formattedData[0] || {}).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1)
      }));

      exportToPDF(formattedData, columnsToUse as { key: string; label: string }[], filename, title);

      toast({
        title: "Export Initiated",
        description: "PDF export has been initiated. Please check your browser's print dialog.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`p-4 md:p-6 ${className}`}>
      <div className={`mb-4 md:mb-6 ${headerClassName}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2">
              {icon && <span className="text-primary">{icon}</span>}
              {title}
            </h3>
            {description && (
              <p className="text-sm md:text-base text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {/* Export and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            {enableDateFilter && (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
                <DateRangePickerWithPresets
                  date={dateRange}
                  onDateChange={setDateRange}
                  placeholder={dateFilterLabel}
                  className="w-full sm:w-auto max-w-[320px] sm:max-w-none"
                />
              </div>
            )}

            {enableExport && (
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={isLoading || filteredData.length === 0}
                  className="flex items-center gap-2 flex-1 sm:flex-initial"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden xs:inline">Export </span>CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={isLoading || filteredData.length === 0}
                  className="flex items-center gap-2 flex-1 sm:flex-initial"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden xs:inline">Export </span>PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={contentClassName}>
        <BaseDataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
        />
      </div>
    </Card>
  );
}