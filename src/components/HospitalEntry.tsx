import React from "react";
import { Container, Segment, Icon, List } from "semantic-ui-react";
import { HospitalEntry } from "../types";
import { useStateValue } from "../state";

interface HospitalEntryProps {
    entry: HospitalEntry;
}

const HospitalEntryDetails = ({ entry }: HospitalEntryProps) => {
    const [{ diagnoses } ] = useStateValue();
    
    return (
      <List.Item >
        <Container style={{padding: "5em oem"}}>
            <Segment>
                <Container >
                    {entry.date} <Icon name="hospital outline"/>
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

export default HospitalEntryDetails;