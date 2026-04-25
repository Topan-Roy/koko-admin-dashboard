import { useState, useRef, useEffect } from "react";
import { X, Upload, CameraOff } from "lucide-react";
import api from "@/Context/api";
import { toast } from "react-toastify";

/** For Avatar Management -> Avatars: API expects image + colors (JSON array of hex). */
export interface EditAvatar {
  _id: string;
  imageUrl: string;
  colors: string[];
}

interface AddAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiEndpoint: string;
  categoryName?: string;
  onSave?: (data: any) => void;
  /** Avatar API: send image + colors as JSON; no title. */
  avatarMode?: boolean;
  /** When set, PATCH existing avatar (optional image + colors). */
  editAvatar?: EditAvatar | null;
}

const PRESET_SOLID_COLORS = [
  "#7C3AED", "#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#14B8A6",
  "#8B5CF6", "#F43F5E", "#0EA5E9", "#22C55E", "#EAB308", "#84CC16", "#A855F7", "#64748B",
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

function ColorPicker({
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  const [hue, setHue] = useState(270);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(55);
  const gradientRef = useRef<HTMLDivElement>(null);

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return;
    const rect = gradientRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newSaturation = (x / rect.width) * 100;
    const newLightness = 100 - (y / rect.height) * 100;
    setSaturation(newSaturation);
    setLightness(newLightness);
    onChange(hslToHex(hue, newSaturation, newLightness));
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    onChange(hslToHex(newHue, saturation, lightness));
  };

  return (
    <div className="space-y-3">
      <div
        ref={gradientRef}
        onClick={handleGradientClick}
        className="w-full h-48 rounded-lg cursor-crosshair relative"
        style={{
          background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`,
        }}
      >
        <div
          className="absolute w-5 h-5 border-2 border-white rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${saturation}%`,
            top: `${100 - lightness}%`,
          }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={handleHueChange}
        className="w-full h-3 rounded-lg cursor-pointer appearance-none"
        style={{
          background:
            "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        }}
      />
    </div>
  );
}

export default function AddAvatarModal({
  isOpen,
  onClose,
  apiEndpoint,
  categoryName = "Item",
  onSave,
  avatarMode = false,
  editAvatar = null,
}: AddAvatarModalProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#7C3AED");
  const [backgroundColor2, setBackgroundColor2] = useState("#EC4899");
  const [isGradient, setIsGradient] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorPicker2, setShowColorPicker2] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = avatarMode && editAvatar != null;
  const displayPreview = imagePreview ?? (isEditMode ? editAvatar!.imageUrl : null);

  useEffect(() => {
    if (isOpen && editAvatar) {
      const c1 = editAvatar.colors?.[0];
      const c2 = editAvatar.colors?.[1];
      const hex1 = c1 ? (c1.startsWith("#") ? c1 : `#${c1}`) : "#7C3AED";
      const hex2 = c2 ? (c2.startsWith("#") ? c2 : `#${c2}`) : "#EC4899";
      setBackgroundColor(hex1);
      setBackgroundColor2(hex2);
      setIsGradient(!!(c1 && c2 && hex1.toLowerCase() !== hex2.toLowerCase()));
      setImage(null);
      setImagePreview(null);
    }
  }, [isOpen, editAvatar]);

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
      if (!image) {
        toast.error("Image is required");
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();

      if (avatarMode) {
        // Postman: colors = JSON array of hex codes. Solid = one color, gradient = two.
        const hex1 = backgroundColor.startsWith("#") ? backgroundColor : `#${backgroundColor}`;
        const hex2 = backgroundColor2.startsWith("#") ? backgroundColor2 : `#${backgroundColor2}`;
        const colorsJson = JSON.stringify(
          isGradient ? [hex1, hex2] : [hex1]
        );
        formData.append("colors", colorsJson);
        if (image) formData.append("image", image);

        if (isEditMode && editAvatar) {
          const response = await api.patch(
            `${apiEndpoint}/${editAvatar._id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          if (onSave && response.data?.data) onSave(response.data.data);
          toast.success("Avatar updated successfully!");
        } else {
          const response = await api.post(apiEndpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (onSave && response.data?.data) onSave(response.data.data);
          toast.success(`${categoryName} created successfully!`);
        }
        handleClose();
        return;
      }

      formData.append("title", title.trim());
      formData.append("icon", image!);
      const c1 = backgroundColor.replace("#", "");
      const c2 = backgroundColor2.replace("#", "");
      const colors = isGradient
        ? [c1, c2, c1]
        : [c1, c1, c1];
      colors.forEach((color, index) => {
        formData.append(`colors[${index}]`, color);
      });

      const response = await api.post(apiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onSave && response.data?.data) {
        const newItem =
          response.data.data.character ||
          response.data.data.place ||
          response.data.data.item ||
          response.data.data.theme ||
          response.data.data.songType ||
          response.data.data;
        onSave(newItem);
      }

      toast.success(`${categoryName} created successfully!`);
      handleClose();
    } catch (error: any) {
      console.error(`Error saving ${categoryName}:`, error);
      toast.error(
        error.response?.data?.message ||
          `Failed to save ${categoryName}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setImage(null);
    setImagePreview(null);
    setBackgroundColor("#7C3AED");
    setBackgroundColor2("#EC4899");
    setIsGradient(false);
    setShowColorPicker(false);
    setShowColorPicker2(false);
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
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Avatar Image {avatarMode ? (isEditMode ? "(optional)" : <><span className="text-red-500">*</span></>) : <span className="text-red-500">*</span>}
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

            <p className="text-xs text-gray-500 mb-2">Quick pick — click to apply</p>
            <div className="mb-3">
              <p className="text-[11px] font-medium text-gray-600 mb-1.5">Solid colors</p>
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
              <p className="text-[11px] font-medium text-gray-600 mb-1.5">Gradients</p>
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
            disabled={loading || (!avatarMode && (!title || !image)) || (avatarMode && !isEditMode && !image)}
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