import { InfluxDB } from "@influxdata/influxdb-client";

const token = 'Jasx3m_Em5uI3bU2Q87hCtgf4HAmyWx-FvZHZyUcYkTK60Tcfd7Dd49TYg82L_o2Ng_Jhnne2jWPgc6elt-l4w==';
const org = 'live247';
const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
const queryApi = client.getQueryApi(org);

export { queryApi };