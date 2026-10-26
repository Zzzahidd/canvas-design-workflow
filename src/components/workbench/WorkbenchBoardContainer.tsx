import React, { useState } from 'react';
import { WorkbenchRoutineList } from './WorkbenchRoutineList';
import { WorkbenchRoutineDetail } from './WorkbenchRoutineDetail';
import { WorkbenchNewRoutine } from './WorkbenchNewRoutine';
import { WorkbenchChatView } from './WorkbenchChatView';
import { WorkbenchSkillsView } from './WorkbenchSkillsView';
import { WorkbenchMemoryView } from './WorkbenchMemoryView';
import { RotateCcw } from 'lucide-react';

export type WorkbenchScreen =
  | 'home'
  | 'chat'
  | 'list'
  | 'detail'
  | 'create'
  | 'skills'
  | 'memory';

interface WorkbenchBoardContainerProps {
  initialScreen: WorkbenchScreen;
}

export const WorkbenchBoardContainer: React.FC<WorkbenchBoardContainerProps> = ({
  initialScreen,
}) => {
  const [currentScreen, setCurrentScreen] = useState<WorkbenchScreen>(initialScreen);

  const screenTabs: Array<{ id: WorkbenchScreen; label: string }> = [
    { id: 'chat', label: 'Chat / Invoicing' },
    { id: 'list', label: '13 Routines list' },
    { id: 'detail', label: '14 Routine detail' },
    { id: 'create', label: '15 New routine' },
    { id: 'skills', label: 'Skills Registry' },
    { id: 'memory', label: 'Memory' },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
      case 'chat':
        return <WorkbenchChatView onNavigate={setCurrentScreen} />;
      case 'list':
        return <WorkbenchRoutineList onNavigate={setCurrentScreen} />;
      case 'detail':
        return <WorkbenchRoutineDetail onNavigate={setCurrentScreen} />;
      case 'create':
        return <WorkbenchNewRoutine onNavigate={setCurrentScreen} />;
      case 'skills':
        return <WorkbenchSkillsView onNavigate={setCurrentScreen} />;
      case 'memory':
        return <WorkbenchMemoryView onNavigate={setCurrentScreen} />;
      default:
        return <WorkbenchRoutineList onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#18181b] overflow-hidden">
      {/* Top Application Browser Tabs Bar */}
      <div className="h-7 bg-zinc-100 dark:bg-[#121214] border-b border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-between shrink-0 select-none text-[11px]">
        {/* Left: Window Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {screenTabs.map((tab) => {
            const isActive = currentScreen === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentScreen(tab.id)}
                className={`px-2 py-0.5 rounded-t-md text-[10px] font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 border-t border-l border-r border-zinc-200 dark:border-zinc-800 shadow-2xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Reset View to Reference Default */}
        {currentScreen !== initialScreen && (
          <button
            type="button"
            onClick={() => setCurrentScreen(initialScreen)}
            title="Reset board to default reference view"
            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Default</span>
          </button>
        )}
      </div>

      {/* Screen View Body */}
      <div className="flex-1 w-full overflow-hidden">
        {renderScreen()}
      </div>
    </div>
  );
};
