import { Skeleton, TableCell, TableRow } from "@mui/material";

interface TableRowSkeletonProps {
  columns: number;
}

export function TableRowSkeleton({ columns }: TableRowSkeletonProps) {
  return (
    <TableRow>
      {Array.from({ length: columns }, (_, i) => (
        <TableCell key={i}>
          <Skeleton variant="text" />
        </TableCell>
      ))}
    </TableRow>
  );
}
