// components/DataTable.jsx
import React, { cloneElement, useState } from "react";
import styles from "./DataTable.module.css";
import DataPagination from "../DataPagination";

function DataTable({
  columns,
  data,
  isFetching = false,
  skeleton,
  skeletonRows = 3,
  emptyMessage = "No records found",
  getRowClass,
  pagination = false,
  paginationData,
  page,
  setPage,
}) {
  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHead}>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              Array.from({ length: skeletonRows }).map((_, i) =>
                cloneElement(skeleton, { key: i })
              ) || (
                <tr>
                  <td colSpan={columns.length}>Loading...</td>
                </tr>
              )
            ) : data?.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row._id || index}
                  className={
                    getRowClass
                      ? getRowClass(row, index)
                      : index % 2 === 0
                      ? styles.tableRowEven
                      : styles.tableRowOdd
                  }
                >
                  {columns.map((col) => (
                    <td key={col.key} className={styles.tableCell}>
                      {col.render ? col.render(row, index) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-[10px]" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <DataPagination
          totalPages={paginationData?.totalPages || 1}
          totalDocs={paginationData?.totalDocs || 0}
          page={page}
          pageSize={1}
          onPageChange={setPage}
          showTotal={false}
        />
      )}
    </>
  );
}

export default DataTable;
