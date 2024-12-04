import React, { useState } from 'react';
import axios from 'axios';
import { UPDATE_URL } from '../utils/constants';
import "../styles/updateBox.css"

interface Participant {
    id?: number; // Optional ID for the participant
    name: string;
    solves: string[];
}

interface Props{
  setUpdateBox: Function;
  entry: Participant;
  event: string;
}



const UpdateBox: React.FC<Props> = ({setUpdateBox, entry, event}) => {

    const [name, setName] = useState(entry.name);
    const [solves, setSolves] = useState<string[]>(entry.solves);
    const id = entry.id;

    const handleSolveChange = (index: number, value: string) => {
      const updatedSolves = [...solves];
      updatedSolves[index] = value;
      setSolves(updatedSolves);
    };

    const handleUpdateParticipant = async () => {
      if (name && solves.every(solve => solve)) {
        const newParticipant: Participant = { id, name, solves };
        console.log(newParticipant);
        console.log(event);
        try {
          const response = await axios.post(`${UPDATE_URL}?event=${event}`, newParticipant);
          const data = await response.data;
          if (data.updated) {
            window.location.reload();
            setUpdateBox(false);
          }else{
            alert('Error updating participant. Please try again.');
          }
        } catch (error) {
          console.error('Error updating participant:', error);
          alert('Error updating participant. Please try again.');
        }
      } else {
        alert('Please enter a name and all solve times.');
      }
    }

    return(
      <div className='container'>
        <div className='sub-container'>
            <div className='close-btn-container'>
              <button onClick={()=>{
                setUpdateBox(false);
              }}>Close</button>
            </div>
            <div className='input-container' >
                <input
                  className='data-entry__input' 
                  defaultValue={entry.name}
                  placeholder='Updated Name'
                  onChange={(e)=>{setName(e.target.value)}}
                />
                {entry.solves.map((_, index) => (
                  <input
                    className='data-entry__input'
                    key={index}
                    type="text"
                    value={solves[index]}
                    onChange={(e) => handleSolveChange(index, e.target.value)}
                    placeholder={`Solve Time ${index + 1}`}
                    defaultValue={entry.solves[0]}
                  />
                ))}

                <button onClick={()=>{
                  handleUpdateParticipant();
                }}>Update</button>
            </div>
        </div>
      </div>
    )
} 

export default UpdateBox;