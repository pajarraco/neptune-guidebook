import {
  ObjectArrayField,
  Row,
  Section,
  StringArrayField,
  TextField,
  Textarea,
} from "../primitives";

export default function EmergencyForm() {
  return (
    <>
      <Section title="Section labels">
        <Row>
          <TextField name="emergency.sectionTitle" label="Section title" />
          <TextField name="emergency.beachesLabel" label="Beaches label" />
        </Row>
        <Row>
          <TextField
            name="emergency.freshwaterLabel"
            label="Freshwater label"
          />
          <TextField
            name="emergency.addressNoteLabel"
            label="Address note label"
          />
        </Row>
        <Textarea name="emergency.addressNote" label="Address note text" />
      </Section>

      <Section title="Alert">
        <TextField name="emergency.alert.title" label="Title" />
        <Textarea name="emergency.alert.message" label="Message (HTML allowed)" />
      </Section>

      <ObjectArrayField
        name="emergency.contacts"
        label="Contacts"
        newItem={() => ({ type: "", name: "", phone: "" })}
        itemLabel={(i, item) =>
          `${i + 1}. ${(item as { name?: string })?.name || "—"}`
        }
      >
        {(i) => (
          <>
            <Row>
              <TextField
                name={`emergency.contacts.${i}.type`}
                label="Type"
              />
              <TextField
                name={`emergency.contacts.${i}.name`}
                label="Name"
              />
            </Row>
            <Row>
              <TextField
                name={`emergency.contacts.${i}.phone`}
                label="Phone"
              />
              <TextField
                name={`emergency.contacts.${i}.hours`}
                label="Hours (optional)"
              />
            </Row>
            <TextField
              name={`emergency.contacts.${i}.address`}
              label="Address (optional)"
            />
            <Textarea
              name={`emergency.contacts.${i}.note`}
              label="Note (optional)"
            />
          </>
        )}
      </ObjectArrayField>

      <Section title="Safety info">
        <TextField name="emergency.safetyInfo.title" label="Title" />
        <StringArrayField
          name="emergency.safetyInfo.items"
          label="Safety items"
        />
      </Section>

      <Section title="Water safety" defaultOpen={false}>
        <TextField name="emergency.waterSafety.title" label="Title" />
        <Textarea name="emergency.waterSafety.beaches" label="Beaches info" />
        <Textarea
          name="emergency.waterSafety.freshwater"
          label="Freshwater info"
        />
      </Section>
    </>
  );
}
