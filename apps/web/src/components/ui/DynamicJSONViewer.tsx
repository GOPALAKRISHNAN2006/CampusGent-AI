import React, { useState } from 'react';
import { ChevronDown, ChevronRight, List, Type, Hash, Box, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility to safely check if a value is an object
const isObject = (val: any): val is Record<string, any> => val !== null && typeof val === 'object' && !Array.isArray(val);

interface Props {
  data: any;
  title?: string;
  defaultExpanded?: boolean;
}

export const DynamicJSONViewer: React.FC<Props> = ({ data, title, defaultExpanded = true }) => {
  if (data === null || data === undefined) {
    return <div className="text-gray-500 italic text-sm">No data available</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-brand-100 shadow-sm overflow-hidden text-sm w-full">
      {title && (
        <div className="bg-brand-50 border-b border-brand-100 px-4 py-3 flex items-center gap-2">
          <Box className="h-4 w-4 text-brand-600" />
          <h3 className="font-semibold text-brand-900">{title}</h3>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <RenderNode value={data} name="root" isRoot defaultExpanded={defaultExpanded} />
      </div>
    </div>
  );
};

const RenderNode: React.FC<{ value: any; name?: string; isRoot?: boolean; defaultExpanded?: boolean }> = ({ value, name, isRoot, defaultExpanded }) => {
  if (Array.isArray(value)) {
    return <ArrayNode value={value} name={name} isRoot={isRoot} defaultExpanded={defaultExpanded} />;
  } else if (isObject(value)) {
    return <ObjectNode value={value} name={name} isRoot={isRoot} defaultExpanded={defaultExpanded} />;
  } else {
    return <ValueNode value={value} name={name} />;
  }
};

const ObjectNode: React.FC<{ value: Record<string, any>; name?: string; isRoot?: boolean; defaultExpanded?: boolean }> = ({ value, name, isRoot, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded ?? true);
  const keys = Object.keys(value);

  if (keys.length === 0) {
    return (
      <div className="flex items-center gap-2 py-1">
        {name && !isRoot && <span className="font-semibold text-brand-700">{formatKey(name)}:</span>}
        <span className="text-gray-400 italic">Empty</span>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col", !isRoot && "ml-4 mt-1 border-l border-brand-100 pl-3")}>
      {!isRoot && name && (
        <div 
          className="flex items-center gap-1.5 cursor-pointer hover:bg-brand-50 py-1 px-2 -ml-2 rounded text-brand-800 select-none group"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-brand-400 group-hover:text-brand-600" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-brand-400 group-hover:text-brand-600" />
          )}
          <span className="font-semibold capitalize text-brand-900">{formatKey(name)}</span>
          <span className="text-xs text-brand-400 ml-1">({keys.length} items)</span>
        </div>
      )}
      
      {expanded && (
        <div className={clsx("flex flex-col gap-1.5", isRoot ? "mt-0" : "mt-1")}>
          {keys.map((key) => (
            <RenderNode key={key} value={value[key]} name={key} defaultExpanded={defaultExpanded} />
          ))}
        </div>
      )}
    </div>
  );
};

const ArrayNode: React.FC<{ value: any[]; name?: string; isRoot?: boolean; defaultExpanded?: boolean }> = ({ value, name, isRoot, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded ?? true);

  if (value.length === 0) {
    return (
      <div className="flex items-center gap-2 py-1">
        {name && !isRoot && <span className="font-semibold text-brand-700">{formatKey(name)}:</span>}
        <span className="text-gray-400 italic">Empty List</span>
      </div>
    );
  }

  // Check if it's a simple array (strings/numbers only)
  const isSimpleArray = value.every((item) => typeof item === 'string' || typeof item === 'number');

  return (
    <div className={clsx("flex flex-col", !isRoot && "ml-4 mt-1 border-l border-brand-100 pl-3")}>
      {!isRoot && name && (
        <div 
          className="flex items-center gap-1.5 cursor-pointer hover:bg-brand-50 py-1 px-2 -ml-2 rounded text-brand-800 select-none group"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-brand-400 group-hover:text-brand-600" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-brand-400 group-hover:text-brand-600" />
          )}
          <List className="h-3.5 w-3.5 text-indigo-500" />
          <span className="font-semibold capitalize text-brand-900">{formatKey(name)}</span>
          <span className="text-xs text-brand-400 ml-1">({value.length} items)</span>
        </div>
      )}

      {expanded && (
        <div className={clsx("flex flex-col gap-1.5", isRoot ? "mt-0" : "mt-1")}>
          {isSimpleArray ? (
            <ul className="list-none space-y-1 ml-2">
              {value.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-brand-700 bg-brand-50/50 py-1 px-2 rounded-md border border-brand-100/50">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{String(item)}</span>
                </li>
              ))}
            </ul>
          ) : (
            value.map((item, index) => (
              <div key={index} className="bg-brand-50/30 p-2 rounded-lg border border-brand-100/50">
                <RenderNode value={item} name={`Item ${index + 1}`} isRoot={true} defaultExpanded={defaultExpanded} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const ValueNode: React.FC<{ value: any; name?: string }> = ({ value, name }) => {
  let displayValue = String(value);
  let valueColor = 'text-brand-800';
  let Icon = null;

  if (typeof value === 'boolean') {
    valueColor = value ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
    displayValue = value ? 'True' : 'False';
  } else if (typeof value === 'number') {
    valueColor = 'text-blue-600 font-medium';
    Icon = Hash;
  } else if (typeof value === 'string') {
    valueColor = 'text-gray-700';
  } else if (value === null) {
    valueColor = 'text-gray-400 italic';
    displayValue = 'null';
  } else if (value === undefined) {
    valueColor = 'text-gray-400 italic';
    displayValue = 'undefined';
  }

  return (
    <div className="flex items-start gap-2 py-1 px-2 hover:bg-brand-50/50 rounded transition-colors">
      {name && (
        <span className="font-semibold text-brand-900 whitespace-nowrap min-w-[120px] capitalize">
          {formatKey(name)}:
        </span>
      )}
      <div className="flex items-center gap-1.5 flex-1 break-words">
        {Icon && <Icon className="h-3 w-3 text-brand-400 shrink-0" />}
        <span className={valueColor}>{displayValue}</span>
      </div>
    </div>
  );
};

// Convert camelCase or snake_case to Title Case with spaces
const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};
