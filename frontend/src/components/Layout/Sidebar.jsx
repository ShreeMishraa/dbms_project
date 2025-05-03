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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5'
        },
      }}
      open={sidebarOpen}
    >
      <Toolbar />
      <List>
        {studentItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={isActive(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#bbdefb'
                }
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
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
                button 
                key={item.text} 
                component={Link} 
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    '&:hover': {
                      backgroundColor: '#bbdefb'
                    }
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;