import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar } from '@mui/material';
import CarList from './components/cars/cars';
import AppTheme from './theme/AppTheme';
import MenuIcon from '@mui/icons-material/Menu';
import ListTransactions from './components/cars/listTransactions';
import Dashboard from './components/dashboard/dashboard';
import Expenses from './components/expenses/expenses';
import CarDetails from './components/carDetails/details';

interface ListItemLinkProps {
  icon?: React.ReactElement<unknown>;
  primary: string;
  to: string;
}

const menus  = [
  {
    title: 'Keluar Masuk',
    element: <CarList />,
    path: '/',
    // icon: <PointOfSaleIcon />,
    // permission: PERMISSIONS.TRANSACTIONS,
    // roles: ['admin', 'cashier'], // Allowed roles
  },
  {
    title: 'Transaksi Mobil',
    element: <ListTransactions />,
    path: '/transactions',
    // icon: <PointOfSaleIcon />,
    // permission: PERMISSIONS.TRANSACTIONS,
    // roles: ['admin', 'cashier'], // Allowed roles
  },
  {
    title: 'Dashboard',
    element: <Dashboard />,
    path: '/dashboard',
    // icon: <PointOfSaleIcon />,
    // permission: PERMISSIONS.TRANSACTIONS,
    // roles: ['admin', 'cashier'], // Allowed roles
  },
  {
    title: 'Expenses',
    element: <Expenses />,
    path: '/expenses',
    // icon: <PointOfSaleIcon />,
    // permission: PERMISSIONS.TRANSACTIONS,
    // roles: ['admin', 'cashier'], // Allowed roles
  },
  {
    title: 'Car Details',
    element: <CarDetails />,
    path: '/car-details',
    // icon: <PointOfSaleIcon />,
    // permission: PERMISSIONS.TRANSACTIONS,
    // roles: ['admin', 'cashier'], // Allowed roles
  },
];

const App: React.FC = () => {
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu]=useState("");
  
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to } = props;
  
    return (
      <ListItemButton component={Link} to={to} onClick={()=>setSelectedMenu(primary)} selected={selectedMenu===primary}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItemButton>
    );
  }

  return (
    <AppTheme>
      <Router>
      <AppBar position="fixed">
        <Toolbar>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {menus.map((menu) => (
              <ListItem key={menu.title} disablePadding>
                <ListItemLink to={menu.path} primary={menu.title} />
              </ListItem>
            ))}
            
          </List>
        </Box>
      </Drawer>
      <Offset />
        <Routes>
          <Route path="/" element={<CarList />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/transactions" element={<ListTransactions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/car-details" element={<CarDetails />} />
        </Routes>
      </Router>
    </AppTheme>
  );
};

export default App;
