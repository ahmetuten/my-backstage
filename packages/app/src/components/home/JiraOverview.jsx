import React from 'react';
import getIssues from '../../jira-plugin/get-issues';

const JiraOverview = () => {
  const [issues, setIssues] = React.useState([0, 0, 0]);

  useEffect(() => {
    const getIssuesAsync = async () => {
      const results = await getIssues();
      setIssues(results);
    };

    getIssuesAsync();
  }, []);

  return (
    <div>
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
