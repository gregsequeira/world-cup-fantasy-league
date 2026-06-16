import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import FixturesPage from './FixturesPage';

function FixturesByRound({ round }) {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    axios.get('/fixtures')
      .then(res => setFixtures(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredFixtures = fixtures.filter(f => String(f.round) === String(round));

  return <FixturesPage fixturesOverride={filteredFixtures} />;
}

export default FixturesByRound;
