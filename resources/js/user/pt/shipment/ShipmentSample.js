import React from 'react';
import { FetchParticipantList, SaveShipment, FetchReadiness, FetchShipmentById } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import './PtShipment.css';

import ReactTooltip from 'react-tooltip';
import { matchPath } from "react-router";


class ShipmentSample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            index: '',
            result: '0'
        }
        this.sampleReferenceResultChange = this.sampleReferenceResultChange.bind(this);
        this.sampleNameChange = this.sampleNameChange.bind(this);
    }

    componentDidMount() {

        this.setState({
            name: this.props.name,
            index: this.props.index,
            result: this.props.result,
        })
    }

    sampleReferenceResultChange(index, refResult) {

        this.setState({
            result: refResult
        })
        this.props.sampleReferenceResultChange(index, refResult);
    }

    sampleNameChange(index, name) {

        this.setState({
            name: name
        })
        this.props.sampleNameChange(index, name);
    }

    render() {
        return (

            <tr >
                <td className="px-lg-2" colSpan={2}>
                    <input
                        value={this.state.name}
                        onChange={(event) => this.sampleNameChange(this.state.index, event.target.value)} className="form-control"
                        placeholder="please enter sample name" />
                    <input style={{ display: 'none' }}
                        checked={true}
                        type="hidden" value="0" onChange={() => this.sampleReferenceResultChange(this.state.index, 'lt')}
                        name={this.state.index + "long-term-radio"} id={this.state.index + "result_lt"} />
                </td>
                <td>

                    <ReactTooltip />
                    <a onClick={() => this.props.deleteSampleRow(this.state.index)} data-tip="Delete sample">
                        <i style={{ "color": "red" }} className="fa fa-minus-circle" aria-hidden="true"></i>
                    </a>

                </td>
            </tr>

        );
    }
}

export default ShipmentSample;