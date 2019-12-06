import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Addcar from './Addcar';
import Editcar from './Editcar';

function Carlist() {
    const useStyles = makeStyles(theme => ({
        close: {
          padding: theme.spacing(0.5),
        },
      }));

    const [cars, Setcars] = useState([]);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => Setcars(data._embedded.cars))
    }


    const deleteCar = (link) => {
        if (window.confirm('Are you sure?')) {
        fetch(link, {method: 'DELETE'})
        .then(res => fetchData())
        .catch(err => console.error(err))
        handleClick()
    }
}

const saveCar = (car) => {
    fetch('https://carstockrest.herokuapp.com/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    })
    .then(res => fetchData())
    .catch(err => console.error(err))

}

const updateCar = (car, link) => {
      fetch(link, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    })
    .then(res => fetchData())
    .catch(err => console.error(err)) 
}

const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


    const columns = [
        {
            Header: 'Brand',
            accessor: 'brand'
        },
        {
            Header: 'Model',
            accessor: 'model'
        },
        {
            Header: 'Color',
            accessor: 'color'
        },
        {
            Header: 'Fuel',
            accessor: 'fuel'
        },
        {
            Header: 'Year',
            accessor: 'year'
        },
        {
            Header: 'Price',
            accessor: 'price'
        },
        {
          filterable: false,
          sortable: false,
          Header: <Addcar saveCar={saveCar} />,
         Cell: row => <Editcar car={row.original} updateCar={updateCar}/>,
         width: 150
      },
        {
            filterable: false,
            sortable: false,
           accessor: '_links.self.href',
           Cell: row => <Button color="secondary" variant="outlined" size="small"  onClick={() => deleteCar(row.value)} >Delete</Button>,
           width: 100
        },

       
    ]


    return (
        <div>
             <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Car was deleted</span>}
        action={[
          <Button key="delete" color="primary" size="small" onClick={handleClose}>
            Close
          </Button>,
       
        ]}
      />
            <ReactTable defaultPageSize= {10} filterable={true} data={cars} columns={columns}/>
           
           
        </div>
    )
}

export default Carlist;
