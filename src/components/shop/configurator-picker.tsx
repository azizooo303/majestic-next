/**
 * ConfiguratorPicker — 4-axis variant picker for family detail pages.
 * Renders ONE attribute (Config / Size / Finish / Leg) with appropriate UI.
 *
 * Drop this file in: src/components/shop/configurator-picker.tsx
 *
 * Composite usage on family page:
 *   <ConfiguratorPicker axis="Config" value={cfg} onChange={setCfg} options={...} displayMode="radio" />
 *   <ConfiguratorPicker axis="Size" value={sz} onChange={setSz} options={...} displayMode="radio" exclusions={excludedSizes} />
 *   <ConfiguratorPicker axis="Desk Top Finish" value={fin} onChange={setFin} options={DESK_TOP_FINISHES} displayMode="color-swatch" />
 *   <ConfiguratorPicker axis="Leg Color" value={leg} onChange={setLeg} options={LEG_COLORS} displayMode="radio" exclusions={excludedLegs} />
 */

"use client";

type PickerOption = {
  value: string;
  labelEn: string;
  labelAr: string;
  extraPrice?: number;
  swatchHex?: string;   // only for color-swatch mode
  swatchImage?: string; // optional texture preview
  isCustom?: boolean;   // triggers quote routing on Size axis
};

type ConfiguratorPickerProps = {
  axis: "Config" | "Size" | "Desk Top Finish" | "Leg Color" | "Side Unit Finish" | "Pedestal Finish";
  value: string;
  onChange: (val: string) => void;
  options: PickerOption[];
  displayMode: "radio" | "dropdown" | "color-swatch";
  locale: "en" | "ar";
  exclusions?: string[]; // option values to hide
  label?: {en: string; ar: string}; // axis heading
  required?: boolean;    // false = optional (configurator axes like Side Unit)
};

const LABELS: Record<string, {en: string; ar: string}> = {
  "Config":           {en: "Type",    ar: "النوع"},
  "Size":             {en: "Size",    ar: "المقاس"},
  "Desk Top Finish":  {en: "Top",     ar: "سطح المكتب"},
  "Leg Color":        {en: "Legs",    ar: "الأرجل"},
  "Side Unit Finish": {en: "Side Unit (optional)", ar: "الوحدة الجانبية (اختياري)"},
  "Pedestal Finish":  {en: "Pedestal (optional)",  ar: "الأدراج (اختياري)"},
};

export function ConfiguratorPicker(props: ConfiguratorPickerProps) {
  const {axis, value, onChange, options, displayMode, locale, exclusions = [], required = true} = props;
  const isAr = locale === "ar";
  const headingLabel = props.label || LABELS[axis];

  // Filter out excluded options entirely (per Aziz rule: hide, don't grey)
  const visibleOptions = options.filter(o => !exclusions.includes(o.value));

  return (
    <div className="mb-6" role="radiogroup" aria-labelledby={`picker-${axis}-label`}>
      <div id={`picker-${axis}-label`} className="flex items-baseline justify-between mb-2">
        <h4 className="text-[#2C2C2C] font-medium text-sm uppercase tracking-wide">
          {isAr ? headingLabel.ar : headingLabel.en}
        </h4>
        {!required && (
          <span className="text-xs text-[#3A3A3A]">
            {isAr ? "اختياري" : "optional"}
          </span>
        )}
      </div>

      {displayMode === "radio" && (
        <div className="flex flex-wrap gap-2">
          {visibleOptions.map(o => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={value === o.value}
              onClick={() => onChange(o.value)}
              className={[
                "px-4 py-2 text-sm border transition-colors",
                value === o.value
                  ? "border-[#2C2C2C] bg-[#2C2C2C] text-white"
                  : "border-[#D4D4D4] text-[#2C2C2C] hover:border-[#3A3A3A]",
                o.isCustom ? "border-dashed" : "",
              ].join(" ")}
            >
              {isAr ? o.labelAr : o.labelEn}
              {typeof o.extraPrice === "number" && o.extraPrice > 0 && !o.isCustom && (
                <span className={value === o.value ? "text-white/70 text-xs ml-2" : "text-[#3A3A3A] text-xs ml-2"}>
                  +{o.extraPrice.toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {displayMode === "dropdown" && (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-[#D4D4D4] text-[#2C2C2C] focus:border-[#2C2C2C] focus:outline-none"
        >
          {!required && <option value="">{isAr ? "بدون" : "None"}</option>}
          {visibleOptions.map(o => (
            <option key={o.value} value={o.value}>
              {isAr ? o.labelAr : o.labelEn}
              {typeof o.extraPrice === "number" && o.extraPrice > 0 ? ` (+${o.extraPrice})` : ""}
            </option>
          ))}
        </select>
      )}

      {displayMode === "color-swatch" && (
        <div className="grid grid-cols-8 gap-2">
          {visibleOptions.map(o => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={value === o.value}
              aria-label={isAr ? o.labelAr : o.labelEn}
              title={isAr ? o.labelAr : o.labelEn}
              onClick={() => onChange(o.value)}
              className={[
                "relative aspect-square border transition-transform",
                value === o.value
                  ? "border-2 border-[#2C2C2C] scale-110"
                  : "border border-[#D4D4D4] hover:border-[#3A3A3A]",
              ].join(" ")}
              style={{
                backgroundColor: o.swatchHex || "#E7E7E7",
                backgroundImage: o.swatchImage ? `url(${o.swatchImage})` : undefined,
                backgroundSize: "cover",
              }}
            />
          ))}
          {visibleOptions.length > 0 && (
            <div className="col-span-8 mt-2 text-xs text-[#3A3A3A]">
              {isAr ? "المختار: " : "Selected: "}
              {(() => {
                const sel = visibleOptions.find(o => o.value === value);
                return sel ? (isAr ? sel.labelAr : sel.labelEn) : (isAr ? "غير محدد" : "none");
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
