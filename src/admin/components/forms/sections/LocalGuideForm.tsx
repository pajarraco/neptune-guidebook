import {
  ObjectArrayField,
  Row,
  Section,
  StringArrayField,
  TextField,
  Textarea,
} from "../primitives";

export default function LocalGuideForm() {
  return (
    <>
      <Section title="Section labels">
        <Row>
          <TextField name="localGuide.sectionTitle" label="Section title" />
          <TextField
            name="localGuide.viewOnMapsLabel"
            label="View-on-maps label"
          />
        </Row>
        <Textarea
          name="localGuide.packingListIntro"
          label="Packing list intro"
        />
        <Textarea name="localGuide.tip" label="Tip" />
      </Section>

      <ObjectArrayField
        name="localGuide.recommendations"
        label="Recommendations"
        newItem={() => ({ category: "", name: "", description: "" })}
        itemLabel={(i, item) =>
          `${i + 1}. ${(item as { category?: string; name?: string })?.category || "—"} / ${(item as { name?: string })?.name || "—"}`
        }
      >
        {(i) => (
          <>
            <Row>
              <TextField
                name={`localGuide.recommendations.${i}.category`}
                label="Category"
              />
              <TextField
                name={`localGuide.recommendations.${i}.name`}
                label="Name"
              />
            </Row>
            <Textarea
              name={`localGuide.recommendations.${i}.description`}
              label="Description"
            />
            <Row>
              <TextField
                name={`localGuide.recommendations.${i}.address`}
                label="Address (optional)"
              />
              <TextField
                name={`localGuide.recommendations.${i}.distance`}
                label="Distance (optional)"
              />
            </Row>
            <TextField
              name={`localGuide.recommendations.${i}.link`}
              label="Map link (optional, English only)"
            />
            <Textarea
              name={`localGuide.recommendations.${i}.note`}
              label="Note (optional)"
            />
          </>
        )}
      </ObjectArrayField>

      <Section title="Packing list" defaultOpen={false}>
        <TextField name="localGuide.packingList.title" label="Title" />
        <StringArrayField name="localGuide.packingList.items" label="Items" />
      </Section>
    </>
  );
}
