import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from './Assets/menu.png';
import { ThemeProvider } from '@mui/material';
import theme from './CustomTheme';
import { Link } from 'react-router-dom/cjs/react-router-dom';

export function TopMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => { // handle what happen on button click
      setAnchorEl(event.currentTarget); // focus remains on anchored element
    };
    const handleClose = () => { // handle what happens when on close
      setAnchorEl(null); // anchored element is closed
    };

    return (
      <div>
        {/*
            Button to open the dropdown menu
        */}
        <Button 
            id = 'menu' 
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
          {/*
            Dropdown menu button is just an image
          */}
          <img src={MenuIcon} width="100" alt="folder"/>
          <label></label>
        </Button>

        <ThemeProvider theme = {theme}>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
              {/*
                When menu opened, 3 items rendered
                Home button -> returns user to main page
                Map button -> takes user to map page
                Settings button -> takes user to settings page
              */}
              <Link to="/"><MenuItem id = "menu-item" onClick={handleClose}>Home</MenuItem></Link>
              <Link to="/map"><MenuItem id = "menu-item" onClick={handleClose}>Map View</MenuItem></Link>
              <Link to="/settings"><MenuItem id = "menu-item" onClick={handleClose}>Settings</MenuItem></Link>
          </Menu>
        </ThemeProvider>
      </div>
    );
}

export default TopMenu;