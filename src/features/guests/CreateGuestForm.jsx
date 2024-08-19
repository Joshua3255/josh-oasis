import { DevTool } from "@hookform/devtools";
import { useQuery } from "@tanstack/react-query";
import { sl } from "date-fns/locale";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import { getCountries } from "../../services/apiGuests";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Heading from "../../ui/Heading";
import Input from "../../ui/Input";
import Row from "../../ui/Row";
import { useCreateGuest } from "./useCreateGuest";
import { useEditGuest } from "./useEditGuest";

function CreateGuestForm({ guestToEdit = {}, onCloseModal }) {
  const { isLoading, data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  const { id: editId, ...editValues } = guestToEdit;
  const { isCreating, createGuest } = useCreateGuest();
  const { isEditing, editGuest } = useEditGuest();

  editValues.nationalityWithFlagImage = `${editValues.nationality}%${editValues.countryFlag}`;

  const { register, handleSubmit, reset, formState, control } = useForm({
    defaultValues: editValues,
  });

  const isWorking = isCreating || isEditing || isLoading;
  const isEditMode = Boolean(editId);
  const { errors } = formState;

  const countriesDropdownlist = !countries
    ? []
    : countries?.map((country) => {
        return {
          value: `${country.name}%${country.flag}`,
          label: country.name,
        };
      });

  function onSubmit(data) {
    if (isEditMode) {
      editGuest(
        { newGuestData: data, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createGuest(data, {
        onSuccess: (data) => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError(errors) {}

  return (
    <>
      <Row>
        <Heading as="h1">{isEditMode ? "Edit" : "Create"} Guest</Heading>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <FormRow label="Full name" error={errors?.fullName?.message}>
            <Input
              type="text"
              id="fullName"
              disabled={isWorking}
              {...register("fullName", {
                required: "Fullname field is required",
              })}
            />
          </FormRow>
          <FormRow label="Email" error={errors?.email?.message}>
            <Input
              type="text"
              id="email"
              disabled={isWorking}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
            />
          </FormRow>
          <FormRow label="National Id" error={errors?.nationalID?.message}>
            <Input
              type="text"
              id="nationalID"
              disabled={isWorking}
              {...register("nationalID")}
            />
          </FormRow>
          <FormRow label="Nationality" error={errors?.nationality?.message}>
            {/* <Input
              type="text"
              id="nationality"
              disabled={isWorking}
              {...register("nationality")}
            />
            <Input
              type="text"
              id="countryFlag"
              defaultValue="https://flagcdn.com/pt.svg"
              disabled={isWorking}
              {...register("countryFlag")}
            /> */}
            <Controller
              name="nationalityWithFlagImage"
              control={control}
              render={({ field }) => (
                <Select
                  options={countriesDropdownlist}
                  disabled={isWorking}
                  onChange={(val) => {
                    field.onChange(val.value);
                  }}
                  defaultValue={countriesDropdownlist.filter(
                    (country) =>
                      country.value ===
                      `${guestToEdit.nationality}%${guestToEdit.countryFlag}`
                  )}
                />
              )}
            />
          </FormRow>

          <FormRow label="Phone" error={errors?.phone?.message}>
            <Input
              type="text"
              id="phone"
              disabled={isWorking}
              {...register("phone")}
            />
          </FormRow>

          <FormRow>
            <Button
              type="reset"
              variation="secondary"
              onClick={() => onCloseModal?.()}
            >
              Cancel
            </Button>
            <Button>Update Guest</Button>
          </FormRow>
          {/* <DevTool control={control} /> */}
        </Form>
      </Row>
    </>
  );
}

export default CreateGuestForm;
