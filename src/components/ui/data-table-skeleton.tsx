import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";

interface DataTableSkeletonProps {
  /**
   * Número de colunas a serem exibidas no skeleton
   * @default 4
   */
  columnCount?: number;
  /**
   * Número de linhas a serem exibidas no skeleton
   * @default 5
   */
  rowCount?: number;
  /**
   * Se deve exibir o skeleton da barra de busca e filtros
   * @default true
   */
  showSearch?: boolean;
  /**
   * Se deve exibir o skeleton da paginação
   * @default true
   */
  showPagination?: boolean;
  /**
   * Classes CSS adicionais para o container
   */
  className?: string;
}

export function DataTableSkeleton({
  columnCount = 4,
  rowCount = 5,
  showSearch = true,
  showPagination = true,
  className,
}: DataTableSkeletonProps) {
  return (
    <div className={`w-full ${className ?? ""}`}>
      {showSearch && (
        <div className="flex items-center py-4">
          <div className="relative max-w-sm flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="ml-auto h-10 w-32" />
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-5 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton
                      className="h-4"
                      style={{
                        width: `${Math.floor(Math.random() * 40) + 60}%`,
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-4 w-32" />
          <div className="space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      )}
    </div>
  );
}

