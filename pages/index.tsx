import * as k8s from '@kubernetes/client-node';
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionTitleProps, Dimmer, Input, InputOnChangeData, Loader, Menu, Segment } from 'semantic-ui-react';
import fetch from 'unfetch';

import Kind from '../components/Kind';

export const HomePage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<string | number | null>(null);
  const [data, setData] = useState<k8s.V1beta1CustomResourceDefinitionList | null>(null);
  const [error, setError] = useState<number | null>(null);
  const [filtered, setFiltered] = useState<k8s.V1beta1CustomResourceDefinitionList['items'] | null>(null);


  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, titleProps: AccordionTitleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, changeData: InputOnChangeData) => {
    const newFiltered = changeData.items.filter(i => i.metadata.name.toLowerCase().indexOf(changeData.value.toLowerCase()) > -1);
    setFiltered(newFiltered);
    setActiveIndex(-1);
  };

  useEffect(() => {
    fetch('api/crds/v1beta1').then(res => {
      if (!res.ok) {
        setError(res.status);
      } else {
        return res.json();
      }
    }).then((data?: { body: k8s.V1beta1CustomResourceDefinitionList }) => {
      data?.body && setData(data.body);
      data?.body?.items && setFiltered(data.body.items);
    });
  }, []);

  if (error) {
    return <div>failed to load</div>;
  }

  if (!data) {
    return <Dimmer active><Loader size='massive' /></Dimmer>;
  }

  return (
    <div>
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item name='logo' header>
            <h1>Bifocals</h1>
          </Menu.Item>
          <Menu.Item position='right'>
            <Input onChange={handleChange} className='icon' icon='search' placeholder='Search...' inverted />
          </Menu.Item>
        </Menu>
      </Segment>
      <Accordion exclusive={false} style={{ fontSize: '20px' }} inverted>
        {filtered.map((i, index) => (
          <span key={index}>
            <Kind
              active={activeIndex === index}
              index={index}
              handleClick={handleClick}
              crd={i}
            />
            <hr />
          </span>
        ))}
      </Accordion>
    </div>
  );
};

export default HomePage;
