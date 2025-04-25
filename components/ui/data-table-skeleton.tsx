import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableSkeletonProps {
  columnCount: number
  rowCount?: number
  hasRowActions?: boolean
}

export function DataTableSkeleton({ columnCount, rowCount = 5, hasRowActions = true }: DataTableSkeletonProps) {
  const actualColumnCount = hasRowActions ? columnCount + 1 : columnCount

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: actualColumnCount }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-6 w-full max-w-[120px]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: actualColumnCount }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
