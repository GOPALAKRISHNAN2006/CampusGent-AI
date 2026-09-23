import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, List, Hash, Box, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
// Utility to safely check if a value is an object
const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);
export const DynamicJSONViewer = ({ data, title, defaultExpanded = true }) => {
    if (data === null || data === undefined) {
        return _jsx("div", { className: "text-gray-500 italic text-sm", children: "No data available" });
    }
    return (_jsxs("div", { className: "bg-white rounded-xl border border-brand-100 shadow-sm overflow-hidden text-sm w-full", children: [title && (_jsxs("div", { className: "bg-brand-50 border-b border-brand-100 px-4 py-3 flex items-center gap-2", children: [_jsx(Box, { className: "h-4 w-4 text-brand-600" }), _jsx("h3", { className: "font-semibold text-brand-900", children: title })] })), _jsx("div", { className: "p-4 overflow-x-auto", children: _jsx(RenderNode, { value: data, name: "root", isRoot: true, defaultExpanded: defaultExpanded }) })] }));
};
const RenderNode = ({ value, name, isRoot, defaultExpanded }) => {
    if (Array.isArray(value)) {
        return _jsx(ArrayNode, { value: value, name: name, isRoot: isRoot, defaultExpanded: defaultExpanded });
    }
    else if (isObject(value)) {
        return _jsx(ObjectNode, { value: value, name: name, isRoot: isRoot, defaultExpanded: defaultExpanded });
    }
    else {
        return _jsx(ValueNode, { value: value, name: name });
    }
};
const ObjectNode = ({ value, name, isRoot, defaultExpanded }) => {
    const [expanded, setExpanded] = useState(defaultExpanded ?? true);
    const keys = Object.keys(value);
    if (keys.length === 0) {
        return (_jsxs("div", { className: "flex items-center gap-2 py-1", children: [name && !isRoot && _jsxs("span", { className: "font-semibold text-brand-700", children: [formatKey(name), ":"] }), _jsx("span", { className: "text-gray-400 italic", children: "Empty" })] }));
    }
    return (_jsxs("div", { className: clsx("flex flex-col", !isRoot && "ml-4 mt-1 border-l border-brand-100 pl-3"), children: [!isRoot && name && (_jsxs("div", { className: "flex items-center gap-1.5 cursor-pointer hover:bg-brand-50 py-1 px-2 -ml-2 rounded text-brand-800 select-none group", onClick: () => setExpanded(!expanded), children: [expanded ? (_jsx(ChevronDown, { className: "h-3.5 w-3.5 text-brand-400 group-hover:text-brand-600" })) : (_jsx(ChevronRight, { className: "h-3.5 w-3.5 text-brand-400 group-hover:text-brand-600" })), _jsx("span", { className: "font-semibold capitalize text-brand-900", children: formatKey(name) }), _jsxs("span", { className: "text-xs text-brand-400 ml-1", children: ["(", keys.length, " items)"] })] })), expanded && (_jsx("div", { className: clsx("flex flex-col gap-1.5", isRoot ? "mt-0" : "mt-1"), children: keys.map((key) => (_jsx(RenderNode, { value: value[key], name: key, defaultExpanded: defaultExpanded }, key))) }))] }));
};
const ArrayNode = ({ value, name, isRoot, defaultExpanded }) => {
    const [expanded, setExpanded] = useState(defaultExpanded ?? true);
    if (value.length === 0) {
        return (_jsxs("div", { className: "flex items-center gap-2 py-1", children: [name && !isRoot && _jsxs("span", { className: "font-semibold text-brand-700", children: [formatKey(name), ":"] }), _jsx("span", { className: "text-gray-400 italic", children: "Empty List" })] }));
    }
    // Check if it's a simple array (strings/numbers only)
    const isSimpleArray = value.every((item) => typeof item === 'string' || typeof item === 'number');
    return (_jsxs("div", { className: clsx("flex flex-col", !isRoot && "ml-4 mt-1 border-l border-brand-100 pl-3"), children: [!isRoot && name && (_jsxs("div", { className: "flex items-center gap-1.5 cursor-pointer hover:bg-brand-50 py-1 px-2 -ml-2 rounded text-brand-800 select-none group", onClick: () => setExpanded(!expanded), children: [expanded ? (_jsx(ChevronDown, { className: "h-3.5 w-3.5 text-brand-400 group-hover:text-brand-600" })) : (_jsx(ChevronRight, { className: "h-3.5 w-3.5 text-brand-400 group-hover:text-brand-600" })), _jsx(List, { className: "h-3.5 w-3.5 text-indigo-500" }), _jsx("span", { className: "font-semibold capitalize text-brand-900", children: formatKey(name) }), _jsxs("span", { className: "text-xs text-brand-400 ml-1", children: ["(", value.length, " items)"] })] })), expanded && (_jsx("div", { className: clsx("flex flex-col gap-1.5", isRoot ? "mt-0" : "mt-1"), children: isSimpleArray ? (_jsx("ul", { className: "list-none space-y-1 ml-2", children: value.map((item, index) => (_jsxs("li", { className: "flex items-start gap-2 text-brand-700 bg-brand-50/50 py-1 px-2 rounded-md border border-brand-100/50", children: [_jsx(CheckCircle, { className: "h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" }), _jsx("span", { children: String(item) })] }, index))) })) : (value.map((item, index) => (_jsx("div", { className: "bg-brand-50/30 p-2 rounded-lg border border-brand-100/50", children: _jsx(RenderNode, { value: item, name: `Item ${index + 1}`, isRoot: true, defaultExpanded: defaultExpanded }) }, index)))) }))] }));
};
const ValueNode = ({ value, name }) => {
    let displayValue = String(value);
    let valueColor = 'text-brand-800';
    let Icon = null;
    if (typeof value === 'boolean') {
        valueColor = value ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
        displayValue = value ? 'True' : 'False';
    }
    else if (typeof value === 'number') {
        valueColor = 'text-blue-600 font-medium';
        Icon = Hash;
    }
    else if (typeof value === 'string') {
        valueColor = 'text-gray-700';
    }
    else if (value === null) {
        valueColor = 'text-gray-400 italic';
        displayValue = 'null';
    }
    else if (value === undefined) {
        valueColor = 'text-gray-400 italic';
        displayValue = 'undefined';
    }
    return (_jsxs("div", { className: "flex items-start gap-2 py-1 px-2 hover:bg-brand-50/50 rounded transition-colors", children: [name && (_jsxs("span", { className: "font-semibold text-brand-900 whitespace-nowrap min-w-[120px] capitalize", children: [formatKey(name), ":"] })), _jsxs("div", { className: "flex items-center gap-1.5 flex-1 break-words", children: [Icon && _jsx(Icon, { className: "h-3 w-3 text-brand-400 shrink-0" }), _jsx("span", { className: valueColor, children: displayValue })] })] }));
};
// Convert camelCase or snake_case to Title Case with spaces
const formatKey = (key) => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};
