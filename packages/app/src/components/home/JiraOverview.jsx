import { useEffect, useState } from 'react';
// import { getIssues } from '../../jira-plugin/get-issues';

const JiraOverview = () => {
  const [issues, setIssues] = useState([0, 0, 0]);
  console.log('hi');
  useEffect(() => {
    async function logMovies() {
      const response = await fetch(
        'https://ahmetuten.atlassian.net/rest/api/2/search',
        {
          mode: 'cors',
        },
      );
      console.log('response:', response);
      if (!response.ok) {
        console.error('Fetch error:', response.status, response.statusText);
        return;
      }
      const movies = await response.json();
      console.log('movies: ', movies);
    }

    logMovies();
  }, []);

  return (
    <div className="jira-overview">
      <h1>Issues</h1>
      <ul>
        <li>To Do: {issues[0]}</li>
        <li>Done: {issues[1]}</li>
        <li>In Progress: {issues[2]}</li>
      </ul>
    </div>
  );
};

export default JiraOverview;
