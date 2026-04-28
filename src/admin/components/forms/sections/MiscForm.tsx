import { Row, Section, TextField } from "../primitives";

// Combines the small label-only sections: `sections` (nav tab labels)
// and `common` (shared UI strings).
export default function MiscForm() {
  return (
    <>
      <Section title="Navigation labels">
        <Row>
          <TextField name="sections.welcome" label="Welcome" />
          <TextField name="sections.propertyInfo" label="Property Info" />
        </Row>
        <Row>
          <TextField name="sections.checkInOut" label="Check In/Out" />
          <TextField name="sections.transport" label="Transport" />
        </Row>
        <Row>
          <TextField name="sections.houseRules" label="House Rules" />
          <TextField name="sections.amenities" label="Amenities" />
        </Row>
        <Row>
          <TextField name="sections.localGuide" label="Local Guide" />
          <TextField name="sections.emergency" label="Emergency" />
        </Row>
      </Section>

      <Section title="Common strings">
        <TextField
          name="common.everythingYouNeed"
          label="Everything-you-need tagline"
        />
        <TextField
          name="common.haveQuestions"
          label="Have-questions prompt"
        />
        <TextField name="common.or" label='"or" connector' />
      </Section>
    </>
  );
}
