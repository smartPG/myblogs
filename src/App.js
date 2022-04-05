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
      <div className='echo-command-containner'>
        <h1>Echo Chat</h1>
        <p>Avaliable commands</p>
        <ul className='parent-ul'>
          {
            commands.map((item, index) => {
              return (
                <>
                  <li key={index}>{item.key}</li>
                  <ul key={index + item.key}>
                    {
                      item.value.map((item, index) => {
                        return (
                          <>
                            <li key={index}>{item}</li>
                            {
                              item === 'list' ? <ul>
                                <li>item 1</li>
                                <li>item 2</li>
                                <li>...</li>
                                <li>item N</li>
                              </ul> : null
                            }
                          </>
                        )
                      })
                    }
                  </ul>
                </>
              )

            })
          }
        </ul>
        <p>Response 'I don't understand' for any other input</p>
      </div>
      <div className='chat-container'>
        <div className='chat-box'>
          {
            msgList && msgList.map((item, index) => {
              return <span key={index} className={`command-bubble ${item.type === 'client' ? 'right' : 'left'}`}>
                {typeof item.msg === "string" ? item.msg :
                  <>
                    {
                      item.msg.list &&
                      <>
                        list:
                        <ul>
                          {item.msg.list.map((item) => {
                            return <li>{item}</li>
                          })}
                        </ul>
                      </>
                    }
                    {
                      item.msg.url &&
                      <img className='bubble-image' alt='' src={'data:image/jpg;base64,' + item.msg.url} />
                    }
                  </>}
              </span>
            })
          }
        </div>
        <Input className='input-enter' type={'text'}
          placeholder='请输入消息'
          value={msg}
          onChange={(event, value) => {
            setMsg(value)
          }}
          onPressEnter={(e) => { sendMsg(e.target.value) }}>
        </Input>
      </div>

    </div>
  );
}

export default App;
