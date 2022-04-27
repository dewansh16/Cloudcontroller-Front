import React, { useEffect, useState } from "react";
import "./fileView.Components.PatientDetails.css";

import { Spin, Image, Row, Col, Menu, Tag, Dropdown } from "antd";

import internalApi from "../../../../Apis/internalApis";
import { Button } from "../../../../Theme/Components/Button/button";

function FetchPatientImages(pid, refreshFileView) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modifiedData, setModifiedData] = useState(null);

  useEffect(() => {
    setLoading(true);
    internalApi
      .getImage(null, pid)
      .then((res) => {
        setResponse(res.data.response);
        const data = res.data?.response.imagesData;
        console.log(data);
        const modifiedData1 = data?.map((item) => {
          var array = item.tags !== null ? item.tags.split(/[ ,]+/) : [];
          return {
            ...item,
            tags: array,
          };
        });
        console.log(modifiedData1);
        setModifiedData(modifiedData1);
        setLoading(false);
      })
      .catch((err) => {
        if (err) {
          // Notification.error({
          //     message: 'Error',
          //     // description: `${err.response.data.result}` || ""
          // })
          console.error(err);
          setLoading(false);
        }
      });
  }, [pid, refreshFileView]);

  return [response, loading, modifiedData];
}

function FileView({ pid, refreshFileView }) {
  const [data, isLoading, modifiedData] = FetchPatientImages(
    pid,
    refreshFileView
  );
  const [currentPage, setCurrentPage] = useState(1);

  console.log(pid, data, isLoading);

  let pageCount = 0;

  if (!isLoading && data?.imagesData?.length > 0) {
    pageCount = Math.ceil(data.imagesData.length / 6);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const toNormalDate = (date) => {
    const date1 = new Date(date);
    const date2 = `${date1.getDate()}  ${
      monthNames[date1.getMonth()]
    } ${date1.getFullYear()}`;
    return date2;
  };

  console.log(
    data?.imagesData?.length,
    data?.imagesData,
    pageCount,
    currentPage,
    (currentPage - 1) * 6,
    currentPage * 6,
    modifiedData
  );

  return (
    <div>
      {isLoading && (
        <Spin style={{ position: "relative", left: "50%", top: "30%" }} />
      )}
      {!isLoading && data?.imagesData?.length > 0 && (
        <>
          <div style={{ minHeight: "450px", marginBottom: "20px" }}>
            <Image.PreviewGroup>
              <Row>
                {pageCount > 0 &&
                  data.imagesData.map((item, index) => {
                    if (
                      index >= (currentPage - 1) * 6 &&
                      index < currentPage * 6
                    ) {
                      return (
                        <Col span={8} key={index}>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              margin: "30px 0px 20px",
                            }}
                          >
                            <Image
                              style={{ height: "150px" }}
                              width={"90%"}
                              height={"auto"}
                              src={
                                window.location.protocol +
                                "//" +
                                window.location.host +
                                item.data
                              }
                            />
                          </div>
                          <Row
                            style={{
                              rowGap: "0px",
                              width: "90%",
                              margin: "auto",
                            }}
                          >
                            <Col span={8} className="alert-chart-infos">
                              <p style={{ marginBottom: "0px" }}>
                                {item.template_type.slice(0, 8)}
                              </p>
                            </Col>
                            <Col span={10}>
                              <p style={{ marginBottom: "0px" }}>
                                {toNormalDate(item.date)}
                              </p>
                            </Col>
                            <Col style={{ textAlign: "end" }} span={6}>
                              <Dropdown
                                overlay={() => (
                                  <Menu>
                                    {item.tags !== null &&
                                      modifiedData[index].tags.map(
                                        (tagName, index) => {
                                          return (
                                            <Menu.Item key={index}>
                                              {console.log(item)}
                                              <a>{tagName}</a>
                                            </Menu.Item>
                                          );
                                        }
                                      )}
                                  </Menu>
                                )}
                                placement="bottomCenter"
                              >
                                <Tag
                                  className="alert-doctor-tags"
                                  style={{ marginRight: "0px" }}
                                  color="#E6F1FF"
                                >
                                  Tags
                                </Tag>
                              </Dropdown>
                            </Col>
                          </Row>
                        </Col>
                      );
                    }
                  })}
              </Row>
            </Image.PreviewGroup>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              className="primary-outlined"
              disabled={currentPage === 1 ? true : false}
              onClick={() => {
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              type="text"
            >
              prev
            </Button>
            <Button
              className="primary-outlined"
              disabled={currentPage >= pageCount ? true : false}
              onClick={() => {
                if (currentPage < pageCount) setCurrentPage(currentPage + 1);
              }}
              type="text"
            >
              next
            </Button>
          </div>
        </>
      )}
      {!isLoading && (data === null || data?.imagesData?.length === 0) && (
        <div
          style={{
            position: "relative",
            height: "500px",
          }}
        >
          <h1
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "3em",
              opacity: "0.5",
            }}
          >
            NO IMAGES
          </h1>
        </div>
      )}
    </div>
  );
}

export default FileView;
