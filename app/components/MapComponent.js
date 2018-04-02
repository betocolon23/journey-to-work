import React from 'react';
import { Map, TileLayer, Marker, Popup, LeafletMap, FeatureGroup, GeoJSON, Overlay, LayersControl, BaseLayer } from 'react-leaflet';
import { L } from 'leaflet';
import Municipios from './municipio-data';
import Feature from './county-data';



export default class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.style = this.style.bind(this);
    }

    style(feature) {
        return {
            fillColor: 'blue',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }


    render() {
        return (
            <div id="map" >
                {/* <Map
                    center={[18.2208, -66.5901]}
                    zoom={9}
                    url={'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmV0b2NvbG9uMjMiLCJhIjoiY2pmMWNuY2g1MDdtaDJ5bG44aGFoNmdlZCJ9.L_4W1fZnk7hMCwmS71Lg1w'}
                >
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer name="OpenStreetMap.Mapnik" checked>
                            <TileLayer
                                url={'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmV0b2NvbG9uMjMiLCJhIjoiY2pmMWNuY2g1MDdtaDJ5bG44aGFoNmdlZCJ9.L_4W1fZnk7hMCwmS71Lg1w'}
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.Overlay name="municipio" checked>
                            <GeoJSON
                                data={data}
                                style={this.style}
                                key={Municipios}
                            />
                        </LayersControl.Overlay>
                    </LayersControl>
                </Map> */}
            </div>
        )
    }
}