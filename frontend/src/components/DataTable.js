import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

function DataTable({ columns, data, onRowClick, onDownload }) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                className="px-4 py-2 text-left text-sm font-medium text-gray-700"
              >
                {col.headerName}
              </th>
            ))}

            {(onRowClick || onDownload) && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 hidden md:table-cell">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-t hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.field} className="px-4 py-2 text-sm text-gray-600">
                    {col.renderCell ? col.renderCell(row[col.field]) : row[col.field]}
                </td>
              ))}

              {(onRowClick || onDownload) && (
                <td
                  className="px-4 py-2 hidden md:table-cell"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-2">
                    {onRowClick && (
                      <Tooltip title="Voir" placement="top">
                        <IconButton
                          size="small"
                          color="default"
                          onClick={() => onRowClick(row)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDownload && (
                      <Tooltip title="Télécharger" placement="top">
                        <IconButton
                          size="small"
                          color="default"
                          onClick={() => onDownload(row)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
