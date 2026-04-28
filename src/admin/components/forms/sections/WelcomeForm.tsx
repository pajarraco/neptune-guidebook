import {
  ObjectArrayField,
  Row,
  Section,
  StringArrayField,
  TextField,
  Textarea,
} from "../primitives";

export default function WelcomeForm() {
  return (
    <>
      <Section title="Intro Messages">
        <StringArrayField
          name="welcome.introMessages"
          label="Intro messages"
          textarea
          itemLabel={(i) => `Message ${i + 1}`}
        />
      </Section>

      <Section title="Features Section">
        <TextField name="welcome.featuresSection.title" label="Title" />
        <Textarea name="welcome.featuresSection.answer" label="Answer" />
        <Textarea
          name="welcome.featuresSection.description"
          label="Description"
        />
        <Textarea name="welcome.featuresSection.note" label="Note" />
        <ObjectArrayField
          name="welcome.featuresSection.features"
          label="Features"
          newItem={() => ({ icon: "", text: "", link: "" })}
          itemLabel={(i, item) =>
            `${i + 1}. ${(item as { text?: string })?.text || "—"}`
          }
        >
          {(i) => (
            <>
              <Row>
                <TextField
                  name={`welcome.featuresSection.features.${i}.icon`}
                  label="Icon (Material Symbol)"
                />
                <TextField
                  name={`welcome.featuresSection.features.${i}.text`}
                  label="Text"
                />
              </Row>
              <TextField
                name={`welcome.featuresSection.features.${i}.link`}
                label="Link (section ID, e.g. property-info — English only)"
              />
            </>
          )}
        </ObjectArrayField>
      </Section>

      <Section title="Add to Phone" defaultOpen={false}>
        <Row>
          <TextField name="welcome.addToPhone.icon" label="Icon" />
          <TextField name="welcome.addToPhone.title" label="Title" />
        </Row>
        <StringArrayField
          name="welcome.addToPhone.messages"
          label="Messages"
          textarea
        />
      </Section>

      <Section title="Meet Your Team" defaultOpen={false}>
        <Row>
          <TextField name="welcome.meetYourTeam.title" label="Title" />
          <TextField
            name="welcome.meetYourTeam.photoPlaceholder"
            label="Photo placeholder"
          />
        </Row>

        <Section title="Host welcome" defaultOpen={false}>
          <Row>
            <TextField
              name="welcome.meetYourTeam.hostWelcome.icon"
              label="Icon"
            />
            <TextField
              name="welcome.meetYourTeam.hostWelcome.title"
              label="Title"
            />
          </Row>
          <Textarea
            name="welcome.meetYourTeam.hostWelcome.description"
            label="Description"
          />
          <Textarea
            name="welcome.meetYourTeam.hostWelcome.teamIntro"
            label="Team intro"
          />
        </Section>

        <Section title="Founder note" defaultOpen={false}>
          <Row>
            <TextField
              name="welcome.meetYourTeam.founderNote.icon"
              label="Icon"
            />
            <TextField
              name="welcome.meetYourTeam.founderNote.title"
              label="Title"
            />
          </Row>
          <Textarea
            name="welcome.meetYourTeam.founderNote.message"
            label="Message"
          />
          <Textarea
            name="welcome.meetYourTeam.founderNote.mission"
            label="Mission"
          />
          <Textarea
            name="welcome.meetYourTeam.founderNote.closing"
            label="Closing"
          />
        </Section>
      </Section>
    </>
  );
}
