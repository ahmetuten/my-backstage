import './_jira-overview.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardHeader, Divider } from '@material-ui/core';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const header = 'Word of the Day';

export default function BasicCard() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <CardHeader title={header} />
        <Divider />
        <div style={{ padding: 16 }}>
          <div className="status-container">
            <div className="backlog">
              <HourglassEmptyIcon />
            </div>
            <div className="in-progress"></div>
            <div className="done"></div>
          </div>
        </div>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
