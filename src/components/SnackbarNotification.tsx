import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarNotificationProps {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
    onClose: () => void;
}

const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({
    open,
    message,
    severity,
    onClose,
}) => {
    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{
            vertical: "top",
            horizontal: "center",
        }}>
            <Alert onClose={onClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarNotification;
