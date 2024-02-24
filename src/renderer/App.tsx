import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, LinearProgress, TextField, Typography } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';
import './App.css';
import { Task } from '../shared/commonTypes';
import { AnimatePresence, motion } from 'framer-motion';

function Root() {
  const [sourceLocation, setSourceLocation] = useState<string>('');
  const [outputLocation, setOutputLocation] = useState<string>('');
  const [task, setTask] = useState<Task | null>(null);

  const handleSplitFrames = () => {
    const numberInputElement = document.getElementById(
      'numberInput',
    ) as HTMLInputElement | null;
    const skip = Number(numberInputElement?.value || 0);

    window.electron.ipcRenderer.sendMessage('split-frames', {
      sourceLocation,
      outputLocation,
      skip,
    });
  };

  const selectSourceLocation = () => {
    window.electron.ipcRenderer.sendMessage('pick-source-location');
  };

  const selectOutputLocation = () => {
    window.electron.ipcRenderer.sendMessage('pick-output-location');
  };

  useEffect(() => {
    const unsubscribeSetSourceLocation = window.electron.ipcRenderer.on(
      'set-source-location',
      (data) => {
        setSourceLocation(data as string);
      },
    );

    const unsubscribeSetOutputLocation = window.electron.ipcRenderer.on(
      'set-output-location',
      (data) => {
        setOutputLocation(data as string);
      },
    );

    const unsubscribeSetTask = window.electron.ipcRenderer.on(
      'set-task',
      (data) => {
        console.log(data);
        setTask(data as Task | null);
      },
    );

    return () => {
      unsubscribeSetSourceLocation();
      unsubscribeSetOutputLocation();
      unsubscribeSetTask();
    };
  }, [sourceLocation, outputLocation]);

  return (
    <div className="rootContainer">
      <AnimatePresence>
        <Typography variant="h1">Export as frames</Typography>
        <motion.div
          className="formContainer"
          key="form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="formEntry">
            <TextField
              id="text1"
              variant="outlined"
              label="Source location"
              sx={{ flex: 1 }}
              value={sourceLocation}
            />
            <Button variant="contained" onClick={selectSourceLocation}>
              <FolderRoundedIcon />
            </Button>
          </div>
          <div className="formEntry">
            <TextField
              id="text2"
              variant="outlined"
              label="Output location"
              sx={{ flex: 1 }}
              value={outputLocation}
            />
            <Button variant="contained" onClick={selectOutputLocation}>
              <FolderRoundedIcon />
            </Button>
          </div>
          <div className="labelContainer">
            <TextField
              type="number"
              id="numberInput"
              name="numberInput"
              label="Skip"
              inputProps={{ min: '1' }}
            />
          </div>
        </motion.div>

        {task === null && (
          <motion.div
            key="exportButton"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Button
              variant="contained"
              onClick={handleSplitFrames}
              sx={{ width: 'fill-available' }}
            >
              Export
            </Button>
          </motion.div>
        )}

        {task !== null && task.progress < 100 && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <LinearProgress value={task.progress} variant="determinate" />
          </motion.div>
        )}

        {task !== null && task.progress >= 100 && (
          <motion.div
            className="doneContainer"
            key="progressComplete"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <DoneRoundedIcon />
            <Typography>Done!</Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
