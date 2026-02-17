// frontend/src/components/table/Table.types.ts

import { ReactNode } from "react";
import type { Pagination } from "../../types/common.types";

export type ColumnAccessor<T> = keyof T | ((item: T) => ReactNode);

export interface ColumnDefinition<T> {
  header: string;
  accessor: ColumnAccessor<T>;
  render?: (item: T) => ReactNode; // Optional custom render function for cells
  className?: string; // Optional class for the column header and cells
}

export interface TableAction<T> {
  label: string;
  onClick: (item: T) => void;
  icon?: ReactNode; // Optional icon for the action button
  className?: string; // Optional class for the action button
  disabled?: (item: T) => boolean; // Optional function to disable action based on item
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  actions?: TableAction<T>[]; // Optional actions for each row
  loading?: boolean;
  emptyMessage?: string;
  keyAccessor: keyof T; // A unique key for each row, e.g., "_id"
  pagination?: Pagination; // Pagination metadata
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
}
