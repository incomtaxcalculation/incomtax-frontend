"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useAdminEdit } from "./AdminEditContext";

interface EditableFieldProps {
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  as?: "span" | "div" | "h2" | "h3" | "p";
  children?: ReactNode;
}

export default function EditableField({
  value,
  onChange,
  multiline = false,
  className = "",
  placeholder = "Click to edit...",
  as = "span",
  children,
}: EditableFieldProps) {
  const { isEditing } = useAdminEdit();
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [editing]);

  if (!isEditing) {
    if (children) return <>{children}</>;
    const Tag = as;
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => {
            setEditing(false);
            if (localValue !== value) onChange(localValue);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setLocalValue(value);
              setEditing(false);
            }
          }}
          className={`w-full resize-none bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none p-0 m-0 ${className}`}
          placeholder={placeholder}
          rows={2}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (localValue !== value) onChange(localValue);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(false);
            if (localValue !== value) onChange(localValue);
          }
          if (e.key === "Escape") {
            setLocalValue(value);
            setEditing(false);
          }
        }}
        className={`w-full bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none p-0 m-0 ${className}`}
        placeholder={placeholder}
      />
    );
  }

  const Tag = as;
  return (
    <Tag
      className={`cursor-pointer ${className}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
    </Tag>
  );
}
