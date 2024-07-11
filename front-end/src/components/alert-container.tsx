import React from "react";
import useAlert, { IAlertMessage } from "../hooks/alert";
import { Alert, AlertTitle } from "@mui/material";

interface IProps {
    messages: IAlertMessage[];
}

const AlertContainer: React.FC<IProps> = ({ messages }) => {

    const { removeAlert } = useAlert();

    return (
        <div style={{ position: "absolute", inset: "0px 0px auto auto" }}>
            {messages.map((message, i) => (
                <Alert style={{ margin: "10px" }} severity={message.type} onClose={() => removeAlert(message.id)}>
                    <AlertTitle>{message.title}</AlertTitle>
                    {message.description}
                </Alert>
            ))}
        </div>
    );
};

export default AlertContainer;