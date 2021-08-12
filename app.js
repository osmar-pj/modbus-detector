const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;
const mqtt = require('mqtt')
require('dotenv').config()
const options = {
    clientId: 'DETECTOR-MULTIGAS',
    username: 'ServerRasp',
    password: ''
}

const connectUrl = `${process.env.BASE_URL_MQTT}`
const client = mqtt.connect(connectUrl, options)
client.on('connect', () => {
})

const serialPort = new SerialPort("COM1", {
   baudRate: 9600
});

const master = new ModbusMaster(serialPort);
let datas = {
    detector_rasp: {
        mac: "RASPBERRY_DETECTOR",
        values: []
    }
}
setInterval(() => {
    master.readHoldingRegisters(1, 0, 15).then((data) => {
        datas.detector_rasp.values = data
        console.log(data)
        client.publish('mina/subterranea/detector', JSON.stringify(datas))
    }, (err) => {
        console.error(err)
    });
}, 5000)