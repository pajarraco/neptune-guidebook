import {
  Row,
  Section,
  StringArrayField,
  TextField,
  Textarea,
} from "../primitives";

export default function CheckInOutForm() {
  return (
    <>
      <Section title="General">
        <TextField name="checkInOut.sectionTitle" label="Section title" />
        <Textarea name="checkInOut.tip" label="Tip / closing note" />
      </Section>

      <Section title="Check-in">
        <Row>
          <TextField name="checkInOut.checkIn.title" label="Title" />
          <TextField name="checkInOut.checkIn.subheading" label="Subheading" />
        </Row>
        <TextField
          name="checkInOut.checkIn.arrivingEarlyLabel"
          label="Arriving early label"
        />
        <StringArrayField
          name="checkInOut.checkIn.steps"
          label="Steps"
          textarea
          itemLabel={(i) => `Step ${i + 1}`}
        />
      </Section>

      <Section title="Check-out">
        <Row>
          <TextField name="checkInOut.checkOut.title" label="Title" />
          <TextField name="checkInOut.checkOut.subheading" label="Subheading" />
        </Row>
        <StringArrayField
          name="checkInOut.checkOut.steps"
          label="Steps"
          textarea
          itemLabel={(i) => `Step ${i + 1}`}
        />
      </Section>
    </>
  );
}
