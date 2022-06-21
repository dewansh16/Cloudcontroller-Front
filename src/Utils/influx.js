import { InfluxDB } from "@influxdata/influxdb-client";

const token = 'WcOjz3fEA8GWSNoCttpJ-ADyiwx07E4qZiDaZtNJF9EGlmXwswiNnOX9AplUdFUlKQmisosXTMdBGhJr0EfCXw==';
const org = 'live247';
const client = new InfluxDB({ url: 'http://20.230.234.202:8086', token: token });
const queryApi = client.getQueryApi(org);

export { queryApi };