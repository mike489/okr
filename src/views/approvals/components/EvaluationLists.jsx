import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Collapse,
  useTheme,

} from '@mui/material';

export const EvaluationLists = ({ evaluations }) => {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleExpanding = (index) => {
    if (index === selectedIndex) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <TableContainer
      component={Paper}
      style={{ marginTop: '16px', minHeight: '60dvh' }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
          <TableRow>
            <TableCell>
              <strong>Evaluated KPI</strong>
            </TableCell>
            <TableCell>
              <strong>Weight (%)</strong>
            </TableCell>
            <TableCell>
              <strong>Target</strong>
            </TableCell>
            <TableCell>
              <strong>Action</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {evaluations.map((kpi, index) => {
            return (
              <React.Fragment key={index}>
                <TableRow
                  onClick={() => handleExpanding(index)}
                  sx={{
                    backgroundColor:
                      selectedIndex === index && theme.palette.grey[100],
                    ':hover': { backgroundColor: theme.palette.grey[100] },
                    cursor: 'pointer',
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      color="text.primary"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {kpi.kpi}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {kpi.perspective_type}
                    </Typography>
                  </TableCell>
                  <TableCell>{kpi?.weight}%</TableCell>
                  <TableCell>{kpi?.total_target}</TableCell>
                  <TableCell align="center">
                     <Button
                    variant="text"
                      onClick={() => handleExpanding(index)}
                  >
                    View
                  </Button>
                  </TableCell>

                </TableRow>

                <TableRow
                  sx={{
                    backgroundColor:
                      selectedIndex === index && theme.palette.grey[50],
                  }}
                >
                  <TableCell colSpan={5} sx={{ m: 0, p: 0, borderBottom: 0 }}>
                    <Collapse in={selectedIndex === index}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Period</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Target</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Current Actual</strong>
                            </TableCell>
                            <TableCell>
                              <strong>New Actual</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Status</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {kpi.target.map((subEval, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={{ textTransform: 'capitalize' }}>
                                {subEval.name}
                              </TableCell>
                              <TableCell>{subEval.target}</TableCell>
                              <TableCell>{subEval.actual_value}</TableCell>
                              <TableCell>{subEval.new_actual_value}</TableCell>
                              <TableCell>{subEval.evaluation_status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

