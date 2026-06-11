import { useEffect, useRef, useState } from "react";
import { isValidHexColor, normalizeHexColor } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [hue, setHue] = useState(270);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(55);
  const [hexInput, setHexInput] = useState(normalizeHexColor(color));
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(normalizeHexColor(color));
  }, [color]);

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const colorValue = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * colorValue)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const updateColor = (nextColor: string) => {
    setHexInput(nextColor);
    onChange(nextColor);
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
    updateColor(hslToHex(hue, newSaturation, newLightness));
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    updateColor(hslToHex(newHue, saturation, lightness));
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setHexInput(value);

    if (isValidHexColor(value)) {
      onChange(normalizeHexColor(value));
    }
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
      <div>
        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
          Hex
        </label>
        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          placeholder="#7C3AED"
          maxLength={7}
          className={`w-full px-3 py-2 border rounded-lg font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
            isValidHexColor(hexInput) || hexInput === ""
              ? "border-gray-300"
              : "border-red-300"
          }`}
        />
      </div>
    </div>
  );
}
