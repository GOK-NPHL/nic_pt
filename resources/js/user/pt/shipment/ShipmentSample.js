import React from 'react';
import { FetchParticipantList, SaveShipment, FetchReadiness, FetchShipmentById } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import './PtShipment.css';

import ReactTooltip from 'react-tooltip';
import { matchPath } from "react-router";

const dictionary = require('../../../components/utils/dictionary.json');


class ShipmentSample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            index: '',
            result: ''
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
                <td className="px-lg-2">
                    <input
                        value={this.state.name}
                        onChange={(event) => this.sampleNameChange(this.state.index, event.target.value)} className="form-control"
                        placeholder="please enter sample name" />
                </td>
                <td className="px-lg-2">
                    <select className="form-control" value={this.state.result} onChange={(event) => this.sampleReferenceResultChange(this.state.index, event.target.value)}  id={this.state.index + "result_s"}>
                        <option value="">Select</option>
                        {dictionary['interpretation_options'].map((ref_result, index) => (
                            <option key={index} value={ref_result.name.trim()}>{ref_result.name.trim()}</option>
                        ))}
                    </select>
                    {/* other box */}
                    {(!Array.from(dictionary['interpretation_options'], r=>r.name.trim()).includes(this.props.result) || (this.state.result.trim() == dictionary['interpretation_options'].find(x => x.id == 'others')?.name.trim() || this.state.result.toLocaleLowerCase().startsWith('other: '))) ?
                        <input type="text" className="form-control" placeholder="please enter other result" onChange={(event) => this.sampleReferenceResultChange(this.state.index, 'Other: '+event.target.value)} id={this.state.index + "result_o"} value={this.state.result.replace('Other: ', '')}  /> : null}
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