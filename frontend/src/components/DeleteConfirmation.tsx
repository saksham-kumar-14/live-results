import React from "react";
import axios from "axios";
import { DELETE_URL } from "../utils/constants";
import "../styles/DeleteConfirmation.css"

interface Participant {
    id?: number; // Optional ID for the participant
    name: string;
    solves: string[];
}

interface Props{
    setDeleteBox: Function;
    entry: Participant;
    event: string;
}

const DeleteConfirmation: React.FC<Props> = ({setDeleteBox, entry, event}) => {

    const handleDeleteParticipant = async () => {
        const participantID = entry.id;
        if (participantID) {
            const participant = {
            "id" : participantID,
            }
            try {
            const response = await axios.post(`${DELETE_URL}?event=${event}`, participant);
            const data = await response.data;
            if (!data.deleted) {
                alert("Error deleting participant. Please try again.")
            }else{
                window.location.reload();
            }
            } catch (error) {
            console.error('Error updating participant:', error);
            alert('Error updating participant. Please try again.');
            }
        } else {
            alert('Please select Id');
        }

    }

    return(
        <div className="container">
            <div className="sub-container">
                <p className="delete-statement">Are you sure you want to delete this entry for <u>{entry.name}</u>?</p>
                <div className="btns-container">
                    <button onClick={()=> setDeleteBox(false) }>Cancel</button>
                    <button onClick={handleDeleteParticipant} >Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmation;