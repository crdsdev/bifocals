import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import './style.css'
import fetch from 'unfetch'
import { Accordion, Segment, Menu, Dimmer, Loader, Input } from 'semantic-ui-react'
import Kind from '../components/Kind'

interface HomeState {
    activeIndex: any
    data: any
    error: any
    filtered: any
}

export default class HomePage extends React.Component<{}, HomeState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            activeIndex: null,
            data: null,
            error: null,
            filtered: null,
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    handleClick(e, titleProps) {
        const { index } = titleProps
        const newIndex = this.state.activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }

    handleChange(e, data) {
        const newFiltered = this.state.data.items.filter(i => i.metadata.name.toLowerCase().indexOf(data.value.toLowerCase()) > -1)
        this.setState({ filtered: newFiltered, activeIndex: -1 })
    }

    componentDidMount() {
        const json = fetch('api/crds/v1beta1').then(res => {
            if (!res.ok) {
                this.setState({ error: res.status })
            } else {
                return res.json()
            }
        }).then(data => {
            this.setState({ data: data.body, filtered: data.body.items })
        })
    }

    render() {
        if (this.state.error) return <div>failed to load</div>
        if (!this.state.data) return (
            <Dimmer active>
                <Loader size='massive' />
            </Dimmer>
        )
        return (
            <div>
                <Segment inverted>
                    <Menu inverted pointing secondary>
                        <Menu.Item
                            name='logo'
                            header
                        ><h1>Bifocals</h1></Menu.Item>
                        <Menu.Item position='right'>
                            <Input onChange={this.handleChange} className='icon' icon='search' placeholder='Search...' inverted />
                        </Menu.Item>
                    </Menu>
                </Segment>
                <Accordion exclusive={false} style={{ fontSize: "20px" }} inverted>
                    {this.state.filtered.map((i, index) => {
                        return (
                            <span key={index}>
                                <Kind
                                    active={this.state.activeIndex === index}
                                    index={index}
                                    handleClick={this.handleClick}
                                    crd={i}
                                />
                                <hr />
                            </span>

                        )
                    })}

                </Accordion>
            </div>
        )
    }

}