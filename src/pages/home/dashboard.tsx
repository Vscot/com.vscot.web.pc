import React, { useState, useEffect } from "react";
import styles from "./dashBoard.less";
import { Row, Card, Col, Typography, message } from "antd";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from "bizcharts";
import { post } from "@/api";

const { Title, Paragraph, Text } = Typography;

const DashBoard = () => {
  const [baseData, dispatchBaseData] = useState<any>({});
  const [chartUserData, dispatchUserChartData] = useState<any>({});
  const [chartBarrageData, dispatchBarrageChartData] = useState<any>({});

  const getBaseData = () => {
    post("/v1/login/getdashboard", {
      id: "obaiTw7DWmkL34q_nOJ4bBDoMEVo",
    }).then((res) => {
      if (res.data.code === 0) {
        dispatchBaseData(res.data.data);
      } else {
        message.error(res.data.message);
      }
    });
  };

  const getChartData = () => {
    post("/v1/dashBoard/getchartdata", {
      id: "obaiTw7DWmkL34q_nOJ4bBDoMEVo",
    }).then((res) => {
      if (res.data.code === 0) {
        console.log(res);
        const barrage = res.data.data.aggregations.barrage;
        const user = barrage.buckets.map((item: any) => {
          return {
            time: item.key_as_string,
            value: item.user.buckets.length,
          };
        });
        const barrageData = barrage.buckets.map((item: any) => {
          return {
            time: item.key_as_string,
            value: item.doc_count,
          };
        });
        dispatchUserChartData(user);
        dispatchBarrageChartData(barrageData);
        // dispatchChartData(res.data.data)
      } else {
        message.error(res.data.message);
      }
    });
  };

  useEffect(() => {
    getBaseData();
    getChartData();
  }, []);

  const cols = {
    
  };
  return (
    <div className={styles.dashBoardPage}>
      <Row
        gutter={24}
        style={{
          paddingBottom: 10,
        }}
      >
        <Col span={8}>
          <Card
            title="房间总数"
            bordered={false}
            bodyStyle={{
              padding: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              className={styles.cardContent}
              style={{
                color: "green",
              }}
            >
              {baseData.roomTotal}
            </span>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="所有房间人总数"
            bordered={false}
            bodyStyle={{
              padding: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              className={styles.cardContent}
              style={{
                color: "red",
              }}
            >
              {baseData.peopleTotal}
            </span>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="所有弹幕总数"
            bordered={false}
            bodyStyle={{
              padding: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              className={styles.cardContent}
              style={{
                color: "red",
              }}
            >
              {baseData.barrageTotal}
            </span>
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Chart
            className={styles.chart}
            height={400}
            data={chartUserData}
            scale={{
              value: {
                min: 0,
                alias: '活跃用户'
              },
              time: {
                range: [0, 1],
                alias: '时间'
              },
            }}
            forceFit
          >
            <div
              style={{
                textAlign: "center",
                padding: 10,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              近七天活跃用户量
            </div>
            <Axis name="time" title />
            <Axis name="value" title />
            <Tooltip
              crosshairs={{
                type: "y",
              }}
            />
            <Geom type="line" position="time*value" size={2} />
            <Geom
              type="point"
              position="time*value"
              size={4}
              shape={"circle"}
              style={{
                stroke: "#fff",
                lineWidth: 1,
              }}
            />
          </Chart>
        </Col>
        <Col span={12}>
          <Chart
            className={styles.chart}
            height={400}
            data={chartBarrageData}
            scale={{
              value: {
                min: 0,
                alias: "弹幕总量"
              },
              time: {
                range: [0, 1],
                alias: '时间'
              },
            }}
            forceFit
          >
            <div
              style={{
                textAlign: "center",
                padding: 10,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              近七天每天弹幕总量
            </div>
            <Axis name="time" title />
            <Axis name="value" title />
            <Tooltip
              crosshairs={{
                type: "y",
              }}
            />
            <Geom type="line" position="time*value" size={2} />
            <Geom
              type="point"
              position="time*value"
              size={4}
              shape={"circle"}
              style={{
                stroke: "#fff",
                lineWidth: 1,
              }}
            />
          </Chart>
        </Col>
      </Row>
      <Row className={styles.desc}>
        <Typography>
          <Title level={3}>系统说明</Title>
          <Paragraph>
            本系统是基于Fayjs，React构建的多房间实时弹幕系统，依托于微信公众号实现为用户提供简单实用的实时弹幕系统，弹幕部分使用canvas实现高性能的弹幕墙。
          </Paragraph>
          <Paragraph>
            主要使用的技术栈：
            <Title level={4}>前端</Title>
            <Paragraph>
              <ul>
                <li>
                  <a href="#">React</a>
                </li>
                <li>
                  <a href="#">Ant Design</a>
                </li>
                <li>
                  <a href="#">BizCharts</a>
                </li>
                <li>
                  <a href="#">Axios</a>
                </li>
                <li>
                  <a href="#">TypeScript</a>
                </li>
              </ul>
            </Paragraph>
            <Title level={4}>后端</Title>
            <Paragraph>
              <ul>
                <li>
                  <a href="#">Fayjs</a>
                </li>
                <li>
                  <a href="#">Rabbitmq</a>
                </li>
                <li>
                  <a href="#">MySQL</a>
                </li>
                <li>
                  <a href="#">Redis</a>
                </li>
                <li>
                  <a href="#">ElasticSearch</a>
                </li>
                <li>
                  <a href="#">TypeScript</a>
                </li>
              </ul>
            </Paragraph>
          </Paragraph>
          <Paragraph>
            <Title level={3}>系统注意事项说明：</Title>
            <Paragraph>
              <ul>
                <li>
                  每个用户最多创建五个房间，达到上限之后将不能继续创建新的房间，必须删除部分房间后才能继续创建
                </li>
                <li>
                  每个用户发送的弹幕消息会进行敏感词过滤，系统默认敏感词部分，不可修改不可越过（遵守法律法规）
                </li>
                <li>
                  在进行弹幕设置时，颜色必须使用16进制格式，以英文逗号连接，否则将会出现不可预知错误。
                </li>
                <li>弹幕设置速度时，值越大在屏幕中运动的速度就越快</li>
                <li>
                  弹幕字体默认大小为14px，用户设置时需要注意单位是px（像素）
                </li>
                <li>
                  如果使用过程中遇到问题，请咨询开发人员。联系方式：QQ群:{" "}
                  <a>853172033</a> Email: <a>furyfu@tencent.com</a>
                </li>
              </ul>
            </Paragraph>
          </Paragraph>
        </Typography>
      </Row>
    </div>
  );
};

export default DashBoard;
