import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDF = items => {
  const doc = new jsPDF();

  const tableColumn = ['Id', 'Department Name', 'Department Code', 'Alias', 'Status'];
  const tableRows = [];

  items.map(item => {
    const Data = [item.id, item.departmentName, item.departmentCode, item.alias, item.status];
    tableRows.push(Data);
  });

  doc.autoTable(tableColumn, tableRows, { startY: 20 });

  doc.save('report.pdf');
};

export default PDF;
