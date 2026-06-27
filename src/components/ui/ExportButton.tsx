import React from 'react';

interface ExportButtonProps {
  onExport: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function ExportButton({ onExport, disabled = false, className = "" }: ExportButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onExport();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#9458E8] to-[#A43EE7] hover:from-[#8347d7] hover:to-[#933ee7] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-60 inter-font ${className}`}
    >
      <svg
        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {loading ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        )}
      </svg>
      {loading ? "Exporting..." : "Export to Excel"}
    </button>
  );
}
