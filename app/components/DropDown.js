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
    console.log(this.props.county);
    console.log(this.props.municipios)
  }

  menuItems(county) {
    return county.map((municipio, index) => (
      <MenuItem 
        key={index} 
        value={municipio.features.properties} 
        primaryText={county.features[0].properties} />
    ));
  }

  render() {
    return (
      <div>
        <DropDownMenu 
          style={{ width: '300px' }}
          autoWidth={false}
          multiple={true}
          value={this.props.selected}
          onChange={this.props.onChange}
        >
        </DropDownMenu>
      </div>
    );
  }
}