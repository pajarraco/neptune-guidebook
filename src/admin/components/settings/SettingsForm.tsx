import { Section, StringArrayField } from "../forms/primitives";

export default function SettingsForm() {
  return (
    <Section
      title="Amenity Icons"
      description="Material Symbols icon names for the amenities section"
    >
      <StringArrayField
        name="amenityIcons"
        label="Icon names"
        placeholder="e.g., wifi, ac_unit, pool"
        itemLabel={(i) => `Icon ${i + 1}`}
      />
    </Section>
  );
}
