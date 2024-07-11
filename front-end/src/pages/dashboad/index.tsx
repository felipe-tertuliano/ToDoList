import React, { useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import "./styles.css";
import { useAuth } from "../../hooks/auth";
import { useNavigate } from "react-router-dom";
import Table from "./table";
import { Divider } from "@mui/material";

const Dashboard: React.FC = () => {

    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSignOut = useCallback(() => {
        signOut();
        navigate("/sign-up");
    }, [signOut]);

    return <>
        <AppBar className="my-appbar" position="static">
            <Toolbar disableGutters style={{ display: 'flex', justifyContent: "right" }}>
                <Typography variant="h6" component="div" sx={{ marginRight: "15px" }}>
                    {user?.username}
                </Typography>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt={user?.username}>{user?.username[0].toUpperCase()}</Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem key="signOut" onClick={handleSignOut}>
                            <Typography textAlign="center">Sign out</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        <Table />
    </>;
}
export default Dashboard;
