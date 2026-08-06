"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import {
  ArrowUpToLine,
  ArrowDownToLine,
  Trash2,
  ArrowLeftToLine,
  ArrowRightToLine,
  Columns3,
  Rows3,
  Combine,
  Scissors,
  Table as TableIcon,
} from "lucide-react";

interface TableFloatingToolbarProps {
  editor: Editor;
}

const ADMIN_HEADER_HEIGHT = 64;
const MAIN_TOOLBAR_HEIGHT = 75;
const FIXED_TOP = ADMIN_HEADER_HEIGHT + MAIN_TOOLBAR_HEIGHT;

export function TableFloatingToolbar({ editor }: TableFloatingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [canMerge, setCanMerge] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const [editorCenterX, setEditorCenterX] = useState(0);
  const [editorLeft, setEditorLeft] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateState = useCallback(() => {
    const inTable = editor.isActive("table");
    setIsVisible(inTable);

    if (inTable) {
      setCanMerge(editor.can().mergeCells());
      setCanSplit(editor.can().splitCell());

      const editorView = editor.view;
      const editorEl = editorView.dom.closest(".tiptap-editor-content");
      if (editorEl) {
        const rect = editorEl.getBoundingClientRect();
        setEditorCenterX(rect.left + rect.width / 2);
        setEditorLeft(rect.left);
        setEditorWidth(rect.width);
      }
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor.on("selectionUpdate", updateState);
    editor.on("transaction", updateState);

    return () => {
      editor.off("selectionUpdate", updateState);
      editor.off("transaction", updateState);
    };
  }, [editor, updateState]);

  if (!isVisible) return null;

  const exec = (cmd: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    cmd();
  };

  const TButton = ({
    onClick,
    title,
    children,
    disabled,
  }: {
    onClick: (e: React.MouseEvent) => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className="h-7 w-7 p-0 text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div
      ref={containerRef}
      className="table-floating-toolbar"
      style={{
        position: "fixed",
        top: FIXED_TOP,
        left: editorLeft,
        width: editorWidth,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="flex items-center gap-0.5">
        <span className="text-[10px] font-medium text-muted-foreground px-1 select-none hidden sm:inline">
          Rows
        </span>
        <TButton
          title="Insert Row Above"
          onClick={exec(() =>
            editor.chain().focus().addRowBefore().run()
          )}
        >
          <ArrowUpToLine className="h-3.5 w-3.5" />
        </TButton>
        <TButton
          title="Insert Row Below"
          onClick={exec(() =>
            editor.chain().focus().addRowAfter().run()
          )}
        >
          <ArrowDownToLine className="h-3.5 w-3.5" />
        </TButton>
        <TButton
          title="Delete Row"
          onClick={exec(() =>
            editor.chain().focus().deleteRow().run()
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </TButton>

        <div className="w-px h-5 bg-border mx-1" />

        <span className="text-[10px] font-medium text-muted-foreground px-1 select-none hidden sm:inline">
          Columns
        </span>
        <TButton
          title="Insert Column Before"
          onClick={exec(() =>
            editor.chain().focus().addColumnBefore().run()
          )}
        >
          <ArrowLeftToLine className="h-3.5 w-3.5" />
        </TButton>
        <TButton
          title="Insert Column After"
          onClick={exec(() =>
            editor.chain().focus().addColumnAfter().run()
          )}
        >
          <ArrowRightToLine className="h-3.5 w-3.5" />
        </TButton>
        <TButton
          title="Delete Column"
          onClick={exec(() =>
            editor.chain().focus().deleteColumn().run()
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </TButton>

        <div className="w-px h-5 bg-border mx-1" />

        <TButton
          title="Toggle Header Row"
          onClick={exec(() =>
            editor.chain().focus().toggleHeaderRow().run()
          )}
        >
          <Rows3 className="h-3.5 w-3.5" />
        </TButton>
        <TButton
          title="Toggle Header Column"
          onClick={exec(() =>
            editor.chain().focus().toggleHeaderColumn().run()
          )}
        >
          <Columns3 className="h-3.5 w-3.5" />
        </TButton>
        <TButton
          title="Merge Cells"
          onClick={exec(() =>
            editor.chain().focus().mergeCells().run()
          )}
          disabled={!canMerge}
        >
          <Combine className="h-3.5 w-3.5" />
        </TButton>
        <TButton
          title="Split Cell"
          onClick={exec(() =>
            editor.chain().focus().splitCell().run()
          )}
          disabled={!canSplit}
        >
          <Scissors className="h-3.5 w-3.5" />
        </TButton>

        <div className="w-px h-5 bg-border mx-1" />

        <TButton
          title="Delete Table"
          onClick={exec(() =>
            editor.chain().focus().deleteTable().run()
          )}
        >
          <TableIcon className="h-3.5 w-3.5 text-destructive" />
        </TButton>
      </div>
    </div>
  );
}
