import React, { useCallback } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import useAlert from "../hooks/alert";

const SignUp: React.FC = () => {

    const { addAlert } = useAlert();
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let data = new FormData(event.currentTarget);
        let rawUser = {
            username: data.get("username")?.toString(),
            password: data.get("password")?.toString(),
        };

        if (!rawUser.username || !rawUser.password) {
            addAlert({
                type: "warning",
                title: "Invalid data",
                description: "Invalid username or/and password.",
            });
        } else {
            signUp(rawUser as any).then(() => {
                addAlert({
                    type: "success",
                    title: "Success",
                    description: "User signed up successfuly!",
                });
                navigate("/sign-in");
            }).catch((message) => {
                addAlert({
                    type: "error",
                    title: "Error",
                    description: message ?? "Error while signing up user.",
                });
            });
        }
    }, [addAlert, signUp, navigate]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2" onClick={() => navigate("/sign-in")}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default SignUp;