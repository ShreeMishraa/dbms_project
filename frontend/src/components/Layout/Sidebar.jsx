import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar, Typography, Box } from '@mui/material';
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
  LibraryAdd as LibraryAddIcon,
  Group as GroupIcon,
  Payment as PaymentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  List as ListIcon
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

    // Enhanced librarian menu with proper CRUD operations
    const librarianItems = [
      { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
      {
        text: 'Book Management',
        icon: <MenuBookIcon />,
        path: '/librarian/books',
        children: [
          { text: 'All Books', icon: <ListIcon />, path: '/books' },
          { text: 'Add Book', icon: <AddIcon />, path: '/books/add' },
          { text: 'Manage Books', icon: <EditIcon />, path: '/librarian/books/manage' }
        ]
      },
      // Only include Student Management once with a unique path
      { text: 'Student Management', icon: <PeopleIcon />, path: '/librarian/students', key: 'student-mgmt' },
      {
        text: 'Author Management',
        icon: <PersonIcon />,
        path: '/authors',
        children: [
          { text: 'All Authors', icon: <ListIcon />, path: '/authors' },
          { text: 'Add Author', icon: <AddIcon />, path: '/authors/add' }
        ]
      },
      {
        text: 'Publisher Management',
        icon: <BusinessIcon />,
        path: '/publishers',
        children: [
          { text: 'All Publishers', icon: <ListIcon />, path: '/publishers' },
          { text: 'Add Publisher', icon: <AddIcon />, path: '/publishers/add' }
        ]
      },
      {
        text: 'Fine Management',
        icon: <PaymentIcon />,
        path: '/librarian/fines',
        children: [
          { text: 'Issue Fine', icon: <AddIcon />, path: '/librarian/fines/issue' },
          { text: 'All Fines', icon: <ListIcon />, path: '/librarian/fines/all' }
        ]
      },
      {
        text: 'GD Room Management',
        icon: <MeetingRoomIcon />,
        path: '/librarian/gd-rooms',
        children: [
          { text: 'All GD Rooms', icon: <ListIcon />, path: '/gd-rooms' },
          { text: 'Add GD Room', icon: <AddIcon />, path: '/librarian/gd-rooms/add' }
        ]
      },
      {
        text: 'Reservations Management',
        icon: <ReceiptIcon />,
        path: '/librarian/reservations',
        children: [
          { text: 'Book Reservations', icon: <MenuBookIcon />, path: '/librarian/reservations/books' },
          { text: 'GD Room Reservations', icon: <MeetingRoomIcon />, path: '/librarian/reservations/gd' }
        ]
      }
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

  // Choose menu items based on user role
  const menuItems = userRole === 'librarian' ? librarianItems : studentItems;

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
      <Box sx={{ overflow: 'auto' }}>
        <List component="nav" aria-label="main navigation">
          {userRole === 'librarian' && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                LIBRARIAN PANEL
              </Typography>
            </Box>
          )}
          
          {menuItems.map((item) => (
            <React.Fragment key={item.key || item.text}>
              <ListItem 
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
              
              {/* Render sub-menu items for librarian if available */}
              {item.children && userRole === 'librarian' && (
                <List component="div" disablePadding>
                  {item.children.map(child => (
                    <ListItem
                      key={child.text}
                      component={Link}
                      to={child.path}
                      selected={isActive(child.path)}
                      sx={{
                        ...listItemStyle,
                        pl: 4
                      }}
                    >
                      <ListItemIcon sx={{ color: isActive(child.path) ? 'primary.main' : 'inherit' }}>
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={child.text}
                        primaryTypographyProps={{ 
                          color: isActive(child.path) ? 'primary' : 'inherit',
                          fontWeight: isActive(child.path) ? 'medium' : 'regular',
                          fontSize: '0.875rem'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;