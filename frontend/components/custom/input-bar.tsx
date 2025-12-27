"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Globe,
  GraduationCap,
  Mic,
  Paperclip,
  Activity,
  X,
  FileText,
} from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Attachment {
  file: File;
  preview?: string;
}

export function InputBar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [adviceMode, setAdviceMode] = useState<string>("Get Advice");
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const handleFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      let preview: string | undefined;

      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file);
      }

      setAttachment({ file, preview });
    }
  };

  const removeAttachment = () => {
    if (attachment?.preview) {
      URL.revokeObjectURL(attachment.preview);
    }
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-background/95 backdrop-blur-md pb-4 sm:pb-6 sticky bottom-0 z-10 w-full mb-2 sm:mb-6">
      <div className="max-w-4xl mx-auto w-full bg-secondary/30 border border-border/50 rounded-[1.5rem] sm:rounded-3xl p-2 sm:p-3 flex flex-col gap-2 sm:gap-3 shadow-lg transition-all focus-within:shadow-xl focus-within:ring-1 focus-within:ring-ring/20">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {attachment && (
          <div className="mx-2 mt-2 relative inline-flex items-center gap-2 p-2 bg-secondary/50 rounded-xl border border-border/50 max-w-fit animate-in fade-in zoom-in-95 duration-200">
            {attachment.preview ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50">
                <Image
                  src={attachment.preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-sm font-medium truncate max-w-[150px]">
                {attachment.file.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {(attachment.file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button
              onClick={removeAttachment}
              className="absolute -top-2 -right-2 p-1 bg-background border border-border rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <textarea
          placeholder="Ask anything..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[24px] px-2 py-1 text-sm sm:text-base outline-none placeholder:text-muted-foreground"
          rows={1}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsWebSearchEnabled(!isWebSearchEnabled)}
              className={cn(
                "rounded-full h-8 px-3 gap-2 cursor-pointer border transition-all duration-200 text-xs font-normal",
                isWebSearchEnabled
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
                  : "bg-background/50 text-muted-foreground border-border/50 hover:bg-accent hover:text-foreground"
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              Web search
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full h-8 px-3 gap-2 cursor-pointer border transition-all duration-200 text-xs font-normal",
                    adviceMode !== "Get Advice"
                      ? "bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20"
                      : "bg-background/50 text-muted-foreground border-border/50 hover:bg-accent hover:text-foreground"
                  )}
                >
                  {adviceMode === "Doctor Mode" ? (
                    <Activity className="w-3.5 h-3.5" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5" />
                  )}
                  {adviceMode}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[180px]">
                <DropdownMenuItem onClick={() => setAdviceMode("Get Advice")}>
                  <GraduationCap className="w-4 h-4 mr-2 text-pink-500" />
                  Get Advice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAdviceMode("Doctor Mode")}>
                  <Activity className="w-4 h-4 mr-2 text-emerald-500" />
                  Doctor Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full cursor-pointer transition-colors",
                attachment
                  ? "text-primary bg-primary/10 hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleFileInput}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <div className="bg-white rounded-full p-1 cursor-pointer hover:opacity-90 transition-opacity">
              <Mic className="w-5 h-5 text-black m-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
