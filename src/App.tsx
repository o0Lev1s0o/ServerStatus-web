import "./App.css";

import intl from "react-intl-universal";
import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Spin } from "antd";
import ServerRow from "./ServerRow";

require("intl/locale-data/jsonp/en.js");
require("intl/locale-data/jsonp/zh.js");

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
  const [serverData, setServerData] = useState({ servers: [], updated: "0" });
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    const fetchData = () => {
      fetch("json/stats.json")
        .then((res) => res.json())
        .then((data) => {
          setServerData(data);
          setIsOnline(true);
        })
        .catch((e) => console.log("错误:", e));
    };
    fetchData();
    let itv = setInterval(fetchData, 1000);
    return () => {
      clearInterval(itv);
    };
  }, []);

  const [initDone, setInitDone] = useState(false);
  let currentLocale = navigator.language || "zh-CN";
  if (currentLocale === "zh-TW" || currentLocale === "zh-HK") {
    currentLocale = "zh-TW";
  } else if (currentLocale.startsWith("zh")) {
    currentLocale = "zh-CN";
  } else {
    currentLocale = "en-US";
  }

  initDone ||
    fetch(`locales/${currentLocale}.json`)
      .then((res) => res.json())
      .then((data) => {
        return intl.init({
          currentLocale,
          locales: {
            [currentLocale]: data,
          },
        });
      })
      .then(() => {
        setInitDone(true);
      });

  return (
    <div className="App">
      <Layout>
        <Header>
          <div className="logo">ServerStatus</div>
        </Header>
        <Content style={{ background: "#fff" }}>
          <Row justify="center">
            <Col xs={24} sm={23} md={23} lg={22} xl={20} xxl={16}>
              {initDone ? (
                <Spin size="large" spinning={!isOnline} tip="Loading...">
                  <ServerRow {...serverData} />
                </Spin>
              ) : (
                  <div />
                )}
            </Col>
          </Row>
        </Content>
        <Footer className="footer">
          <a target="_blank" href="/detail">🗂️</a>
          {" | "}
          <a
            href="https://github.com/krwu/ServerStatus-web"
            rel="external noopener"
          >
            WebUI
          </a>{" "}
          for{" "}
          <a
            href="https://github.com/zdz/ServerStatus-Rust"
            rel="external noopener"
          >
            ServerStatus-Rust 版
          </a>
          {" | "}
          <a target="_blank" href="/map">🗺️</a>
        </Footer>
      </Layout>
    </div>
  );
};

export default App;
