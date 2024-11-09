import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Participant {
  id?: number; // Optional ID for the participant
  name: string;
  solves: string[];
}

const Results: React.FC = () => {
  const { event } = useParams<{ event: string }>();
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`http://10.102.71.103:5000/participants?event=${event}`);
        setParticipants(response.data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };
    fetchParticipants();
  }, [event]);

  const calculateBestSolve = (solves: string[]) => {
    const times = solves.map(Number).filter((time) => !isNaN(time));
    return times.length > 0 ? Math.min(...times).toFixed(2) : 'N/A';
  };

  const calculateMeanSolve = (solves: string[]) => {
    const times = solves.map(Number).filter((time) => !isNaN(time));
    if (times.length >= 5) {
      // Sort the times and discard the best and worst
      const sortedTimes = times.sort((a, b) => a - b);
      const middleThree = sortedTimes.slice(1, 4); // Get the middle 3 times
      const sum = middleThree.reduce((acc, time) => acc + time, 0);
      return (sum / middleThree.length).toFixed(2);
    } else if (times.length > 0) {
      // If less than 5 solves, calculate the average of available times
      const sum = times.reduce((acc, time) => acc + time, 0);
      return (sum / times.length).toFixed(2);
    }
    return 'N/A';
  };

  return (
    <div>
      <h2>Results for {event.toUpperCase()}</h2>
      {participants.length === 0 ? (
        <p>No results available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Participant</th>
              <th>Solves</th>
              <th>Best Solve</th>
              <th>Mean Solve</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Serial number */}
                <td>{participant.name}</td>
                <td>
                  {participant.solves.map((solve, idx) => (
                    <span key={idx}>
                      {solve}
                      {idx < participant.solves.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td>{calculateBestSolve(participant.solves)}</td>
                <td>{calculateMeanSolve(participant.solves)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Results;
