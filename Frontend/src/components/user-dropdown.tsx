import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Menu, MenuItem, IconButton, Divider, ListItemIcon, Typography } from "@mui/material"
import { Avatar } from "@mui/material"
import { UserAuthContext } from "../auth/user-auth-context"
import { History, LogOut, User } from "lucide-react"
import { useState } from "react"

interface UserDropdownProps {
  user: {
    id: string
    name: string
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  const { signOut } = useContext(UserAuthContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            overflow: 'visible',
            mt: 1.5,
            minWidth: 220,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
          {user.name}
        </Typography>
        <Typography variant="body2" sx={{ px: 2, pb: 1, color: 'text.secondary' }}>
          ID: {user.id}
        </Typography>
        <Divider />
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <User size={20} />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/history">
          <ListItemIcon>
            <History size={20} />
          </ListItemIcon>
          History
        </MenuItem>
        <Divider />
        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <LogOut size={20} />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </>
  )
}
