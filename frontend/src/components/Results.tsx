import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import "../styles/Results.css";

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
    <div className="results">
      <header className="results__header">
        <nav className="results__nav">
          <ul className="results__nav-list">
            {/* Replace 'event1', 'event2', etc. with actual event identifiers */}
            <li className="results__nav-item">
              <Link to="/results/3x3" className="results__nav-link">
                <button type='button'> 3x3 </button>
              </Link>
            </li>
            <li className="results__nav-item">
              <Link to="/results/2x2" className="results__nav-link">
                <button type='button'> 2x2 </button>
              </Link>
            </li>
            <li className="results__nav-item">
              <Link to="/results/4x4" className="results__nav-link">
                <button type='button'> 4x4 </button>
              </Link>
            </li>
            <li className="results__nav-item">
              <Link to="/results/pyra" className="results__nav-link">
                <button type='button'> Pyraminx </button>
              </Link>
            </li>
            <li className="results__nav-item">
              <Link to="/results/3x3oh" className="results__nav-link">
                <button type='button'> 3x3 One-Handed </button>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <h2 className="results__title">Results for {event.toUpperCase()}</h2>
      {participants.length === 0 ? (
        <p className="results__no-data">No results available.</p>
      ) : (
        <table className="results__table">
          <thead className="results__thead">
            <tr className="results__header-row">
              <th className="results__header-cell">S.No.</th>
              <th className="results__header-cell">Participant</th>
              <th className="results__header-cell">Solves</th>
              <th className="results__header-cell">Best</th>
              <th className="results__header-cell">Mean</th>
            </tr>
          </thead>
          <tbody className="results__tbody">
            {participants.map((participant, index) => (
              <tr key={index} className="results__row">
                <td className="results__cell">{index + 1}</td> {/* Serial number */}
                <td className="results__cell">{participant.name}</td>
                <td className="results__cell">
                  {participant.solves.map((solve, idx) => (
                    <span key={idx} className="results__solve">
                      {solve}
                      {idx < participant.solves.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td className="results__cell">{calculateBestSolve(participant.solves)}</td>
                <td className="results__cell">{calculateMeanSolve(participant.solves)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Results;
