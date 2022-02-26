
import './App.css';

import React, {Fragment, useEffect, useState} from 'react'

import { MapContainer, Marker, Popup, TileLayer, Polyline} from 'react-leaflet'
import {Icon} from "leaflet";

import data from './data.json';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Slide from '@mui/material/Slide'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import IconI from '@mui/material/Icon'
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import logo from './location.svg'

let colors = ['blue', 'red', 'orange', 'black', 'lime', 'purple', 'yellow', 'grey', 'white', 'darkblue']

function App() {

  let [filePresent, setFilePresent] = useState(false)
  let [file, setFile] = useState('')

  let [info, setInfo] = useState([])

  let [position, setPosition] = useState([])
  let [barShown, setBarShown] = useState(true)
  let [loading, setLoading] = useState(false)
  let [buttonDisabled, setButtonDisabled] = useState(true)

  let [tripId, setTripId]= useState('')
  let [latitude, setLatitude] = useState('')
  let [longitude, setLongitude] = useState('')
  let [startTime, setStartTime] = useState(new Date())
  let [maxDestinationTime, setMaxDestinationTime] = useState(new Date())

  const icon = new Icon({
    iconUrl: logo, 
    iconSize: [35, 35]
  })

  // let handleFile = (e) => {
  //   console.log(e.target.files[0])
  //   if (e.target.files[0]){
  //     setFilePresent(true)
  //     setFile(e.target.files[0])
  //     var reader = new FileReader();
  //     reader.onload = onReaderLoad;
  //     reader.readAsText(e.target.files[0]);
  //     setButtonDisabled(false)
  //   } else {
  //     setFilePresent(false)
  //     setButtonDisabled(true)
  //   }
      
  // }

  // function onReaderLoad(event){
  //   console.log(event.target.result);
  //   var obj = JSON.parse(event.target.result);
  //   console.log(obj)
  // }

  // let Form = () => (
  //   <Box component="form" noValidate autoComplete="off" sx={{textAlign: 'center', m: 1, mb: 4}}>
  //     <Button
  //       variant="contained"
  //       component="label"
  //       color="secondary"    
  //       >
  //       Input Trip Plan
  //       <input
  //         type="file"
  //         accept='.json'
  //         id="fileUpload"
  //         onChange={handleFile}
  //         hidden
  //       />
  //   </Button>
    
  //   <IconI sx={{ ml: 1}}>
  //   {filePresent? (
  //           <CheckCircleOutlineIcon fontSize='medium' color="success"/>
  //       ): (
  //           <CircleOutlinedIcon fontSize='medium' color="success"/>
  //       )
  //   }
  //   </IconI>
  //   </Box>
  // )


  /*
  "input_trip_id": 201,
  "start_latitude": 35.929790,
  "start_longitude": -89.892014,
  "start_time": "2022-02-28 00:00:00",
  "max_destination_time": "2022-02-29 12:00:00"
  */
  useEffect(() => {

    if (tripId === '' || latitude === '' || longitude === "" || startTime === "" || maxDestinationTime === ""){
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false)
    }


  }, [tripId, latitude, longitude, startTime, maxDestinationTime ])

  let handleChange=(event) => {
    if (event.target.name === 'tripId'){
      setTripId(event.target.value)
    } else if (event.target.name === 'latitude'){
      setLatitude(event.target.value)
    } else if (event.target.name === 'longitude'){
      setLongitude(event.target.value)
    }
  }


  let getLocation = () => {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition)
    } else {
      console.log("Not supported")
    }
  }  

  let showPosition = (position) => {
    if (position !== undefined){
      setPosition([position.coords.latitude, position.coords.longitude])
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  let toggleBar = () => {
    setBarShown(!barShown)
  }

  let handleClose = () => {
    setLoading(false)
  }

  let handleSubmit = () => {

    let obj  = {
      "input_trip_id": tripId,
      "start_latitude": latitude,
      "start_longitude": longitude,
      "start_time": startTime.toISOString(),
      "max_destination_time": maxDestinationTime.toISOString()
    }

   
    setLoading(true)

    setTimeout(() => {
      setInfo(data)
      console.log(obj)
      setLoading(false)
      setBarShown(false)
    }, 3000)
  }

  return (
    <Fragment>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" size={55} />
      </Backdrop>

      <AppBar sx={{p: 1.6, backgroundColor: 'orange', position: 'sticky' }}>
        <Typography variant="h6" sx={{textAlign: 'center', color: 'white', fontWeight: 800}}>Honk</Typography>
        <Tooltip title="Your Trip">
          <IconButton
            sx={{mr: 2, borderRadius: '25px', mt: 0.5, position: 'absolute', right: '0', top: '0'}}
            onClick={toggleBar}
            >
            <LocalShippingIcon fontSize='large' color="primary"/>
          </IconButton>
        </Tooltip>
      </AppBar>

      <Slide direction="left" in={barShown} mountOnEnter unmountOnExit>

      <AppBar sx={{mt: 12, width: '25%', p: 5, mx: 3, borderRadius: '15px', bgcolor: 'orange', minWidth: 320}}>
        <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 800, mb: 2}} variant="h5">
          Trip Request
        </Typography>
        {/* <br/>
        {
          position.length === 0 ? (
            <Fragment>
              <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 700}} variant="h6">
                You need to enable your GeoLocation to see your current location
              </Typography>
              <br/>
            </Fragment>
          ): (
            <Fragment>
              <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 700}} variant="h6">
                Latitude: {position[0]}
              </Typography>
              <br/>
              <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 700}} variant="h6">
                Longitude: {position[1]}
              </Typography>
              <br/>
            </Fragment>
          )
        }
       
        <Typography sx={{textAlign: 'center', color: 'white', fontWeight: 700}} variant="h6">
         {date}
        </Typography>
        <br/> */}
      <Box component="form" noValidate sx={{textAlign: 'center', m: 1, mb: 4}} onSubmit={handleSubmit}>
        <TextField label="Input Trip Id" type="number" variant="filled" sx={{m: 1}} required name="tripId" value={tripId} onChange={handleChange} />
        <TextField label="Start Latitude" type='number' variant="filled" sx={{m: 1}} required value={latitude} name="latitude" onChange={handleChange}/>
        <TextField label="Start Longitude" type="number" sx={{m: 1}} required value={longitude} name="longitude" onChange={handleChange}/>    
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} required  variant="filled" sx={{m: 1}}/>}
            label="Start Time"
            minDate={new Date()}
            value={startTime}
            onChange={(newValue) => {
              setStartTime(newValue);
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} required  variant="filled" sx={{m: 1}}/>}
            label="Max Destination Time"
            minDate={new Date()}
            value={maxDestinationTime}
            onChange={(newValue) => {
              setMaxDestinationTime(newValue);
            }}
          />
        </LocalizationProvider>
        <Button variant='contained' onClick={handleSubmit} disabled={buttonDisabled} sx={{mt: 2}}>
            Find Route
        </Button>
      </Box>

   
      </AppBar>
    </Slide>
   
    <MapContainer center={ position.length === 0 ? [45.501690, -73.567253] : position} zoom={5} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {
        position.length === 0 ? (
          <Fragment>
          </Fragment>
        ): (
          <Marker position={position} icon={icon} >
            <Popup>
              <h4><b>Current Location</b></h4>
            </Popup>
          </Marker>
        )
      }
      
      {
        info.map((element, i) => (
          <Fragment>
            {
              i == 0 ? (
                <Marker position={[element["origin_latitude"], element["origin_longitude"]]} color="blue" icon={icon}>
                  <Popup>
                    <i>Start Point</i><br/>
                    <b>Origin</b><br/>{element["origin_city"]},  {element["origin_state"]}
                  </Popup>
                </Marker>
              ): (
                <Marker position={[element["origin_latitude"], element["origin_longitude"]]} color="blue">
                  <Popup>
                    <b>Origin</b><br/>{element["origin_city"]},  {element["origin_state"]}
                  </Popup>
                </Marker>
              )
            }
           
            <Polyline 
              positions={[
                [element["origin_latitude"], element["origin_longitude"]], [element["destination_latitude"], element["destination_longitude"]],
              ]} 
              color={'blue'}>
            </Polyline>

            {
              i == data.length -1 ? (
                <Marker position={[element["destination_latitude"], element["destination_longitude"]]} icon={icon}>
                  <Popup>
                  <i>End Point</i><br/>
                  <b>Destination</b><br/>{element["destination_city"]},  {element["destination_state"]}
                  </Popup>
                </Marker>
              ): (
                <Marker position={[element["destination_latitude"], element["destination_longitude"]]}>
                  <Popup>
                  <b>Destination</b><br/>{element["destination_city"]},  {element["destination_state"]}
                  </Popup>
                </Marker>
              )
            }
          
          </Fragment>
        ))
      }

    </MapContainer>
    </Fragment>
  );
}

export default App;
