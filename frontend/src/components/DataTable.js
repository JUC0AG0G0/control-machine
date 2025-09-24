import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

function DataTable({ columns, data, onRowClick, onDownload }) {
  return (
    <TableContainer component={Paper} className="shadow-lg rounded-2xl mt-4">
      <Table>
        {/* En-tête */}
        <TableHead className="bg-gray-100">
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                className="text-sm font-medium text-gray-700"
              >
                {col.headerName}
              </TableCell>
            ))}

            {(onRowClick || onDownload) && (
              <TableCell className="text-sm font-medium text-gray-700 hidden md:table-cell">
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        {/* Corps */}
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow
                key={row.id}
                hover
                className="cursor-pointer"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <TableCell key={col.field} className="text-sm text-gray-600">
                    {col.renderCell
                      ? col.renderCell(row[col.field], row)
                      : row[col.field]}
                  </TableCell>
                ))}

                {(onRowClick || onDownload) && (
                  <TableCell
                    className="hidden md:table-cell"
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
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                align="center"
                className="text-gray-500 italic"
              >
                Aucun élément trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
