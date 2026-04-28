import {
  ObjectArrayField,
  Row,
  Section,
  TextField,
  Textarea,
} from "../primitives";

export default function TransportForm() {
  return (
    <>
      <Section title="General">
        <TextField name="transport.sectionTitle" label="Section title" />
        <Row>
          <TextField name="transport.faresLabel" label="Fares label" />
          <TextField
            name="transport.pleaseNoteLabel"
            label="Please-note label"
          />
        </Row>
      </Section>

      <Section title="Parking" defaultOpen={false}>
        <TextField name="transport.parking.title" label="Title" />
        <Textarea name="transport.parking.description" label="Description" />
      </Section>

      <Section title="Rideshare" defaultOpen={false}>
        <TextField name="transport.rideshare.title" label="Title" />
        <Textarea name="transport.rideshare.description" label="Description" />
      </Section>

      <Section title="Public transport" defaultOpen={false}>
        <TextField name="transport.publicTransport.title" label="Title" />
        <Textarea
          name="transport.publicTransport.description"
          label="Description"
        />
        <Textarea name="transport.publicTransport.info" label="Info" />
        <Textarea name="transport.publicTransport.fares" label="Fares" />
        <Textarea
          name="transport.publicTransport.limitations"
          label="Limitations"
        />
      </Section>

      <Section title="Airport transfers" defaultOpen={false}>
        <TextField name="transport.airportTransfers.title" label="Title" />
        <Textarea
          name="transport.airportTransfers.description"
          label="Description"
        />
        <Textarea name="transport.airportTransfers.note" label="Note" />
        <ObjectArrayField
          name="transport.airportTransfers.options"
          label="Options"
          newItem={() => ({ name: "", phone: "", type: "" })}
          itemLabel={(i, item) =>
            `${i + 1}. ${(item as { name?: string })?.name || "—"}`
          }
        >
          {(i) => (
            <Row>
              <TextField
                name={`transport.airportTransfers.options.${i}.name`}
                label="Name"
              />
              <TextField
                name={`transport.airportTransfers.options.${i}.phone`}
                label="Phone"
              />
              <TextField
                name={`transport.airportTransfers.options.${i}.type`}
                label="Type"
              />
            </Row>
          )}
        </ObjectArrayField>
      </Section>

      <Section title="Car rental" defaultOpen={false}>
        <TextField name="transport.carRental.title" label="Title" />
        <Textarea name="transport.carRental.description" label="Description" />
        <Textarea name="transport.carRental.note" label="Note" />
      </Section>
    </>
  );
}
