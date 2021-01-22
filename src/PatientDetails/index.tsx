import React, { useEffect } from "react";
import axios from "axios";
import { Container, Icon, List, Button} from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { Patient, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import HospitalEntryDetails from "../components/HospitalEntry";
import HealthCheckEntryDetails from "../components/HealthCheckEntry";
import OccupationalHealthcareEntryDetails from "../components/OccupationalHealthcareEntry";
import { useStateValue, updatePatient } from "../state";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const PatientDetails: React.FC = () => {
  const { id }= useParams<Record<string, string | undefined>>();
  const [{ patients }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  
  useEffect( () => {
    const updatePatientDetails = async () => {
      try {
        const { data: patientDetails } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(updatePatient(patientDetails));
      } catch (e) {
        console.error(e.response.data);
      }
    };
    
    if(id && patients[id] && !patients[id].ssn) updatePatientDetails();
  }, [dispatch, id, patients]);

  
  if(!id || !patients[id]) {
    return (
      <div className="App">
        <Container textAlign="center">
          <h3>Patient Details</h3>
        </Container>
        <div>
          Patient not found...
        </div>
      </div>
    );
  }
  
  const patient = patients[id];

  const formatEntry = (entry: Entry) => {
    switch (entry.type){
      case "Hospital": return(<HospitalEntryDetails entry={entry} key={entry.id} />);
      case "HealthCheck": return(<HealthCheckEntryDetails entry={entry} key={entry.id} />);
      case "OccupationalHealthcare": return(<OccupationalHealthcareEntryDetails entry={entry} key={entry.id} />);
      default: assertNever(entry);
    }
  };
  
  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
              `${apiBaseUrl}/patients/${id}/entries`,
              values
            );
      console.log("newEntry:", newEntry);
      const updatedPatient = { 
        ...patient, 
        entries: patient.entries ? patient.entries.concat(newEntry) : [newEntry]
      };
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  return (
    <div className="App">
      <Container textAlign="left">
        <h3>Patient Details:</h3>
      </Container>
      <Container textAlign="left">
        <h4>{patient.name} 
        <strong>
          {patient.gender === "male"
          ? <Icon name="mars"/>
          : patient.gender === "female"
          ? <Icon name="venus"/>
          : <Icon name="genderless"/> }
        </strong>
        </h4>
      </Container>
      <Container textAlign="left">
      </Container>
        ssn: {patient.ssn}
      <Container textAlign="left">
        occupation: {patient.occupation}
      </Container>
      <List>
        {patient.entries?.map(formatEntry)}
      </List>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientDetails;
