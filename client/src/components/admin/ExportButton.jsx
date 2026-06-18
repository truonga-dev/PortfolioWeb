import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ExportButton = ({ data, filename = 'export' }) => {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }
    setExporting(true);
    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Exported CSV!');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }
    setExporting(true);
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Exported JSON!');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportToCSV} disabled={exporting}
        className="px-3 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg text-xs flex items-center gap-1 hover:bg-green-600/30">
        <FiDownload size={12} /> CSV
      </button>
      <button onClick={exportToJSON} disabled={exporting}
        className="px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs flex items-center gap-1 hover:bg-blue-600/30">
        <FiDownload size={12} /> JSON
      </button>
    </div>
  );
};

export default ExportButton;