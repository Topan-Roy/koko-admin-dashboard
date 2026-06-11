import { useState, useRef, useEffect } from "react";
import { X, Upload, CameraOff } from "lucide-react";
import api from "@/Context/api";
import { toast } from "react-toastify";
import ColorPicker from "@/components/ui/ColorPicker";
import { normalizeHexColor } from "@/lib/utils";

/** For Avatar Management -> Avatars/Characters/etc: API expects image/icon + colors (JSON array of hex). */
export interface CharacterCategory {
  name?: string;
  color?: string;
}

export interface EditItem {
  _id: string;
  title?: string;
  icon?: string;
  imageUrl?: string;
  colors: string[];
  description?: string;
  category?: CharacterCategory;
}

interface AddAvatarModalProps<TSave = EditItem> {
  isOpen: boolean;
  onClose: () => void;
  apiEndpoint: string;
  categoryName?: string;
  onSave?: (data: TSave) => void;
  /** Avatar API: send image + colors as JSON; no title. */
  avatarMode?: boolean;
  /** When set, PATCH existing item (optional image + colors + title/desc/cat). */
  editItem?: EditItem | null;
}

const PRESET_SOLID_COLORS = [
  "#7C3AED",
  "#EC4899",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#14B8A6",
  "#8B5CF6",
  "#F43F5E",
  "#0EA5E9",
  "#22C55E",
  "#EAB308",
  "#84CC16",
  "#A855F7",
  "#64748B",
];

const PRESET_GRADIENTS: { color1: string; color2: string }[] = [
  { color1: "#7C3AED", color2: "#EC4899" },
  { color1: "#3B82F6", color2: "#8B5CF6" },
  { color1: "#10B981", color2: "#06B6D4" },
  { color1: "#F59E0B", color2: "#EF4444" },
  { color1: "#6366F1", color2: "#EC4899" },
  { color1: "#14B8A6", color2: "#3B82F6" },
];

const GRADIENT_PREVIEW_ANGLE = 135;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return fallback;
  }

  const response = (error as { response?: { data?: { message?: string } } })
    .response;
  return response?.data?.message || fallback;
};

export default function AddAvatarModal<TSave = EditItem>({
  isOpen,
  onClose,
  apiEndpoint,
  categoryName = "Item",
  onSave,
  avatarMode = false,
  editItem = null,
}: AddAvatarModalProps<TSave>) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("#7C3AED");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#7C3AED");
  const [backgroundColor2, setBackgroundColor2] = useState("#EC4899");
  const [isGradient, setIsGradient] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorPicker2, setShowColorPicker2] = useState(false);
  const [showCategoryColorPicker, setShowCategoryColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = editItem != null;
  const displayPreview =
    imagePreview ?? (isEditMode ? editItem!.imageUrl || editItem!.icon : null);

  useEffect(() => {
    if (isOpen && editItem) {
      setTitle(editItem.title || "");
      setDescription(editItem.description || "");
      setCategory(editItem.category?.name || "");
      setCategoryColor(
        editItem.category?.color
          ? normalizeHexColor(editItem.category.color)
          : "#7C3AED",
      );
      const c1 = editItem.colors?.[0];
      const c2 = editItem.colors?.[1];
      const hex1 = c1 ? (c1.startsWith("#") ? c1 : `#${c1}`) : "#7C3AED";
      const hex2 = c2 ? (c2.startsWith("#") ? c2 : `#${c2}`) : "#EC4899";
      setBackgroundColor(hex1);
      setBackgroundColor2(hex2);
      setIsGradient(!!(c1 && c2 && hex1.toLowerCase() !== hex2.toLowerCase()));
      setImage(null);
      setImagePreview(null);
    }
  }, [isOpen, editItem]);

  const gradientStyle = isGradient
    ? {
        background: `linear-gradient(${GRADIENT_PREVIEW_ANGLE}deg, ${backgroundColor}, ${backgroundColor2})`,
      }
    : { backgroundColor };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (avatarMode) {
      if (!isEditMode && !image) {
        toast.error("Image is required");
        return;
      }
    } else {
      if (!title.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!isEditMode && !image) {
        toast.error("Image is required");
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();

      if (avatarMode) {
        // Postman: colors = JSON array of hex codes. Solid = one color, gradient = two.
        const hex1 = backgroundColor.startsWith("#")
          ? backgroundColor
          : `#${backgroundColor}`;
        const hex2 = backgroundColor2.startsWith("#")
          ? backgroundColor2
          : `#${backgroundColor2}`;
        const colorsJson = JSON.stringify(isGradient ? [hex1, hex2] : [hex1]);
        formData.append("colors", colorsJson);
        if (image) formData.append("image", image);

        if (isEditMode && editItem) {
          const response = await api.patch(
            `${apiEndpoint}/${editItem._id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
          if (onSave && response.data?.data) {
            onSave(response.data.data as TSave);
          }
          toast.success("Avatar updated successfully!");
        } else {
          const response = await api.post(apiEndpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (onSave && response.data?.data) {
            onSave(response.data.data as TSave);
          }
          toast.success(`${categoryName} created successfully!`);
        }
        handleClose();
        return;
      }

      formData.append("title", title.trim());
      if (categoryName === "Character") {
        formData.append("description", description.trim());
        formData.append("category.name", category.trim());
        formData.append("category.color", normalizeHexColor(categoryColor));
      }
      if (image) {
        formData.append("icon", image);
      }
      const c1 = backgroundColor.replace("#", "");
      const c2 = backgroundColor2.replace("#", "");
      const colors = isGradient ? [c1, c2, c1] : [c1, c1, c1];
      colors.forEach((color, index) => {
        formData.append(`colors[${index}]`, color);
      });

      let response;
      if (isEditMode && editItem) {
        response = await api.patch(`${apiEndpoint}/${editItem._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`${categoryName} updated successfully!`);
      } else {
        response = await api.post(apiEndpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`${categoryName} created successfully!`);
      }

      if (onSave && response.data?.data) {
        const newItem =
          response.data.data.character ||
          response.data.data.place ||
          response.data.data.item ||
          response.data.data.theme ||
          response.data.data.songType ||
          response.data.data;
        onSave(newItem as TSave);
      }

      handleClose();
    } catch (error: unknown) {
      console.error(`Error saving ${categoryName}:`, error);
      toast.error(
        getErrorMessage(
          error,
          `Failed to save ${categoryName}. Please try again.`,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setCategoryColor("#7C3AED");
    setImage(null);
    setImagePreview(null);
    setBackgroundColor("#7C3AED");
    setBackgroundColor2("#EC4899");
    setIsGradient(false);
    setShowColorPicker(false);
    setShowColorPicker2(false);
    setShowCategoryColorPicker(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? `Edit ${categoryName}` : `Add ${categoryName}`}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex flex-col items-center">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg mb-2 overflow-hidden"
              style={gradientStyle}
            >
              {displayPreview ? (
                <img
                  src={displayPreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <CameraOff
                  className="text-white opacity-70"
                  size={40}
                  strokeWidth={1.5}
                />
              )}
            </div>
            <p className="text-xs text-gray-500 text-center">
              {displayPreview
                ? "Image with gradient background"
                : "Upload image to preview"}
            </p>
          </div>

          {!avatarMode && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm placeholder:text-gray-400"
                  required
                />
              </div>

              {categoryName === "Character" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Mischief Makers">Mischief Makers</option>
                        <option value="Adventurers & Heroes">
                          Adventurers & Heroes
                        </option>
                        <option value="Amazing Animals">Amazing Animals</option>
                        <option value="Magical Friends">Magical Friends</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setShowCategoryColorPicker(!showCategoryColorPicker)
                        }
                        className="h-9 w-11 shrink-0 rounded-lg border-2 border-gray-300 shadow-sm transition-all hover:scale-105 hover:border-purple-400"
                        style={{ backgroundColor: categoryColor }}
                        title={`Category color ${categoryColor}`}
                      />
                    </div>
                    {showCategoryColorPicker && (
                      <div className="mt-3">
                        <ColorPicker
                          color={categoryColor}
                          onChange={setCategoryColor}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter character description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm placeholder:text-gray-400 min-h-[80px]"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              {avatarMode ? "Avatar Image" : `${categoryName} Icon`}{" "}
              {avatarMode ? (
                isEditMode ? (
                  "(optional)"
                ) : (
                  <>
                    <span className="text-red-500">*</span>
                  </>
                )
              ) : isEditMode ? (
                "(optional)"
              ) : (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all"
            >
              <Upload
                className="mx-auto text-gray-400 mb-1.5"
                size={28}
                strokeWidth={1.5}
              />
              <p className="text-xs text-gray-600">
                {image ? image.name : "Click to upload image"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-medium text-gray-700">
                Background Color
              </label>
              <button
                onClick={() => setIsGradient(!isGradient)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  isGradient
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isGradient ? "Gradient Mode" : "Solid Mode"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-2">
              Quick pick — click to apply
            </p>
            <div className="mb-3">
              <p className="text-[11px] font-medium text-gray-600 mb-1.5">
                Solid colors
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SOLID_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => {
                      setIsGradient(false);
                      setBackgroundColor(hex);
                      setBackgroundColor2(hex);
                    }}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-purple-400 hover:scale-110 transition-all shadow-sm"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-[11px] font-medium text-gray-600 mb-1.5">
                Gradients
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_GRADIENTS.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setIsGradient(true);
                      setBackgroundColor(g.color1);
                      setBackgroundColor2(g.color2);
                    }}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-400 hover:scale-105 transition-all shadow-sm"
                    style={{
                      background: `linear-gradient(${GRADIENT_PREVIEW_ANGLE}deg, ${g.color1}, ${g.color2})`,
                    }}
                    title={`${g.color1} → ${g.color2}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-2">Or customize</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowColorPicker2(false);
                  }}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-purple-400 transition-all shadow-sm hover:scale-105"
                  style={{ backgroundColor }}
                />
              </div>

              {showColorPicker && (
                <div className="mb-3">
                  <ColorPicker
                    color={backgroundColor}
                    onChange={setBackgroundColor}
                  />
                </div>
              )}

              {isGradient && (
                <>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShowColorPicker2(!showColorPicker2);
                        setShowColorPicker(false);
                      }}
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-purple-400 transition-all shadow-sm hover:scale-105"
                      style={{ backgroundColor: backgroundColor2 }}
                    />
                  </div>

                  {showColorPicker2 && (
                    <div className="mb-3">
                      <ColorPicker
                        color={backgroundColor2}
                        onChange={setBackgroundColor2}
                      />
                    </div>
                  )}
                </>
              )}

              <div
                className="w-full h-12 rounded-lg shadow-sm"
                style={gradientStyle}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 pb-5 sticky bottom-0 bg-white pt-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              loading ||
              (avatarMode && !isEditMode && !image) ||
              (!avatarMode &&
                (!title.trim() ||
                  (!isEditMode && !image) ||
                  (categoryName === "Character" &&
                    (!category.trim() || !description.trim()))))
            }
            className="px-5 py-2 text-sm bg-gradient-to-r from-[#9458E8] via-[#A43EE7] to-[#CA00E5] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
