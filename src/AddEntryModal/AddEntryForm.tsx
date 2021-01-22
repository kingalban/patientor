import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, useFormikContext,  } from "formik";

import { TextField, SelectField, TypeOption, HealthCheckOptions, DiagnosisSelection } from "../AddPatientModal/FormField";
import { EntryTypes, HealthCheckRating } from "../types";
import { useStateValue } from "../state/state";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */

// type EntryFormValues = Omit<HealthCheckEntry & OccupationalHealthcareEntry & HospitalEntry, 
//   "id" | "date" | "sickLeave" | "discharge">;

export interface EntryFormValues {
  description: string;        //* required
  specialist: string;         //* required
  diagnosisCodes?: string[];  
  type: "Hospital" | "OccupationalHealthcare" | "HealthCheck";  //* required
  //Hospital
  dischargeDate: string;      //* required
  dischargeCriteria: string;  //* required
  // OccupationalHealthcare
  employerName: string;       //* required
  sickLeaveStartDate: string;
  sickLeaveEndDate: string;
  // HealthCheck
  healthCheckRating: HealthCheckRating | string;   //* required
}

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: EntryTypes.Hospital, label: "Hospital" },
  { value: EntryTypes.OccupationalHealthcare, label: "Occupational Healthcare" },
  { value: EntryTypes.HealthCheck, label: "Health Check" }
];

const healthCheckOptions: HealthCheckOptions[] = [
  { value: "" , label: "Select rating..." },
  { value: HealthCheckRating.Healthy , label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "LowRisk" },
  { value: HealthCheckRating.HighRisk, label: "HighRisk" },
  { value: HealthCheckRating.CriticalRisk, label: "CriticalRisk" }
];

interface SwitchProps {
  path: "Hospital" | "OccupationalHealthcare" | "HealthCheck";
  targetField: "description" | "specialist" | "type";
  children: React.ReactNode;
}

interface FormikContext {
  values: {
    description: string;
    specialist: string;
    type: string;
  };
}
  
export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  
  const [{ diagnoses }] = useStateValue();

  const TypeSwitch: React.FC<SwitchProps> = (props) => {
    const { values } = useFormikContext() as FormikContext;
    if(props.path === values[props.targetField]) {
      return <>{props.children}</>;
    }
    return null;
  };

  return (
    <Formik
      initialValues={{
        description:  "",
        specialist:  "",
        diagnosisCodes:  undefined,
        type: "Hospital",
        //Hospital
        dischargeDate:  "",
        dischargeCriteria:  "",
        // OccupationalHealthcare
        employerName:  "",
        sickLeaveStartDate:  "",
        sickLeaveEndDate: "",
        // HealthCheck
        healthCheckRating: healthCheckOptions[0].value,
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        switch (values.type) {
          case "Hospital":
            if(!values.dischargeDate){
              errors.dischargeDate = requiredError;
            }
            if(!values.dischargeCriteria){
              errors.dischargeCriteria = requiredError;
            }
            break;
          case "OccupationalHealthcare":
            if(!values.employerName){
              errors.employerName = requiredError;
            }
            break;
          case "HealthCheck":
            if(!values.healthCheckRating){
              errors.healthCheckRating = requiredError;
            }
            break;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="entry description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist name"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              diagnoses={Object.values(diagnoses)}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <SelectField
              label="Type"
              name="type"
              options={typeOptions}
            />
            <TypeSwitch 
              path="Hospital"
              targetField="type"
            > 
              <Field
                label="Discharge Date"
                placeholder="YYY-MM-DD"
                name="dischargeDate"
                component={TextField}
              />
              <Field
                label="Discharge Criteria"
                placeholder="Reason for discharge"
                name="dischargeCriteria"
                component={TextField}
              />
            </TypeSwitch>

            <TypeSwitch 
              path="OccupationalHealthcare"
              targetField="type"
            >
              <Field
                label="Employer Name"
                placeholder="Name of patient's employer"
                name="employerName"
                component={TextField}
              />
              <Field
                label="SickLeave Start Date"
                placeholder="YYYY-MM-DD"
                name="sickLeaveStartDate"
                component={TextField}
              />
              <Field
                label="SickLeave End Date"
                placeholder="YYYY-MM-DD"
                name="sickLeaveEndDate"
                component={TextField}
              />

            </TypeSwitch>

            <TypeSwitch 
              path="HealthCheck"
              targetField="type"
              >
              <SelectField
                label="Health check rating"
                name="healthCheckRating"
                options={healthCheckOptions}
              />

            </TypeSwitch>
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;



