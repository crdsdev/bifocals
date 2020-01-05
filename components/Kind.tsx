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
    loading: boolean
    error: any
}

export default class Kind extends React.Component<KindProps, KindState> {
    constructor(props: KindProps) {
        super(props);
        this.state = {
            instances: [],
            loading: true,
            error: null
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e, titleProps) {
        fetch(`api/crds/v1beta1/${this.props.crd.spec.names.plural}?group=${this.props.crd.spec.group}&version=${this.props.crd.spec.version}`).then(res => {
            if (!res.ok) {
                this.setState({ error: res.status })
            } else {
                return res.json()
            }
        }).then(data => {
            this.setState({ instances: data.items, loading: false })
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
                    {this.props.active ?
                        this.state.loading ? <p>Finding instances...</p> :
                            this.state.instances.length === 0 ? <p>No instances of this kind in cluster.</p> :
                                <List inverted>
                                    {this.state.instances.map((i, index) => {
                                        return (
                                            <List.Item as='a' key={index}>
                                                <Icon name='circle' color="green" />
                                                <List.Content>
                                                    <List.Header style={{ paddingBottom: "10px", textDecoration: "bold" }}>{i.metadata.name}</List.Header>
                                                    <List.Description>
                                                        <Segment inverted>
                                                            {this.props.crd.spec.additionalPrinterColumns ? this.props.crd.spec.additionalPrinterColumns.map((c, ind) => {
                                                                return (
                                                                    <div style={{ paddingBottom: "5px" }} key={ind}>
                                                                        <Label style={{ marginRight: "5px" }}>{c.name}</Label>{jp.query(i, `$${c.JSONPath}`)}
                                                                    </div>
                                                                )
                                                            }) : null}
                                                        </Segment>
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        )
                                    })}
                                </List> : null}
                </Accordion.Content>
            </span>
        )
    }
}