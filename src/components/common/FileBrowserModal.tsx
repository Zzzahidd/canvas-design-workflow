import React, { useState } from 'react';
import { ProjectFile, MOCK_PROJECT_FILES } from '@/types/contextData';
import {
  FileText,
  X,
  Download,
  Copy,
  Check,
  Paperclip,
  ExternalLink,
} from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface FileBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachFile?: (file: ProjectFile) => void;
  initialFileId?: string;
}

export const FileBrowserModal: React.FC<FileBrowserModalProps> = ({
  isOpen,
  onClose,
  onAttachFile,
  initialFileId = 'file-1',
}) => {
  const { showToast } = useRoutineStore();
  const [selectedFileId, setSelectedFileId] = useState<string>(initialFileId);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile =
    MOCK_PROJECT_FILES.find((f) => f.id === selectedFileId) ||
    MOCK_PROJECT_FILES[0];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + '#' + currentFile.name);
    setCopied(true);
    showToast(`Copied secure link for ${currentFile.name}`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    showToast(`Downloaded ${currentFile.name}`, 'success');
  };

  const handleAttach = () => {
    if (onAttachFile) {
      onAttachFile(currentFile);
    }
    showToast(`Attached ${currentFile.name} to chat context`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 select-none">
      <div className="bg-white dark:bg-[#1c1c1f] border border-zinc-300 dark:border-zinc-700 w-full max-w-4xl h-[620px] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans animate-fade-in">
        {/* Header Bar */}
        <div className="h-14 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-[#18181a] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Workspace File Browser & Viewer</div>
              <div className="text-[11px] text-zinc-400">
                Live files synced from billing, contracts, and tracking repositories
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Panel Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left File List */}
          <div className="w-72 border-r border-zinc-200 dark:border-zinc-800 bg-[#fbfbfb] dark:bg-[#151517] p-3 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-2 py-1">
                Open Files ({MOCK_PROJECT_FILES.length})
              </div>
              {MOCK_PROJECT_FILES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFileId(f.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                    selectedFileId === f.id
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium shadow-xs'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${
                    selectedFileId === f.id ? 'opacity-100' : 'text-zinc-400'
                  }`} />
                  <div className="truncate">
                    <div className="truncate leading-tight">{f.name}</div>
                    <div className={`text-[10px] mt-0.5 ${
                      selectedFileId === f.id
                        ? 'text-zinc-300 dark:text-zinc-600'
                        : 'text-zinc-400'
                    }`}>
                      {f.size} · {f.updatedAt}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400">
              Auto-synced with project storage
            </div>
          </div>

          {/* Right Preview Panel */}
          <div className="flex-1 flex flex-col justify-between bg-white dark:bg-[#1c1c1f] overflow-hidden">
            {/* File Info Bar */}
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>{currentFile.name}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 uppercase">
                    {currentFile.type}
                  </span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {currentFile.summary}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy link'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Document Data Content Render */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50/50 dark:bg-[#18181b]/50">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 font-semibold uppercase text-[10px] border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                      {Object.keys(currentFile.contentLines[0] || {}).map((header) => (
                        <th key={header} className="px-4 py-2.5 tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800">
                    {currentFile.contentLines.map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-100/40 dark:hover:bg-zinc-800/40 transition-colors">
                        {Object.values(row).map((val, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 ${
                              cellIdx === 0
                                ? 'font-medium text-zinc-900 dark:text-white'
                                : 'text-zinc-600 dark:text-zinc-300 font-mono text-[11px]'
                            }`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Attach Action Footer */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/40 dark:bg-[#18181a]/40">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Available to Thread, Workbench, and Desk</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAttach}
                  className="px-4 py-2 text-xs font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 flex items-center gap-1.5 transition-opacity shadow-xs"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach to Chat Context</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
