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
                <td className="px-lg-2" style={{ "maxWidth": "150px" }}>
                    <input
                        value={this.state.name}
                        onChange={(event) => this.sampleNameChange(this.state.index, event.target.value)} className="form-control"
                        placeholder="please enter sample name" />
                </td>
                {/* <td onChange={this.qcInterpretationLongterm.bind(this)}> */}
                <td style={{ "maxWidth": "150px" }}>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input"
                            checked={this.state.result == 'lt' ? true : false}
                            type="radio" value="lt" onChange={() => this.sampleReferenceResultChange(this.state.index, 'lt')}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_lt"} />
                        <label className="form-check-label" htmlFor={this.state.index + "result_lt"} >
                            LT
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio"
                            checked={this.state.result == 'recent' ? true : false}
                            value="recent" onChange={() => this.sampleReferenceResultChange(this.state.index, 'recent')}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_recent"} />
                        <label className="form-check-label" htmlFor={this.state.index + "result_recent"} >
                            recent
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio"
                            checked={this.state.result == 'neg' ? true : false}
                            value="neg" onChange={() => this.sampleReferenceResultChange(this.state.index, 'neg')}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_neg"} />
                        <label className="form-check-label" htmlFor={this.state.index + "result_neg"} >
                            neg
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio"
                            checked={this.state.result == 'invalid' ? true : false}
                            value="invalid" onChange={() => this.sampleReferenceResultChange(this.state.index, 'invalid')}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_invalid"} />
                        <label className="form-check-label" htmlFor={this.state.index + "result_invalid"} >
                            invalid
                        </label>
                    </div>
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