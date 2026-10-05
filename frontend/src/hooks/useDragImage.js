import { useState } from "react";

export function useDragImage(setImage) {
  const [isDragging, setIsDragging] = useState(false);

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage({
        preview: URL.createObjectURL(file),
        mimeType: file.type,
        data: reader.result.split(",")[1],
      });
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    readFile(file);
  };

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    readFile,
  };
}