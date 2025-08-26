import { notify } from "src/imports/NotifyHandler";

export function printCSV(columns, rows, filename) {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  if (!filename) filename = `CSV_${dateStr}.csv`;
  else filename = `${filename}_${dateStr}.csv`;

  if (!columns || !rows || rows.length === 0) {
    notify.error("Não há dados para exportar.");
    return;
  }

  // Remove a coluna de ações
  const exportColumns = columns.filter(col => col.name !== 'actions');
  const headers = exportColumns.map(col => col.label);
  const dataRows = rows.map(row =>
    exportColumns.map(col => {
      let val = row[col.name] != null ? row[col.name] : '';
      if (typeof val === 'string') {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    })
  );
  const csvContent = [headers, ...dataRows].map(e => e.join(';')).join('\r\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  notify.success("Arquivo CSV gerado com sucesso.");
}

export function printHTML(columns, rows, filename) {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const dateTimeStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  if (!filename) filename = `HTML_${dateStr}.html`;
  else filename = `${filename}_${dateStr}.html`;

  if (!columns || !rows || rows.length === 0) {
    notify.error("Não há dados para exportar.");
    return;
  }

  const exportColumns = columns.filter(col => col.name !== 'actions');
  const headers = exportColumns.map(col => `<th>${col.label}</th>`).join('');
  const dataRows = rows.map(row =>
    `<tr>${exportColumns.map(col => {
      let val = row[col.name] != null ? row[col.name] : '';
      if (typeof val === 'string') {
        val = val.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
      return `<td>${val}</td>`;
    }).join('')}</tr>`
  ).join('');

  // Subtítulo com o nome dos dados (labels das colunas)
  const subTitle = exportColumns.map(col => col.label).join(', ');

  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          header { text-align: center; margin-bottom: 30px; }
          .subtitle { text-align: center; font-size: 1.1em; color: #555; margin-bottom: 20px; }
          footer { text-align: center; margin-top: 30px; color: #888; font-size: 0.95em; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f4f4f4; }
        </style>
      </head>
      <body>
        <header>
          <h1>RELATÓRIO</h1>
        </header>
        <div class="subtitle">${subTitle}</div>
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${dataRows}</tbody>
        </table>
        <footer>
          hadvoga.com.br &mdash; Impresso em ${dateTimeStr}
        </footer>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  notify.success("Arquivo HTML gerado com sucesso.");
}

export async function printPDF(columns, rows, filename) {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const dateTimeStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  if (!filename) filename = `PDF_${dateStr}.pdf`;
  else filename = `${filename}_${dateStr}.pdf`;

  if (!columns || !rows || rows.length === 0) {
    notify.error("Não há dados para exportar.");
    return;
  }

  let jsPDF, autoTable;
  try {
    jsPDF = (await import('jspdf')).jsPDF;
    autoTable = (await import('jspdf-autotable')).default;
  } catch (e) {
    notify.error("jsPDF ou jsPDF-AutoTable não está disponível: " + e.message);
    return;
  }

  const exportColumns = columns.filter(col => col.name !== 'actions');
  const headers = exportColumns.map(col => ({ header: col.label, dataKey: col.name }));
  const dataRows = rows.map(row => {
    const obj = {};
    exportColumns.forEach(col => {
      let val = row[col.name] != null ? row[col.name] : '';
      if (typeof val === 'string') {
        val = val.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
      obj[col.name] = val;
    });
    return obj;
  });

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'A4'
  });

  doc.setFont('helvetica');
  doc.setFontSize(18);
  doc.text('RELATÓRIO', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

  doc.setFontSize(12);
  const subTitle = exportColumns.map(col => col.label).join(', ');
  doc.text(subTitle, doc.internal.pageSize.getWidth() / 2, 75, { align: 'center' });

  autoTable(doc, {
    startY: 100,
    head: [headers.map(h => h.header)],
    body: dataRows.map(row => headers.map(h => row[h.dataKey])),
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [240, 240, 240], textColor: 20 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 40, right: 40 }
  });

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`hadvoga.com.br — Impresso em ${dateTimeStr}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 30, { align: 'center' });

  doc.save(filename);
  notify.success("Arquivo PDF gerado com sucesso.");
}
