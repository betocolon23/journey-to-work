import React from 'react';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


export default class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1
    };
    this.menuItems = this.menuItems.bind(this);
    // console.log(this.props.county);
    console.log(this.props.geoJsonFeature)
  }

  menuItems(county) {
    return this.props.geoJsonFeature.map((municipio, index) => (
      <MenuItem 
        key={index} 
        value={municipio.features.properties.Municipio} 
        primaryText={municipio.features.properties.Municipio} />
    ));
  }

  render() {
    return (
      <div>
        <SelectField
          floatingLabelText="Select County" 
          style={{ width: '300px' }}
          autoWidth={false}
          multiple={true}
          value={this.props.selected}
          onChange={this.props.onChange}
        >
        {/* {this.menuItems(this.props.county)} */}
        </SelectField>
      </div>
    );
  }
}