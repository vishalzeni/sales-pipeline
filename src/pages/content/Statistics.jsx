import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const StatisticsOverview = () => {
  const [dataRows, setDataRows] = useState([]);
  const [stepsData, setStepsData] = useState(null);

  useEffect(() => {
    const fetchedData = localStorage.getItem('dataRows');
    if (fetchedData) {
      const parsedData = JSON.parse(fetchedData);
      setDataRows(parsedData);
    }

    const fetchedStepsData = localStorage.getItem('stepsData');
    if (fetchedStepsData) {
      const parsedStepsData = JSON.parse(fetchedStepsData);
      setStepsData(parsedStepsData);
    }
  }, []);

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f6f9' }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: 'primary.main', marginBottom: 4 }}>
        Statistics Overview
      </Typography>

      <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* Total Data Box */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: 15 }, backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', marginBottom: 1 }}>
                Total Data
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '2.5rem', color: 'primary.main', marginTop: 2 }}>
                {dataRows.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Leads Box */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: 15 }, backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', marginBottom: 1 }}>
                Total Leads
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '2.5rem', color: 'primary.main', marginTop: 2 }}>
                {stepsData ? stepsData.Step1.length : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Placeholder Boxes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: 15 }, backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', marginBottom: 1 }}>
                Box 3
              </Typography>
              <Typography variant="h4" color="textSecondary" sx={{ fontWeight: 400 }}>
                {/* Placeholder content */}
                Not Available
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: 15 }, backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', marginBottom: 1 }}>
                Box 4
              </Typography>
              <Typography variant="h4" color="textSecondary" sx={{ fontWeight: 400 }}>
                {/* Placeholder content */}
                Not Available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsOverview;
