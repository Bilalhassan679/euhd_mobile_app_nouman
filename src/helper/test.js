import * as React from 'react';
import { useState } from 'react';
import { Alert,Button, TextInput, View } from 'react-native';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  var base_url = "https://uhd.edu.iq"
  base_url = 'https://94a7-115-186-86-11.ngrok-free.app'

  const authenticate = async () => {
    try {
      const check_2f = await fetch(base_url + '/web/check/2f',  
      {
        method: 'POST',
        credentials: "same-origin",
        headers: {          
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            db: 'Odoo-15.0-uhd-error-1',
            login: 'test',
            password: '111',            
          }
        }),
      });

      const check_2fData = await check_2f.json();
      // console.error('totpData................:', check_2f);
      if ('result' in check_2fData){
        if ('is_2FA' in check_2fData.result)
          console.error('2f required proceed with /web/check/totp');
        else if ('is_login' in check_2fData.result && check_2fData.result.is_login)
          console.error('2f not required proceed with /web/session/authenticate');
          else {
            console.error('2F error');
          }
      }



      const response = await fetch(base_url + '/web/session/authenticate',  
      {
        method: 'POST',
        credentials: "same-origin",
        headers: {          
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            db: 'Odoo-15.0-uhd-error-1',
            login: 'test',
            password: '111',
            
          }
        }),
      });
     console.error('session................:', response);

      if (!response.ok) {
        // Handle error response
        console.error('Error:', response.status);
        return;
      }
      const headers = response.headers.map;
      const setCookieHeader = headers['set-cookie'];
      const sessionID = setCookieHeader.split('=')[1].split(';')[0];

      // Get the session_id from the response and use it in the /web/login/totp API.
     

      // Set session id and two factor authentication flag
      setSessionId(sessionID);
      setIsTwoFactorEnabled(true);
          console.error('session................:', sessionID);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTotp = async () => {
    
    const totpResponse = await fetch(base_url + '/web/check/totp', 
    {
      method: 'POST',
      credentials: "same-origin",
      headers: {          
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: 'Odoo-15.0-uhd-error-1',
          login: 'test',
          password: '111',
          totp_token: totpToken,
        }
      }),
    });
      console.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');    
      console.error('session................:', sessionId);

      const totpData = await totpResponse.json();
      console.error('totpData................:', totpData);
      if ('result' in totpData){
        if ('uid' in totpData.result)
          console.error('Session............:', totpData.result);
        else
          console.error('result ............:', totpData.result);
      }
      if ('error' in totpData)
        console.error('Error................:', totpData.error);
      console.error('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    };

  return (
    <View>
      {!isTwoFactorEnabled ?
        <>
          <TextInput style={{ marginTop: 50 }} placeholder="Username" onChangeText={setUsername} />
          <TextInput placeholder="Password" secureTextEntry={true} onChangeText={setPassword} />
          <TextInput placeholder="Database" onChangeText={setDatabase} />
          <Button title="Login" onPress={authenticate} />
        </>
        :
        <>
         
          <TextInput style={{ marginTop: 50 }} placeholder="TOTP Token" onChangeText={setTotpToken} />
          <Button title="Submit" onPress={handleTotp} />
        </>
      }
    </View>
  );
}
