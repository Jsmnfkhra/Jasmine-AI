import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function ImageUpload({ onSelect }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onSelect(acceptedFiles[0]);
    }
  }, [onSelect]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed
        rounded-xl
        p-6
        cursor-pointer
        text-center
        transition

        ${
          isDragActive
            ? "border-cyan-400 bg-slate-800"
            : "border-slate-700"
        }
      `}
    >
      <input {...getInputProps()} />

      <p className="text-sm text-slate-300">
        Drag & Drop gambar di sini
      </p>

      <p className="text-xs text-slate-500 mt-2">
        atau klik untuk memilih file
      </p>
    </div>
  );
}

export default ImageUpload;