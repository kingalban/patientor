import React from "react";
import { Container, Segment, Icon, List } from "semantic-ui-react";
import { HealthCheckEntry } from "../types";
import { useStateValue } from "../state";

interface HealthCheckEntryProps {
    entry: HealthCheckEntry;
}


const HealthCheckEntryDetails = ({ entry }: HealthCheckEntryProps) => {
    const [{ diagnoses } ] = useStateValue();
    
    return (
      <List.Item>
        <Container style={{padding: "5em oem"}}>
            <Segment>
                <Container >
                    {entry.date} <Icon name="user doctor"/>
                    <p>
                        <em>{entry.description}</em>
                    </p>
                    <List as="ul">
                    {entry.diagnosisCodes?.map(c => 
                        <List.Item as="li" key={c}>{c} {diagnoses[c]?.name}</List.Item>
                        )}
                    </List>
                    {"❤️".repeat(4-Number(entry.healthCheckRating))}
                </Container>
            </Segment>
        </Container>
      </List.Item>
    );
};

export default HealthCheckEntryDetails;