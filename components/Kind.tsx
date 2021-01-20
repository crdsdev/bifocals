import * as k8s from '@kubernetes/client-node';
import React, { useState } from 'react';
import * as jp from 'jsonpath';
import { Accordion, Icon, List, Label, Segment, AccordionTitleProps } from 'semantic-ui-react';

interface KindProps {
  crd: k8s.V1beta1CustomResourceDefinition;
  active: boolean;
  index: number;
  handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, titleProps: AccordionTitleProps) => void;
}

export const Kind: React.FC<KindProps> = ({ crd, active, index, ...props }) => {
  const [error, setError] = useState<number | null>(null);
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, titleProps: AccordionTitleProps) => {
    fetch(`api/crds/v1beta1/${crd.spec.names.plural}?group=${crd.spec.group}&version=${crd.spec.version}`)
      .then(res => {
        if (!res.ok) {
          setError(res.status);
        } else {
          return res.json();
        }
      })
      .then(data => {
        data?.items && setInstances(data.items);
        setLoading(false);
      });

    props.handleClick(event, titleProps);
  };

  if (error) {
    return <span>failed to load</span>;
  }

  return (
    <span>
      <Accordion.Title active={active} index={index} onClick={handleClick}>
        <Icon name="dropdown" />
        {crd.metadata.name}
      </Accordion.Title>
      <Accordion.Content active={active}>
        {active && loading ? <p>Finding instances...</p> : null}
        {active && !loading && instances.length === 0 ? (
          <p>No instances of this kind in cluster.</p>
        ) : (
          <List inverted>
            {instances.map((i, index) => (
              <List.Item as="a" key={index}>
                <Icon name="circle" color="green" />
                <List.Content>
                  <List.Header style={{ paddingBottom: '10px', textDecoration: 'bold' }}>{i.metadata.name}</List.Header>
                  <List.Description>
                    <Segment inverted>
                      {crd.spec.additionalPrinterColumns?.length &&
                        crd.spec.additionalPrinterColumns.map((c, ind) => (
                          <div style={{ paddingBottom: '5px' }} key={ind}>
                            <Label style={{ marginRight: '5px' }}>{c.name}</Label>
                            {jp.query(i, `$${c.JSONPath}`)}
                          </div>
                        ))}
                    </Segment>
                  </List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        )}
      </Accordion.Content>
    </span>
  );
};

export default Kind;
