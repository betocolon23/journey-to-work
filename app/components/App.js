//libraries
import React from 'react';
import Paper from 'material-ui/Paper';
import { Map, TileLayer, Marker, Popup, geoJSON, GeoJSON, geoJson  } from 'leaflet';
import municipioData from './municipioData';
import Feature from './county-data';


//components
import DropDown from './DropDown';
import RadioComponent from './RadioComponent';

//css
import css from '../styles.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "selected": "Feature"
        }
        console.log(Feature);
        this.handleChangeMunicipio = this.handleChangeMunicipio.bind(this);
    }

    

    componentDidMount() {
        var myStyle = {
            "color": "ff7800",
            "weight": 5,
            "opacity": 0.65
        }

        var map = L.map('map').setView([18.2208, -66.5901], 8);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmV0b2NvbG9uMjMiLCJhIjoiY2pmMWNuY2g1MDdtaDJ5bG44aGFoNmdlZCJ9.L_4W1fZnk7hMCwmS71Lg1w', {
                id: 'mapbox.light',
            }).addTo(map);
            L.geoJSON().addTo(map);  
    }

    //Para el dropdown list de municipios - Sacarlos del GEOJSON
    handleChangeMunicipio(event, index, value) {
        this.setState({ selected: value });
    }

    render() {
        return (
            <Paper>
                <div className={'full-container'}> 
                    <div className={"top-container"}>
                        <DropDown 
                            className={"drop-down"}
                            onChange={this.handleChangeMunicipio}
                            selected={this.state.selected}
                            
                        />
                        <RadioComponent 
                            className={"radio-component"}
                        />
                    </div>
                    <div className={"bottom-container"}>
                        <div id="map"></div>
                    </div>
                </div>
            </Paper>
        )
    }
}