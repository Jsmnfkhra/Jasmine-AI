import { X } from "lucide-react";

function ImagePreview({
  image,
  onRemove,
}) {

  if (!image) return null;

  return (
    <div className="max-w-4xl mx-auto mb-3">

      <div className="relative inline-block">

        <img
          src={image.preview}
          alt="Preview"
          className="w-44 rounded-xl border border-slate-700"
        />

        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1"
        >
          <X size={16}/>
        </button>

      </div>

    </div>
  );

}

export default ImagePreview;