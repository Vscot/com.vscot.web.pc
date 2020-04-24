import React, { useState, useEffect, useRef } from "react";
import styles from "./multiBarrage.less";
import { message } from "antd";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { post } from "@/api";

let requestAnimationFrameId: any;

interface SocketMessageFromClient {
  type: string;
  data: any;
}

class CanvasBarrage {
  public canvasId: any;
  public canvasText: any;
  public isPaused: boolean = true;
  public ratio: any;
  public speed: number = 1;

  public barrages: any[] = [];

  constructor(canvasId: any, speed = 1) {
    if (!canvasId) return;
    this.canvasId = canvasId;
    this.speed = speed;
    this.canvasText = canvasId.getContext("2d");
    this.isPaused = true; // 判断是否关闭弹幕
    this.canvasText.height = document.body.offsetHeight; // 设置画布的宽高 默认为全屏大小
    this.canvasText.width = document.body.offsetWidth;
    this.ratio = this.getPixelRatio(this.canvasText);
    canvasId.width = document.body.offsetWidth * this.ratio;
    canvasId.height = document.body.offsetHeight * this.ratio;
    this.canvasText.height = document.body.offsetHeight * this.ratio;
    this.canvasText.width = document.body.offsetWidth * this.ratio;
    this.canvasText.scale(this.ratio, this.ratio);
  }
  // 渲染canvas绘制的弹幕
  render = () => {
    this.clear();
    // 渲染弹幕
    this.renderBarrage();
    // 如果没有暂停的话就继续渲染
    if (this.isPaused === true) {
      requestAnimationFrameId = requestAnimationFrame(this.render.bind(this)); // 这个是浏览器预判下一帧提前运行的事件(给人视觉流畅性，无卡顿与跳跃感)
    }
    if (this.isPaused === false) {
      this.clear();
    }
  };
  // 用于渲染组合弹幕的事件
  // this.barrages添加的并不是弹幕的直接对象，而是Barrages渲染的实体类, [new Barrages({ value: '小蚂蚁爬呀爬，爬到你的身体上!', color: '#3344dd' }, this)]
  renderBarrage = () => {
    if (this.barrages.length < 1) return;
    this.barrages = this.barrages.filter(
      (barrage) => barrage.x > -barrage.width
    );
    this.barrages.forEach((barrage) => {
      barrage.x -= barrage.speed;
      barrage.render();
    });
  };
  // 手动添加弹幕类事件
  addBarrage = (value: any, option?: any) => {
    this.barrages.push(
      new Barrages(
        {
          value,
          speed: this.speed,
          ...option,
        },
        this
      )
    );
  };
  //  清空弹幕
  clear = () => {
    this.canvasText.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
  };

  //关闭弹幕事件
  closeBarrage = () => {
    this.isPaused = false;
  };
  //重新打开弹幕事件
  resetOpen = () => {
    this.isPaused = true;
    this.render();
  };
  // 获取当前设备的分辨率倍数
  getPixelRatio = (context: any) => {
    let backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    return (window.devicePixelRatio || 1) / backingStore;
  };
}

class Barrages {
  public time: any;
  public obj: any;
  public canvasText: any;
  public color: string = "#fff";
  public fontSize: number = 50;
  public width: number = 300;
  public x: number = 0;
  public y: number = 0;
  public ratio: any;
  public speed: number = 1;

  constructor(obj: any, props: any) {
    this.time = obj.time || new Date();
    this.obj = obj;
    this.ratio = props.ratio;
    this.canvasText = props.canvasText; //canvas模板导入
    this.Init();
  }
  // 初始化弹幕的状态，颜色、透明度、阴影、字体大小
  Init = () => {
    this.color = this.obj.color || "red";
    this.fontSize = this.obj.fontSize || 50;
    this.speed = this.obj.speed || 1;
    let opacity = this.obj.opacity || "0.8";
    let position = this.obj.position || "all";
    this.canvasText.shadowColor = `rgba(0,0,0,${opacity})`;
    this.canvasText.shadowBlur = 0;
    // this.canvasText.font = `${this.fontSize}px`;
    this.width = this.canvasText.measureText(this.obj.value).width; // 这一点重点注意，根据输入的内容设置canvas的宽度
    // 设置弹幕出现的位置
    this.x = this.canvasText.width / this.ratio;
    this.y = this.gitHeight(this.canvasText.height / this.ratio, position);
    // 做下超出范围处理
    if (this.y < this.fontSize) {
      this.y = this.fontSize;
    } else if (this.y > this.canvasText.height / this.ratio - this.fontSize) {
      this.y = this.canvasText.height / this.ratio - this.fontSize;
    }
  };
  gitHeight = (height: any, post: any) => {
    switch (post) {
      case "all":
        return Math.round(height * Math.random());
      case "top":
        return Math.round((height * Math.random()) / 2);
      case "bottom":
        return Math.round(height * (Math.random() / 2 + 0.5));
      default:
        return Math.round(height * Math.random());
    }
  };
  render = () => {
    this.canvasText.font = `${this.fontSize}px Arial`;
    this.canvasText.fillStyle = this.color;
    this.canvasText.fillText(this.obj.value, this.x, this.y);
  };
}

const barrageArray: SocketMessageFromClient[] = [];

const random = (min = 0, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const MultiBarrage = () => {
  const [roomInfo, dispatchRoomInfo] = useState<any>({});

  const param: { id: string } = useParams() as { id: string };

  let lockReconnect = false; //避免重复连接
  const wsUrl = `ws://localhost:8080/${param.id}`;
  let tt: any = null;
  let ws: WebSocket;

  const canvasEl = useRef(null);
  const timer = useRef<any>(null);

  const [canvasBarrage, dispatchCanvasBarrage] = useState<CanvasBarrage | null>(
    null
  );

  const getBarrageInfo = () => {
    post("/v1/room/getroominfo", {
      id: param.id,
    }).then((res) => {
      if (res.data.code === 0) {
        const info = {
          ...res.data.data,
          color: res.data.data.color.split(","),
        };
        document.title = info.title || 'Fay WeChat Barrage Admin';
        dispatchRoomInfo(info);
      } else {
        message.error("房间初始化失败，请退出重试");
      }
    });
  };

  useEffect(() => {
    getBarrageInfo();
  }, []);

  useEffect(() => {
    if (!canvasEl) return;
    if (canvasBarrage) return;
    if (!_.isEmpty(roomInfo)) {
      const barrage = new CanvasBarrage(canvasEl.current, roomInfo.speed);
      dispatchCanvasBarrage(barrage);
      message.success('房间初始化成功')
    }
  }, [canvasEl, roomInfo]);

  useEffect(() => {
    createWebSocket();
    // if(timer.current){
    //   clearInterval(timer.current)
    // }
    // timer.current =
    if (!_.isEmpty(roomInfo)) {
      setInterval(() => {
        if (barrageArray.length > 0 && canvasBarrage) {
          const message = barrageArray.shift() as SocketMessageFromClient;
          canvasBarrage.addBarrage(message.data.content, {
            fontSize: roomInfo.fontsize,
            color: roomInfo.color[random(0, roomInfo.color.length)],
          });
          if (requestAnimationFrameId) {
            window.cancelAnimationFrame(requestAnimationFrameId);
          }
          canvasBarrage.render();
        }
      }, 1000);
    }
  }, [canvasBarrage, roomInfo]);

  const createWebSocket = () => {
    try {
      ws = new WebSocket(wsUrl);
      init();
    } catch (e) {
      reconnect(wsUrl);
    }
  };
  const init = () => {
    ws.onclose = function () {
      reconnect(wsUrl);
    };
    ws.onerror = function () {
      message.info("连接关闭了，尝试重连中...");
      reconnect(wsUrl);
    };
    ws.onopen = function () {
      //心跳检测重置
      heartCheck.start();
    };
    ws.onmessage = function (event) {
      // console.log(canvasBarrage);
      //拿到任何消息都说明当前连接是正常的
      heartCheck.start();
      const message: SocketMessageFromClient = JSON.parse(event.data);
      if (message.type == "barrage") {
        barrageArray.push(message);
        ws.send(
          JSON.stringify({
            type: "checkMsg",
            data: event.data,
          })
        );
      }
    };
  };
  const reconnect = (url: string) => {
    if (lockReconnect) {
      return;
    }
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt);
    tt = setTimeout(function () {
      createWebSocket();
      lockReconnect = false;
    }, 4000);
  };
  //心跳检测
  const heartCheck = {
    timeout: 60000,
    timeoutObj: {},
    serverTimeoutObj: {},
    start: function () {
      var self = this;
      this.timeoutObj && clearTimeout(this.timeoutObj as any);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj as any);
      this.timeoutObj = setTimeout(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        ws.send(
          JSON.stringify({
            type: "heart",
            data: null,
          })
        );
        self.serverTimeoutObj = setTimeout(function () {
          ws.close();
        }, self.timeout);
      }, this.timeout);
    },
  };

  return (
    <div
      className={styles.multiBarragePage}
      style={{
        backgroundImage: `url('http://localhost:7000${roomInfo.background_img}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <canvas ref={canvasEl} className={styles.canvasBarrage}></canvas>
    </div>
  );
};

export default MultiBarrage;
