import React, { useMemo } from 'react';
import FixturesPage from './FixturesPage';

const FixturesByRound = ({ fixtures, loading, error, round }) => {
  const filteredFixtures = useMemo(
    () => fixtures.filter((fixture) => String(fixture.round) === String(round)),
    [fixtures, round]
  );

  return (
    <FixturesPage
      fixturesOverride={filteredFixtures}
      loadingOverride={loading}
      errorOverride={error}
    />
  );
};

export default FixturesByRound;
