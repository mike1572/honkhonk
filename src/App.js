
import './App.css';

import React, {Fragment, useEffect, useState} from 'react'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

import {Grid, Box, AppBar, Typography, Container, Button} from '@mui/material'

function App() {

  let [date, setDate] = useState('')
  let getLocation = () => {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition)
    } else {
      console.log("not suppoerted")
    }
  }  

  let showPosition = (position) => {
    console.log(position)
    console.log(position.coords.latitude)
    console.log(position.coords.longitude);
  }

  useEffect(() => {
    getLocation()
    let now = new Date()
    setDate(now.toString())
  
  }, [])


  return (
    <Fragment>
      
      <AppBar sx={{mt: 6, width: '20%', p: 5, mx: 5, borderRadius: '15px', bgcolor: 'orange'}}>
        <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 800}} variant="h5">
          Location & Time
        </Typography>
        <br/>
        <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 700}} variant="h6">
          Longitude: 45.501690
        </Typography>
        <br/>
        <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 700}} variant="h6">
          Latitude: 45.501690
        </Typography>
        <br/>
        <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 700}} variant="h6">
         {date}
        </Typography>
        <br/>
        <Button variant='contained'>
          Find Route
        </Button>
   
      </AppBar>
   
    <MapContainer center={[45.501690, -73.567253]} zoom={15} scrollWheelZoom={false}>
      <Box>
        hi
      </Box>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[45.501690, -73.567253]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
        <Marker position={[45.401690, -73.567253]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
    </Fragment>
  );
}

export default App;
