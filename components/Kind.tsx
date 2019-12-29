import React from 'react'
import * as jp from 'jsonpath'
import { Accordion, Icon, List, Label, Segment } from 'semantic-ui-react'


interface KindProps {
    crd: any
    active: boolean
    index: number
    handleClick: any
}

interface KindState {
    instances: any
    error: any
}

export default class Kind extends React.Component<KindProps, KindState> {
    constructor(props: KindProps) {
        super(props);
        this.state = {
            instances: [],
            error: null
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e, titleProps) {
        const { index } = titleProps
        const json = fetch(`api/crds/v1beta1/${this.props.crd.spec.names.plural}?group=${this.props.crd.spec.group}&version=${this.props.crd.spec.version}`).then(res => {
            if (!res.ok) {
                this.setState({ error: res.status })
            } else {
                return res.json()
            }
        }).then(data => {
            this.setState({ instances: data.items })
        })

        this.props.handleClick(e, titleProps)
    }

    render() {
        return (
            <span>
                <Accordion.Title
                    active={this.props.active}
                    index={this.props.index}
                    onClick={this.handleClick}
                >
                    <Icon name='dropdown' />
                    {this.props.crd.metadata.name}
                </Accordion.Title>
                <Accordion.Content active={this.props.active}>
                    <List inverted>
                        {this.state.instances.map((i, index) => {
                            console.log(i)
                            return (
                                <List.Item as='a' key={index}>
                                    <Icon name='circle' color="green" />
                                    <List.Content>
                                        <List.Header style={{ paddingBottom: "10px", textDecoration: "bold" }}>{i.metadata.name}</List.Header>
                                        <List.Description>
                                            <Segment inverted>
                                                {this.props.crd.spec.additionalPrinterColumns.map((c, ind) => {
                                                    console.log(jp.query(i, `$${c.JSONPath}`))
                                                    return (
                                                        <div style={{ paddingBottom: "5px" }}>
                                                            <Label style={{ marginRight: "5px" }}>{c.name}</Label>{jp.query(i, `$${c.JSONPath}`)}
                                                        </div>
                                                    )
                                                })}
                                            </Segment>
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            )
                        })}
                    </List>
                </Accordion.Content>
            </span>
        )
    }
}