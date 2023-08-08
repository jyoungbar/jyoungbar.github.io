//Main Page
import React, { useEffect, useState } from 'react';
import {socket} from '../socket';
// import NameForm from '../components/nameForm';
import NameForm from '../components/nameForm1';
import ConnectedUsers from '../components/connectedUsers';
import QueueContainer from '../components/queueContainer';
 
const Main = () => {
  // if(sessionStorage.getItem("numUsers") === null) {
  //   sessionStorage.setItem("numUsers", 0);
  // }

  // const [numUsers, setNumUsers] = useState(0);
  // const [numUsers, setNumUsers] = useState(sessionStorage.getItem("numUsers"));

  //ensure that user rejoins room after reloading the page.
  socket.on('connect', () => {
  // useEffect(() => {
    if(sessionStorage.getItem('status') !== null) {
      socket.emit('name form', sessionStorage.getItem('name'), sessionStorage.getItem('status'));
    }
  }/*,[]*/);

  // socket.on('count', (count) => {
  //   // alert("count recieved");
  //   setNumUsers(count);
  //   sessionStorage.setItem("numUsers", count);
  // });

  const handleRefresh = () => {
    socket.emit('refreshNumUsers');
  }

  return (
    <div className="main">
      <h1>Queue Tracker 3000</h1>
      {/*<h4>Users Connected: {numUsers}</h4>*/}
      <ConnectedUsers />
      <button onClick={handleRefresh}>Refresh Connection Count</button>
      <NameForm />
      <QueueContainer />
    </div>
  );
};
 
export default Main;