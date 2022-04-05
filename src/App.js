import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Input } from 'antd'
import './App.css';

const url = 'ws://123.57.243.27:8099';
const socket = io(url);

const commands = [
  {
    key: 'ping<anything>',
    value: ['pong<anything']
  },
  {
    key: 'list<N> items',
    value: [
      'list'
    ]
  },
  {
    key: 'image',
    value: ['show image.png']
  }
]
function App () {

  const [msgList, setMsgList] = useState([]);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    socket.on('connect', function () {
      console.log('连接成功')
    })
    socket.on('messages', function (data) {
      setMsgList((old) => {
        return [...old, { type: 'server', msg: data }]
      })
    })
  }, [])

  const sendMsg = (msg) => {
    socket.emit('messages', msg);
    setMsg('');
    setMsgList((old) => {
      return [...old, { type: 'client', msg: msg }]
    })
  }

  return (
    <div className="App">

    </div>
  );
}

export default App;
