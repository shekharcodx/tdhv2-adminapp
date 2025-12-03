import { useState, cloneElement } from "react";
import styles from "./DataTable.module.css";
import DataPaginationClient from "../DataPaginationClient";

function DataTableClient({
  columns,
  data,
  isFetching = false,
  skeleton,
  emptyMessage = "No records found",
  getRowClass,
}) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;

  const currentItems = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHead}>
              {columns.map((col, i) => (
                <th key={i}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              Array.from({ length: itemsPerPage }).map((_, i) =>
                cloneElement(skeleton, { key: i })
              ) || (
                <tr>
                  <td colSpan={columns.length}>Loading...</td>
                </tr>
              )
            ) : currentItems?.length > 0 ? (
              currentItems.map((row, index) => (
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
                  {columns.map((col, i) => (
                    <td key={i} className={styles.tableCell}>
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
      <DataPaginationClient
        totalPages={totalPages}
        totalDocs={0}
        page={page}
        pageSize={1}
        onPageChange={setPage}
        showTotal={false}
      />
    </>
  );
}

export default DataTableClient;
