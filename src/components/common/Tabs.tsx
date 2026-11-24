import React from 'react';
import { clsx } from 'clsx';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  if (variant === 'pills') {
    return (
      <div className={clsx('flex items-center gap-1.5 p-1 bg-[#FAFAFA] rounded-xl border border-[#EEEEEE]', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none',
                isActive
                  ? 'bg-white text-[#202124] shadow-xs border border-zinc-200/60 font-semibold'
                  : 'text-[#747474] hover:text-[#202124] hover:bg-zinc-100/50'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.2 rounded-full',
                    isActive ? 'bg-[#FFF1F0] text-[#E54848]' : 'bg-zinc-200/60 text-zinc-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={clsx('flex border-b border-[#EEEEEE] gap-6', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 pb-3 text-sm font-medium transition-all relative border-b-2 select-none -mb-px',
              isActive
                ? 'border-[#E54848] text-[#E54848] font-semibold'
                : 'border-transparent text-[#747474] hover:text-[#202124]'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'text-[11px] px-2 py-0.5 rounded-full font-semibold',
                  isActive ? 'bg-[#FFF1F0] text-[#E54848]' : 'bg-zinc-100 text-zinc-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
