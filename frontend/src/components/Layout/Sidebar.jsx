import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  MeetingRoom as MeetingRoomIcon,
  AccountBalance as AccountBalanceIcon,
  MenuBook as MenuBookIcon,
  Group as GroupIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

const Sidebar = ({ sidebarOpen, setSidebarOpen, userRole }) => {
  const drawerWidth = 240;
  const location = useLocation();

  const studentItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Books', icon: <BookIcon />, path: '/books' },
    { text: 'Authors', icon: <PersonIcon />, path: '/authors' },
    { text: 'Publishers', icon: <BusinessIcon />, path: '/publishers' },
    { text: 'Reservations', icon: <ReceiptIcon />, path: '/reservations' },
    { text: 'Fines', icon: <AccountBalanceIcon />, path: '/fines' },
    { text: 'GD Rooms', icon: <MeetingRoomIcon />, path: '/gd-rooms' },
    { text: 'My GD Bookings', icon: <GroupIcon />, path: '/my-gd-reservations' }
  ];

  const librarianItems = [
    { text: 'Manage Books', icon: <MenuBookIcon />, path: '/books/add' },
    { text: 'Manage Authors', icon: <PersonIcon />, path: '/authors' },
    { text: 'Manage Publishers', icon: <BusinessIcon />, path: '/publishers' },
    { text: 'Manage Fines', icon: <PaymentIcon />, path: '/fines' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Common styles for all list items to ensure consistent appearance
  const listItemStyle = {
    '&.Mui-selected': {
      backgroundColor: '#e3f2fd',
      '&:hover': {
        backgroundColor: '#bbdefb'
      }
    },
    '&:hover': {
      backgroundColor: '#e8f0fe'
    },
    transition: 'background-color 0.2s'
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        },
        display: { xs: 'none', sm: 'block' } // Hide on mobile, show on desktop
      }}
      open={sidebarOpen}
    >
      <Toolbar />
      <List>
        {studentItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={isActive(item.path)}
            sx={listItemStyle}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                color: isActive(item.path) ? 'primary' : 'inherit',
                fontWeight: isActive(item.path) ? 'medium' : 'regular'
              }}
            />
          </ListItem>
        ))}
        
        {userRole === 'librarian' && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem>
              <ListItemText primary="Librarian Tools" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>
            {librarianItems.map((item) => (
              <ListItem 
                key={item.text} 
                component={Link} 
                to={item.path}
                selected={isActive(item.path)}
                sx={listItemStyle}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    color: isActive(item.path) ? 'primary' : 'inherit',
                    fontWeight: isActive(item.path) ? 'medium' : 'regular'
                  }}
                />
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;