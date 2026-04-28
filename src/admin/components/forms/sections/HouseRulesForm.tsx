import {
  ObjectArrayField,
  Row,
  Section,
  TextField,
  Textarea,
} from "../primitives";

export default function HouseRulesForm() {
  return (
    <>
      <Section title="Rules">
        <ObjectArrayField
          name="houseRules.rules"
          label="Rules"
          newItem={() => ({ icon: "", title: "", description: "" })}
          itemLabel={(i, item) =>
            `${i + 1}. ${(item as { title?: string })?.title || "—"}`
          }
        >
          {(i) => (
            <>
              <Row>
                <TextField
                  name={`houseRules.rules.${i}.icon`}
                  label="Icon (Material Symbol)"
                />
                <TextField
                  name={`houseRules.rules.${i}.title`}
                  label="Title"
                />
              </Row>
              <Textarea
                name={`houseRules.rules.${i}.description`}
                label="Description"
              />
            </>
          )}
        </ObjectArrayField>
      </Section>

      <Section title="Important note">
        <TextField name="houseRules.importantNote.title" label="Title" />
        <Textarea name="houseRules.importantNote.message" label="Message" />
      </Section>
    </>
  );
}
