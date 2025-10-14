import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { gridSpacing } from 'store/constant';
import { ExportMenu } from 'ui-component/menu/ExportMenu';
import { handleExcelExport } from '../../components/PerformanceExport';
import Backend from 'services/backend';
import DrogaCard from 'ui-component/cards/DrogaCard';
import PerformanceCard from 'ui-component/cards/PerformanceCard';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import GetToken from 'utils/auth-token';
import PropTypes from 'prop-types';

import Fallbacks from 'utils/components/Fallbacks';
import DrogaDonutChart from 'ui-component/charts/DrogaDonutChart';
import ManagerPerKpiPerformance from 'views/Report/manager/components/ManagerPerKpiPerformance';
import MonthlyTrends from 'views/performance/components/MonthlyTrends';
import { mt } from 'date-fns/locale';

const ManagerUnitPerformance = () => {
  const selectedYear = useSelector(
    (state) => state.customization.selectedFiscalYear,
  );
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [performance, setPerformance] = useState([]);
  const [combinedPerformance, setCombinedPerformance] = useState([]);
  const [overallPerformance, setOverallPerformance] = useState({
    overall: 0,
    scale: '',
    color: theme.palette.primary.main,
  });
  const [unitId, setUnitId] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [filter, setFilter] = useState({
    frequencies: 'quarterly',
  });

  const handlePeriodSelection = (newPeriod) => {
    console.log('Clicked Period:', newPeriod);
    setSelectedPeriod((prev) =>
      prev?.id === newPeriod?.id ? null : newPeriod,
    );
  };
  // useEffect(() => {
  //   const handleFetchingPerformance = async () => {
  //     if (selectedYear?.id) {
  //       setIsLoading(true);
  //       const token = await GetToken();
  //       const Api =
  //         Backend.api +
  //         Backend.myUnitPerformance +
  //         `?fiscal_year_id=${selectedYear?.id}`;

  //       const header = {
  //         Authorization: `Bearer ${token}`,
  //         accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       };

  //       fetch(Api, {
  //         method: 'GET',
  //         headers: header,
  //       })
  //         .then((response) => response.json())
  //         .then((response) => {
  //           if (response.success) {
  //             setOverallPerformance((prevState) => ({
  //               ...prevState,
  //               overall: response.data.overallSum,
  //               scale: response.data.scale,
  //               color: response.data.color,
  //             }));
  //             setPerformance(response.data.performance);
  //             setUnitId(response.data.unit_id); // Store the unit_id from response
  //           }
  //         })
  //         .catch((error) => {
  //           toast.warning(error.message);
  //         })
  //         .finally(() => {
  //           setIsLoading(false);
  //         });
  //     }
  //   };

  //   handleFetchingPerformance();
  // }, [selectedYear, filter.frequencies]);

  useEffect(() => {
    const handleFetchingPerformance = async () => {
      if (selectedYear?.id) {
        setIsLoading(true);
        const token = await GetToken();
        const Api =
          Backend.api +
          Backend.myUnitPerformance +
          `?fiscal_year_id=${selectedYear?.id}`;

        const header = {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
          'Content-Type': 'application/json',
        };

        fetch(Api, {
          method: 'GET',
          headers: header,
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.success) {
              // Process the performance data to combine periods
              let processedPerformance = [...response.data.performance];
              let combinedData = [];

              if (processedPerformance.length >= 2) {
                // Combine first and second periods
                const firstPeriod = processedPerformance[0].Period;
                const secondPeriod = processedPerformance[1].Period;
                const combinedFirstSecond = {
                  name: `Q1-Q2`,
                  overall: (firstPeriod.overall + secondPeriod.overall) / 2,
                  scale:
                    firstPeriod.overall > 0 && secondPeriod.overall > 0
                      ? response.data.scale
                      : 'Poor',
                  color:
                    firstPeriod.overall > 0 && secondPeriod.overall > 0
                      ? response.data.color
                      : '#86822d',
                  period_date: `${firstPeriod.period_date.split(' - ')[0]} - ${secondPeriod.period_date.split(' - ')[1]}`,
                };
                combinedData.push(combinedFirstSecond);

                // Combine third and fourth periods if they exist
                if (processedPerformance.length >= 4) {
                  const thirdPeriod = processedPerformance[2].Period;
                  const fourthPeriod = processedPerformance[3].Period;
                  const combinedThirdFourth = {
                    name: `Q3-Q4`,
                    overall: (thirdPeriod.overall + fourthPeriod.overall) / 2,
                    scale:
                      thirdPeriod.overall > 0 && fourthPeriod.overall > 0
                        ? response.data.scale
                        : 'Poor',
                    color:
                      thirdPeriod.overall > 0 && fourthPeriod.overall > 0
                        ? response.data.color
                        : '#86822d',
                    period_date: `${thirdPeriod.period_date.split(' - ')[0]} - ${fourthPeriod.period_date.split(' - ')[1]}`,
                  };
                  combinedData.push(combinedThirdFourth);
                }
              }

              setCombinedPerformance(combinedData);
              console.log('setCombinedPerformance', combinedData);
              setPerformance(processedPerformance);
              setOverallPerformance((prevState) => ({
                ...prevState,
                overall: response.data.overallSum,
                scale: response.data.scale,
                color: response.data.color,
              }));
              setUnitId(response.data.unit_id);
            }
          })
          .catch((error) => {
            toast.warning(error.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };

    handleFetchingPerformance();
  }, [selectedYear, filter.frequencies]);

  return (
    <Grid item xs={11.9}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <DrogaCard sx={{ mt: 2, height: '100%' }}>
                <Box sx={{ padding: 1.5 }}>
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Overall Performance
                  </Typography>
                  {isLoading ? (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', py: 2 }}
                    >
                      <ActivityIndicator size={16} />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <DrogaDonutChart
                        value={parseFloat(overallPerformance.overall).toFixed(
                          1,
                        )}
                        size={48}
                        color={overallPerformance.color}
                      />
                      <Typography variant="subtitle1" mt={1}>
                        {overallPerformance.scale}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </DrogaCard>
            </Grid>

            {/* Semiannual Performance - horizontal layout */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DrogaCard sx={{ mt: 2, height: '100%' }}>
                <Box sx={{ padding: 1.5 }}>
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ mb: 1, fontWeight: 'bold' }}
                  >
                    Semiannual
                  </Typography>
                  {isLoading ? (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', py: 1 }}
                    >
                      <ActivityIndicator size={16} />
                    </Box>
                  ) : combinedPerformance.length > 0 ? (
                    <Grid container spacing={1}>
                      {combinedPerformance.map((period, index) => (
                        <Grid
                          item
                          xs={6}
                          key={index}
                          sx={{
                            borderTop: `1px solid ${theme.palette.divider}`,
                            gap: 1,
                            px: 1,
                            pb: 1,
                            mt: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            <DrogaDonutChart
                              value={parseFloat(period.overall).toFixed(1)}
                              size={36}
                              color={period.color}
                            />
                            <Typography variant="body2" mt={0.5}>
                              {period.name}
                            </Typography>
                            <Typography variant="caption">
                              {period.scale}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      align="center"
                    >
                      No data
                    </Typography>
                  )}
                </Box>
              </DrogaCard>
            </Grid>

            {/* Performances - takes remaining space */}
            <Grid item xs={12} md={5} lg={6}>
              <DrogaCard sx={{ mt: 2, height: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 0.5,
                    pt: 0,
                    px: 1.5,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Performances
                  </Typography>
                  <ExportMenu
                    onExcelDownload={() => handleExcelExport(performance)}
                  />
                </Box>

                {isLoading ? (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', py: 3 }}
                  >
                    <ActivityIndicator size={16} />
                  </Box>
                ) : performance.length > 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      borderTop: `1px solid ${theme.palette.divider}`,
                      gap: 1,
                      px: 1,
                      pb: 1,
                    }}
                  >
                    {performance?.map((period, index) => {
                      const periodName = Object.keys(period)[0];
                      return (
                        <PerformanceCard
                          key={index}
                          isEvaluated={period[periodName].is_evaluated}
                          performance={period[periodName]?.overall}
                          scale={period[periodName]?.scale}
                          color={period[periodName]?.color}
                          frequency={period[periodName].name}
                          onPress={() =>
                            handlePeriodSelection(period[periodName])
                          }
                          size="small"
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Fallbacks
                    severity="performance"
                    title={`No performance report`}
                    description={`The performance will be listed here`}
                    sx={{ p: 1 }}
                  />
                )}
              </DrogaCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* ManagerPerKpiPerformance now has more space */}
      {selectedPeriod && unitId && (
        <Box sx={{ mt: 3 }}>
          <ManagerPerKpiPerformance
            selectedPeriod={selectedPeriod}
            unitId={unitId}
          />
        </Box>
      )}

      {/* Monthly Trends */}
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <MonthlyTrends
            title="Monthly Trends"
            url={Backend.api + Backend.myUnitMonthlyTrends}
            itshows="Performance"
          />
        </Grid>
      </Grid>

      <ToastContainer />
    </Grid>
  );
};

ManagerUnitPerformance.propTypes = {
  id: PropTypes.string,
};

export default ManagerUnitPerformance;
