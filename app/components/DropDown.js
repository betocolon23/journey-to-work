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
  }
  
  menuItems(municipios) {
    return municipios.map((municipio, index) => (
      <MenuItem 
      key={index} 
      value={municipio} 
      primaryText={municipio} />
    ));
  }
  
  render() {
    return (
      <div>
        <SelectField
          floatingLabelText="Seleccionar Municipio" 
          style={{ width: '300px' }}
          autoWidth={false}
          multiple={false}
          value={this.props.selected}
          onChange={this.props.onChange}
        >
        {this.menuItems(this.props.municipios)} 
        </SelectField>
      </div>
    );
  }
}