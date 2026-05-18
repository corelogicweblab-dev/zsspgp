"use client";

import { useCallback, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", active && "bg-cyan-500/20 text-cyan-200")}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the full article…",
  className,
  minHeight = "200px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || el.innerHTML === value) return;
    el.innerHTML = value || "";
  }, [value]);

  const sync = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    onChange(html === "<br>" ? "" : html);
  }, [onChange]);

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    sync();
  };

  const addLink = () => {
    const url = window.prompt("Link URL (https://…)");
    if (url?.trim()) exec("createLink", url.trim());
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-cyan-500/25 bg-slate-950/60", className)}>
      <div className="flex flex-wrap gap-0.5 border-b border-cyan-500/15 bg-slate-900/80 p-1.5">
        <ToolbarButton onClick={() => exec("bold")} label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("italic")} label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("formatBlock", "h2")} label="Heading">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("insertUnorderedList")} label="Bullet list">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("insertOrderedList")} label="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addLink} label="Insert link">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
        data-placeholder={placeholder}
        onInput={sync}
        onBlur={sync}
        className={cn(
          "news-rich-editor prose-invert max-w-none px-4 py-3 text-sm leading-relaxed text-slate-200 outline-none",
          "empty:before:pointer-events-none empty:before:text-slate-500 empty:before:content-[attr(data-placeholder)]"
        )}
        style={{ minHeight }}
      />
    </div>
  );
}
