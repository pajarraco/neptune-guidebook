import { Row, Section, TextField, Textarea } from "../primitives";

export default function PropertyInfoForm() {
  return (
    <>
      <Section title="Basics">
        <Row>
          <TextField name="propertyInfo.name" label="Property name" />
          <TextField name="propertyInfo.email" label="Email" />
        </Row>
        <Textarea name="propertyInfo.address" label="Address" rows={2} />
        <TextField name="propertyInfo.addressTitle" label="Address title" />
      </Section>

      <Section title="Wi-Fi">
        <Row>
          <TextField name="propertyInfo.wifi.network" label="Network (SSID)" />
          <TextField name="propertyInfo.wifi.password" label="Password" />
        </Row>
        <Row>
          <TextField name="propertyInfo.wifi.title" label="Section title" />
          <TextField
            name="propertyInfo.wifi.networkLabel"
            label="Network label"
          />
        </Row>
        <TextField
          name="propertyInfo.wifi.passwordLabel"
          label="Password label"
        />
      </Section>

      <Section title="Check-in / Check-out times">
        <Row>
          <TextField name="propertyInfo.checkIn" label="Check-in time" />
          <TextField name="propertyInfo.checkInLabel" label="Check-in label" />
        </Row>
        <Row>
          <TextField name="propertyInfo.checkOut" label="Check-out time" />
          <TextField
            name="propertyInfo.checkOutLabel"
            label="Check-out label"
          />
        </Row>
      </Section>

      <Section title="Contact" defaultOpen={false}>
        <Row>
          <TextField name="propertyInfo.phone" label="Phone" />
          <TextField name="propertyInfo.phoneLabel" label="Phone label" />
        </Row>
      </Section>
    </>
  );
}
