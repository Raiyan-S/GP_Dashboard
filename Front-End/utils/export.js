export function exportToCSV(data, filename) {
  const headers = ['Round', 'Accuracy (%)', 'F1 Score (%)', 'Loss', 'Precision', 'Recall', 'Timestamp'];
  const rows = data.map((row, index) => [
    row.round,
    row.accuracy.toFixed(2),
    row.f1Score.toFixed(2),
    row.loss.toFixed(4),
    row.precision.toFixed(4),
    row.recall.toFixed(4),
    new Date(Date.now() - index * 86400000).toISOString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}