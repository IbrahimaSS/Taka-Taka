// src/components/ui/Table.jsx
import React from 'react';

const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`overflow-x-auto overflow-y-auto md:overflow-x-hidden rounded-xl border border-gray-200 ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left py-4 px-6 text-sm font-bold text-gray-800"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = '', onClick }) => (
  <tr
    className={`table-row border-b border-gray-100 last:border-0 overflow-auto ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`py-4 px-6 ${className}`}>{children}</td>
);

export default Table;