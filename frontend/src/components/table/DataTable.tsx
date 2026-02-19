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
    <div className={`relative overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {columns.map((column, colIndex) => (
                <th
                  key={`col-header-${String(column.header)}-${colIndex}`}
                  scope="col"
                  className={`px-6 py-4 font-semibold tracking-wider ${column.className || ""}`}
                >
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th scope="col" className="px-6 py-4 text-right font-semibold tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center text-gray-400 dark:text-gray-600">
                    <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={String(item[keyAccessor])}
                  className="bg-white dark:bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`row-${String(item[keyAccessor])}-col-${String(column.header)}-${colIndex}`}
                      className={`px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 ${column.className || ""}`}
                    >
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={`action-${String(item[keyAccessor])}-${actionIndex}`}
                            onClick={() => action.onClick(item)}
                            className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium ${action.className || "text-gray-600 dark:text-gray-400"
                              }`}
                            disabled={action.disabled?.(item)}
                            title={action.label}
                          >
                            {action.icon ? (
                              <span className="w-5 h-5">{action.icon}</span>
                            ) : (
                              <span>{action.label}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4">
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        </div>
      )}
    </div>
  );
}