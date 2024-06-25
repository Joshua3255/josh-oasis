import { useState } from "react";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Heading from "../../ui/Heading";
import Input from "../../ui/Input";
import Row from "../../ui/Row";

function CreateGuestForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setnationalId] = useState("");
  const [nationality, setNationality] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log(document.getElementById("fullName").value);

    console.log(e);

    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData);

    console.log("data", data);

    console.log("formData name", formData.get("fullName"));

    for (const pair of formData.entries()) {
      const [key, value] = pair;
      console.log(`Key: ${key}, Value: ${value}`);
    }

    // const form = document.getElementById("guestForm");
    // console.log("form", form);
    // const formData = new FormData(form);

    // console.log("fullname", formData.get("fullName"));
    // console.log(document.getElementById("fullName").value);

    // console.log(formData);

    //const form = e.target; // document.getElementById("myForm");
    // const formData = new FormData(form);

    console.log(formData);
    return false;

    // Access form fields using formData
    // const name = formData.get('name');
    // const email = formData.get('email');
  }

  return (
    <>
      <Row>
        <Heading as="h1">Create or Edit Guest</Heading>
        <Form id="guestForm" onSubmit={handleSubmit}>
          <FormRow label="Full name">
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </FormRow>
          <FormRow label="Email">
            <Input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormRow>
          <FormRow label="National Id">
            <Input
              type="text"
              id="nationalId"
              value={nationalId}
              onChange={(e) => setnationalId(e.target.value)}
            />
          </FormRow>
          <FormRow label="Nationality">
            <Input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </FormRow>
          <FormRow>
            <Button
              type="reset"
              variation="secondary"
              // disabled={isUpdating}
              // onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button>Update Guest</Button>
          </FormRow>
        </Form>
      </Row>
    </>
  );
}

export default CreateGuestForm;
