import {React, createRef, Component} from 'react';
import { BsChevronRight } from 'react-icons/bs';
import './TripButton.css'


class TripButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            containerClassName: "mainContainer",
        };
        this.selfRef = createRef();
        this.trip_id = this.props.trip_id;
    }

    setClick = (new_value) => {
        if (new_value === this.state.clicked) return;

        this.setState({clicked: new_value}, () => {
            if (new_value) {
                this.setState({ containerClassName: "mainContainer clicked" });
                this.props.selection(this);
            }
            else
                this.setState({ containerClassName: "mainContainer" });
        });
    };

    render() {
        const {destination, data, bg_color} = this.props;
        const {containerClassName} = this.state;

        return (
            <div
                ref={this.selfRef}
                //style={{ backgroundColor: bg_color }}
                className={containerClassName}
                onClick={() => this.setClick(!this.state.clicked)}
            >
                <div className="destination">{destination}</div>
                <div className="data">{data}</div>
                {/*<BsChevronRight style={{height: "100%"}} />*/}
            </div>
        );
    }
}

TripButton.defaultProps = {
    selection: () => {}, // Default per la prop `selection`
};

export default TripButton;
