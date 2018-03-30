import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu'; import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
};

export default class RadioComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'radio-buttons'}>
                <RadioButton
                    value="light"
                    label="net"
                    style={styles.radioButton}
                />
                <RadioButton
                    value="not_light"
                    label="outbound"
                    style={styles.radioButton}
                />
                <RadioButton
                    value="not_light"
                    label="inbound"
                    style={styles.radioButton}
                />
            </div>
        );
    }
}