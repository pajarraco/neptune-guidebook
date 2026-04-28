import {
  ObjectArrayField,
  Row,
  Section,
  StringArrayField,
  TextField,
  Textarea,
} from "../primitives";

export default function AmenitiesForm() {
  return (
    <>
      <Section title="Section labels">
        <Row>
          <TextField
            name="amenitiesSection.sectionTitle"
            label="Section title"
          />
          <TextField
            name="amenitiesSection.serviceInfoLabel"
            label="Service info label"
          />
        </Row>
        <TextField
          name="amenitiesSection.howToUseLabel"
          label="How-to-use label"
        />

        <Section title="Help tip" defaultOpen={false}>
          <TextField name="amenitiesSection.helpTip.title" label="Tip title" />
          <Textarea
            name="amenitiesSection.helpTip.message"
            label="Tip message"
          />
        </Section>
      </Section>

      <Section title="Amenities list">
        <ObjectArrayField
          name="amenities"
          label="Amenities"
          newItem={() => ({ name: "", description: "" })}
          itemLabel={(i, item) =>
            `${i + 1}. ${(item as { name?: string })?.name || "—"}`
          }
        >
          {(i) => (
            <>
              <TextField name={`amenities.${i}.name`} label="Name" />
              <Textarea
                name={`amenities.${i}.description`}
                label="Description"
              />
              <Textarea
                name={`amenities.${i}.instructions`}
                label="Instructions (optional)"
              />
              <Textarea
                name={`amenities.${i}.serviceInfo`}
                label="Service info (optional)"
              />
              <StringArrayField
                name={`amenities.${i}.items`}
                label="Items (optional)"
              />
            </>
          )}
        </ObjectArrayField>
      </Section>
    </>
  );
}
