import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function MQTTControl() {
  const [mqttClient, setMqttClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const [switches, setSwitches] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
  });

  const topics = {
    switch1: 'stat/tasmota_999932/POWER1',
    switch2: 'stat/tasmota_999932/POWER2',
    switch3: 'stat/tasmota_999932/POWER3',
    switch4: 'stat/tasmota_999932/POWER4',
  };

  const commandTopics = {
    switch1: 'cmnd/tasmota_999932/POWER1',
    switch2: 'cmnd/tasmota_999932/POWER2',
    switch3: 'cmnd/tasmota_999932/POWER3',
    switch4: 'cmnd/tasmota_999932/POWER4',
  };

  useEffect(() => {
    // Load states from localStorage on initial render
    const savedSwitches = JSON.parse(localStorage.getItem('switches'));
    const savedConnected = JSON.parse(localStorage.getItem('connected'));

    if (savedSwitches) {
      setSwitches(savedSwitches);
    }

    if (savedConnected) {
      reconnectToBroker();
    }
  }, []);

  useEffect(() => {
    // Save switches state to localStorage whenever it changes
    localStorage.setItem('switches', JSON.stringify(switches));
  }, [switches]);

  useEffect(() => {
    // Save connected state to localStorage whenever it changes
    localStorage.setItem('connected', JSON.stringify(connected));
  }, [connected]);

  const reconnectToBroker = () => {
    const brokerUrl = 'ws://192.168.0.30:9001';
    const client = mqtt.connect(brokerUrl);

    client.on('connect', () => {
      setConnected(true);
      setMqttClient(client);
      console.log('Reconnected to MQTT broker at', brokerUrl);

      // Subscribe to switch state topics
      Object.values(topics).forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.error(`Failed to subscribe to ${topic}`, err);
          } else {
            console.log(`Subscribed to ${topic}`);
          }
        });
      });
    });

    client.on('message', (topic, message) => {
      const newState = message.toString().toUpperCase() === 'ON';
      const updatedSwitch = Object.keys(topics).find((key) => topics[key] === topic);

      if (updatedSwitch) {
        setSwitches((prev) => ({ ...prev, [updatedSwitch]: newState }));
        console.log(`Switch ${updatedSwitch} updated to ${newState ? 'ON' : 'OFF'}`);
      }
    });

    client.on('error', (err) => {
      console.error('Connection error: ', err);
      setConnected(false);
    });

    client.on('close', () => {
      setConnected(false);
      setMqttClient(null);
      console.log('Disconnected from MQTT broker');
    });
  };

  const connectToBroker = () => {
    const brokerUrl = 'ws://192.168.0.30:9001';
    const client = mqtt.connect(brokerUrl);

    client.on('connect', () => {
      setConnected(true);
      setMqttClient(client);
      console.log('Connected to MQTT broker at', brokerUrl);

      // Subscribe to switch state topics
      Object.values(topics).forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.error(`Failed to subscribe to ${topic}`, err);
          } else {
            console.log(`Subscribed to ${topic}`);
          }
        });
      });
    });

    client.on('message', (topic, message) => {
      const newState = message.toString().toUpperCase() === 'ON';
      const updatedSwitch = Object.keys(topics).find((key) => topics[key] === topic);

      if (updatedSwitch) {
        setSwitches((prev) => ({ ...prev, [updatedSwitch]: newState }));
        console.log(`Switch ${updatedSwitch} updated to ${newState ? 'ON' : 'OFF'}`);
      }
    });

    client.on('error', (err) => {
      console.error('Connection error: ', err);
      setConnected(false);
    });

    client.on('close', () => {
      setConnected(false);
      setMqttClient(null);
      console.log('Disconnected from MQTT broker');
    });
  };

  const disconnectFromBroker = () => {
    if (mqttClient) {
      mqttClient.end();
      setConnected(false);
      setMqttClient(null);
    }
  };

  const toggleSwitch = (switchName) => {
    const newSwitchState = !switches[switchName];
    setSwitches((prev) => ({ ...prev, [switchName]: newSwitchState }));

    if (connected && mqttClient) {
      const topic = commandTopics[switchName];
      mqttClient.publish(topic, newSwitchState ? 'ON' : 'OFF');
      console.log(`Published ${newSwitchState ? 'ON' : 'OFF'} to ${topic}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>MQTT Switch Control</h2>

      <button
        className="btn btn-primary mr-2"
        onClick={connectToBroker}
        disabled={connected}
      >
        Connect to 192.168.0.30:1883
      </button>
      <button
        className="btn btn-danger"
        onClick={disconnectFromBroker}
        disabled={!connected}
      >
        Disconnect
      </button>

      <hr />

      <div>
        <h3>Switches</h3>
        {['switch1', 'switch2', 'switch3', 'switch4'].map((switchName) => (
          <div key={switchName} className="form-check form-switch mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id={switchName}
              checked={switches[switchName]}
              onChange={() => toggleSwitch(switchName)}
              disabled={!connected}
            />
            <label className="form-check-label" htmlFor={switchName}>
              {switchName.toUpperCase()}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MQTTControl;
