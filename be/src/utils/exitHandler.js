import process from 'node:process';

const exitHandler = ({ event, err }) => {
  const eventToLog = `[${event}]` // format string 'event' to '[event]'
  err && console.log(`${eventToLog} ${err}`);
  console.log(`${eventToLog} Shutting down server`);
  process.exit(1);
}

export default exitHandler;
