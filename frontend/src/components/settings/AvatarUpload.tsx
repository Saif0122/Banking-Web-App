import React, { useState, useRef } from "react";
import { Upload, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  name: string;
  onUpload?: (file: File) => void;
  className?: string;
}

export function AvatarUpload({ currentAvatarUrl, name, onUpload, className }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    if (onUpload) {
      onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const clearAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Depending on backend, might need to trigger a clear event
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-6 items-start sm:items-center", className)}>
      <div
        onClick={triggerInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-all overflow-hidden bg-muted/50 group",
          isDragging ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Avatar Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
            {initials ? (
              <span className="text-2xl font-bold">{initials}</span>
            ) : (
              <User className="h-8 w-8" />
            )}
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <h4 className="text-sm font-medium">Profile Picture</h4>
        <p className="text-xs text-muted-foreground max-w-[250px]">
          We support PNG, JPG or SVG under 5MB. Click or drag to upload.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={triggerInput}
            className="text-sm font-medium text-primary hover:underline"
          >
            Upload image
          </button>
          {previewUrl && (
            <button
              type="button"
              onClick={clearAvatar}
              className="text-sm font-medium text-destructive hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
