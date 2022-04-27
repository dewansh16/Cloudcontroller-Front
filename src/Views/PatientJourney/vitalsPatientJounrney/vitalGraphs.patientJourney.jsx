import React from "react";
import ChartsBlock from "../../Components/Lists/listComponent/chartsBlock";
import { Row, Tooltip, Col, span, Divider } from "antd";
import SmallLineChart from "../../Components/Charts/smallCharts/lineChart";

function VitalGraphs({ item, key }) {
  const dataKey = "value";

  const toolTipConfig = {
    Temperature: `${item.val}° F`,
    SPO2: `${item.val} %`,
    "Heart Rate": `${item.val} bpm`,
    "Respiration Rate": `${item.val} bpm`,
  };

  return (
    <Row key={key} className="chartBox" gutter={2}>
      <Tooltip title={item.name}>
        <Col
          span={4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          flex={1}
        >
          {item.icon}
        </Col>
      </Tooltip>
      <Tooltip title={toolTipConfig[item.name]}>
        <Col
          span={4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          flex={1}
        >
          {item.name === "Blood Pressure" ? (
            <div>
              <h3
                style={{
                  color: item.color,
                  marginBottom: "0px",
                  textAlign: "center",
                }}
              >
                {item.val}
              </h3>
              <Divider style={{ margin: "0px" }} />
              <h3
                style={{
                  color: item.color,
                  marginBottom: "0px",
                  textAlign: "center",
                }}
              >
                70
              </h3>
            </div>
          ) : (
            <h3 style={{ color: item.color }}>{item.val}</h3>
          )}
        </Col>
      </Tooltip>
      <Col
        style={{ height: "50%", display: "flex", alignItems: "center" }}
        span={16}
      >
        <div style={{ height: "100%", width: "100%" }}>
          <SmallLineChart
            chartData={item.trendData}
            dataKey={dataKey}
            strokeColor={item.color}
          />
        </div>
      </Col>
    </Row>
  );
}

export default VitalGraphs;
