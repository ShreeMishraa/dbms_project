import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useContext, useState } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

// Import all needed icons
import HomeIcon from '@mui/icons-material/Home'
import BookIcon from '@mui/icons-material/Book'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import GroupIcon from '@mui/icons-material/Group'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PaymentIcon from '@mui/icons-material/Payment'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
  }

  const handleProfileClick = () => {
    handleMenuClose()
    navigate('/profile')
  }

  const getAvatarText = () => {
    if (user?.first_name) return user.first_name.charAt(0)
    return user?.role === 'librarian' ? 'L' : 'U'
  }

  // Define menu items based on user role
  const studentItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Books', icon: <BookIcon />, path: '/books' },
    { text: 'Authors', icon: <PersonIcon />, path: '/authors' },
    { text: 'Publishers', icon: <BusinessIcon />, path: '/publishers' },
    { text: 'Reservations', icon: <ReceiptIcon />, path: '/reservations' },
    { text: 'Fines', icon: <AccountBalanceIcon />, path: '/fines' },
    { text: 'GD Rooms', icon: <MeetingRoomIcon />, path: '/gd-rooms' },
    { text: 'My GD Bookings', icon: <GroupIcon />, path: '/my-gd-reservations' }
  ]

  const librarianItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Manage Books', icon: <MenuBookIcon />, path: '/books/add' },
    { text: 'Books', icon: <BookIcon />, path: '/books' },
    { text: 'Manage Authors', icon: <PersonIcon />, path: '/authors' },
    { text: 'Manage Publishers', icon: <BusinessIcon />, path: '/publishers' },
    { text: 'Manage Fines', icon: <PaymentIcon />, path: '/fines' }
  ]

  const menuItems = user?.role === 'librarian' ? librarianItems : studentItems

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {user && (
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>

          {user && (
            <>
              <Typography
                variant="body2"
                sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
              >
                {user.role === 'librarian'
                  ? 'Librarian'
                  : `${user.first_name || ''} ${user.last_name || ''}`}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar>{getAvatarText()}</Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' }
        }}
      >
        <List>
          {menuItems.map(item => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
