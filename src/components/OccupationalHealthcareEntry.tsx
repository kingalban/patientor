import React from "react";
import { Container, Segment, Icon, List } from "semantic-ui-react";
import { OccupationalHealthcareEntry } from "../types";
import { useStateValue } from "../state";

interface OccupationalHealthcareEntryProps {
    entry: OccupationalHealthcareEntry;
}


const OccupationalHealthcareEntryDetails = ({ entry }: OccupationalHealthcareEntryProps) => {
    const [{ diagnoses } ] = useStateValue();
    
    return (
      <List.Item>
        <Container style={{padding: "5em oem"}}>
            <Segment>
                <Container >
                    {entry.date} <Icon name="stethoscope"/>
                    <p>
                        <em>{entry.description}</em>
                    </p>
                    <List as="ul">
                    {entry.diagnosisCodes?.map(c => 
                        <List.Item as="li" key={c}>{c} {diagnoses[c]?.name}</List.Item>
                        )}
                    </List>
                </Container>
            </Segment>
        </Container>
      </List.Item>
    );
};

export default OccupationalHealthcareEntryDetails;