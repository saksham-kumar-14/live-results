import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import "../styles/Results.css";
import { BASE_URL } from '../utils/constants';

interface Participant {
  id?: number; // Optional ID for the participant
  name: string;
  solves: string[];
}

const Results: React.FC = () => {
  const { event } = useParams<{ event: string }>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sortField, setSortField] = useState<string>('mean'); // Default sort field
  const [sortOrder, setSortOrder] = useState<string>('asc'); // Default sort order

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`${BASE_URL}?event=${event}`); // Use the variable here
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


  const handleSort = (field: string) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'best':
        aValue = calculateBestSolve(a.solves);
        bValue = calculateBestSolve(b.solves);
        break;
      case 'mean':
        aValue = calculateMeanSolve(a.solves);
        bValue = calculateMeanSolve(b.solves);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    // Handle sorting for numeric values
    if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
      return sortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
    }

    // Handle sorting for string values
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="results">
      <header className="results__header">
        <nav className="results__nav">
          <ul className="results__nav-list">
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
              <th className="results__header-cell" onClick={() => handleSort('name')}>
                Participant {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="results__header-cell">
                Solves
              </th>
              <th className="results__header-cell" onClick={() => handleSort('best')}>
                Best {sortField === 'best' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="results__header-cell" onClick={() => handleSort('mean')}>
                Mo3/Ao5 {sortField === 'mean' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="results__tbody">
            {sortedParticipants.map((participant, index) => (
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
