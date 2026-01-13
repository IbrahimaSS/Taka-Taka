// src/lib/export/exporters.js
// Export data to CSV / Word / PDF (Vite friendly)

const safe = (v, fallback = "") => (v === null || v === undefined ? fallback : v);

const escapeHtml = (str) =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getByPath = (obj, path) => {
  if (!path) return undefined;
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const buildTable = (data = [], columns = []) => {
  const list = Array.isArray(data) ? data : [];
  const cols = Array.isArray(columns) ? columns : [];

  const head = cols.map((c) => c.header);
  const body = list.map((row) =>
    cols.map((c) => {
      const raw = typeof c.accessor === "function" ? c.accessor(row) : getByPath(row, c.accessor);
      const val = c.formatter ? c.formatter(raw, row) : raw;
      return safe(val, "");
    })
  );

  return { head, body };
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => window.URL.revokeObjectURL(url), 1500);
};

export const exportToCSV = ({ data, columns, fileName = "export", onToast }) => {
  const { head, body } = buildTable(data, columns);

  const rows = [head, ...body];
  const csv =
    "\ufeff" +
    rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${fileName}_${new Date().toISOString().split("T")[0]}.csv`);

  onToast?.("Export CSV", "Téléchargement CSV démarré", "success");
};

export const exportToWord = ({ data, columns, fileName = "export", title = "Export", onToast }) => {
  const { head, body } = buildTable(data, columns);

  const headerHtml = `
    <tr>
      ${head
        .map((h) => `<th style="padding:8px;border:1px solid #ddd;">${escapeHtml(h)}</th>`)
        .join("")}
    </tr>`;

  const rowsHtml = body
    .map(
      (row) => `
    <tr>
      ${row
        .map((cell) => `<td style="padding:8px;border:1px solid #ddd;">${escapeHtml(cell)}</td>`)
        .join("")}
    </tr>`
    )
    .join("");

  const html = `
    <html>
      <head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
      <body>
        <h2>${escapeHtml(title)}</h2>
        <table style="border-collapse:collapse;width:100%;">${headerHtml}${rowsHtml}</table>
      </body>
    </html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  downloadBlob(blob, `${fileName}_${new Date().toISOString().split("T")[0]}.doc`);

  onToast?.("Export Word", "Téléchargement Word démarré", "success");
};

export const exportToPDF = async ({
  data,
  columns,
  fileName = "export",
  title = "Export",
  orientation = "landscape",
  onToast,
}) => {
  onToast?.("Export PDF", "Génération du PDF...", "info");

  try {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);

    const { head, body } = buildTable(data, columns);

    const doc = new jsPDF({ orientation, unit: "pt", format: "a4" });
    doc.setFontSize(12);
    doc.text(String(title), 40, 30);

    autoTable(doc, {
      startY: 45,
      head: [head],
      body,
      styles: { fontSize: 9, cellPadding: 4 },
    });

    doc.save(`${fileName}_${new Date().toISOString().split("T")[0]}.pdf`);
    onToast?.("Export PDF", "PDF généré avec succès", "success");
  } catch (e) {
    console.error(e);
    onToast?.(
      "Export PDF",
      'Erreur PDF. Installe "jspdf" et "jspdf-autotable" puis redémarre Vite.',
      "danger"
    );
  }
};
