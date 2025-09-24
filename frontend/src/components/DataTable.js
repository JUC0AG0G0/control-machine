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
import LinkIcon from '@mui/icons-material/Link';

function DataTable({ columns, data, onRowClick, onDownload }) {
  const handleCopyLink = (row) => {
    if (!row?.path) return;
    const url = `http://0.0.0.0:3001/${row.path}`;
    navigator.clipboard.writeText(url);
  };

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
                        <Tooltip title="Voir" arrow>
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => onRowClick(row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {row.path && (
                        <Tooltip title="Copier le lien" arrow>
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => handleCopyLink(row)}
                          >
                            <LinkIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDownload && (
                        <Tooltip title="Télécharger" arrow>
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
