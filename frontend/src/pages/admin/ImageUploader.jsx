import { useState, useRef } from "react";
import { toast } from "react-hot-toast";

const ImageUploader = ({
  existingImages = [],
  setExistingImages,
  images,
  setImages,
}) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  return (
    <div>
      <label className="block mb-2 font-medium">Product Images</label>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const newFiles = Array.from(e.target.files);
          // Maximum 10 images
          if (images.length + newFiles.length > 10) {
            toast.error("You can upload a maximum of 10 images.");
            e.target.value = "";
            return;
          }

          // Validate each image
          for (const file of newFiles) {
            if (!file.type.startsWith("image/")) {
              toast.error(`${file.name} is not a valid image.`);
              e.target.value = "";
              return;
            }

            if (file.size > 5 * 1024 * 1024) {
              toast.error(`${file.name} must be smaller than 5 MB.`);
              e.target.value = "";
              return;
            }
          }

          const updatedImages = [...images, ...newFiles];

          setImages(updatedImages);

          setImagePreviews((prev) => [
            ...prev,
            ...newFiles.map((file) => URL.createObjectURL(file)),
          ]);

          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
      >
        + Upload Images
      </button>

      {existingImages.length > 0 && (
        <div className="mt-5">
          <h3 className="font-semibold text-gray-700 mb-3">
            Current Images ({existingImages.length})
          </h3>

          <div className="flex flex-wrap gap-3">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Current ${index + 1}`}
                  className="w-28 h-28 object-cover rounded-xl border shadow-sm"
                />

                <button
                  type="button"
                  onClick={() => {
                    setExistingImages?.(
                      existingImages.filter((_, i) => i !== index),
                    );
                  }}
                  className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white font-bold shadow hover:bg-red-700 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-28 h-28 object-cover rounded-xl border shadow-sm"
              />

              <button
                type="button"
                onClick={() => {
                  setImagePreviews((prev) =>
                    prev.filter((_, i) => i !== index),
                  );

                  setImages(images.filter((_, i) => i !== index));
                }}
                className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white font-bold shadow hover:bg-red-700 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-5">
          <h3 className="font-semibold text-gray-700 mb-3">
            Selected Images ({images.length})
          </h3>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
