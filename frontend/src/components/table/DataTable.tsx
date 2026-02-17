// frontend/src/components/table/DataTable.tsx

import React from "react";
import type { DataTableProps, ColumnDefinition } from "./Table.types";
import { Pagination } from "../pagination/Pagination"; // Import the new Pagination component

const getNestedValue = <T,>(obj: T, path: string): React.ReactNode => {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current as React.ReactNode;
};

export function DataTable<T extends { _id: string }>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "No data found.",
  keyAccessor,
  pagination,
  onPageChange,
  onLimitChange,
  className = "",
}: DataTableProps<T>) {
  const renderCellContent = (item: T, column: ColumnDefinition<T>): React.ReactNode => {
    if (column.render) {
      return column.render(item);
    }
    if (typeof column.accessor === "string") {
      return getNestedValue(item, column.accessor);
    }
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    return null;
  };

  return (
    <div className={`overflow-x-auto shadow-md sm:rounded-lg ${className}`}>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column, colIndex) => (
                <th
                  key={`col-header-${String(column.header)}-${colIndex}`}
                  scope="col"
                  className={`px-6 py-3 ${column.className || ""}`}
                >
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={String(item[keyAccessor])}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`row-${String(item[keyAccessor])}-col-${String(column.header)}-${colIndex}`}
                    className={`px-6 py-4 ${column.className || ""}`}
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={`action-${String(item[keyAccessor])}-${actionIndex}`}
                          onClick={() => action.onClick(item)}
                          className={`font-medium text-blue-600 dark:text-blue-500 hover:underline ${
                            action.className || ""
                          }`}
                          disabled={action.disabled?.(item)}
                        >
                          {action.icon && <span className="mr-1">{action.icon}</span>}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagination && onPageChange && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}