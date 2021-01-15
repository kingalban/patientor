import React, { useEffect } from "react";
import axios from "axios";
import { Container, Icon } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
// import HealthRatingBar from "../components/HealthRatingBar";
import { useStateValue } from "../state";

const PatientDetails: React.FC = () => {
  const { id }= useParams<Record<string, string | undefined>>();
  const [{ patients }, dispatch] = useStateValue();
  
  useEffect( () => {
    const updatePatient = async () => {
      try {
        const { data: patientDetails } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch({ type: "UPDATE_PATIENT", payload:patientDetails });
      } catch (e) {
        console.error(e.response.data);
      }
    };
    
    if(id && patients[id] && !patients[id].ssn) updatePatient();
  }, [dispatch, id, patients]);
  
  if(!id || !patients[id]) {
    return (
      <div className="App">
        <Container textAlign="center">
          <h3>Patient Details</h3>
        </Container>
        <div>
          Patient could not be found...
        </div>
      </div>
    );
  }

  const patient = patients[id];

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
    </div>
  );
};

export default PatientDetails;
