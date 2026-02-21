import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ReportData {
  title: string;
  columns: string[];
  rows: (string | number)[][];
}

export function exportPDF({ title, columns, rows }: ReportData) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [40, 46, 56] },
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

export function exportExcel({ title, columns, rows }: ReportData) {
  const wsData = [columns, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
  XLSX.writeFile(wb, `${title.replace(/\s+/g, "_")}.xlsx`);
}
