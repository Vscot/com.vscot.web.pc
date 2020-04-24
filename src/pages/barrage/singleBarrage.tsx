import React, { useState, useEffect } from "react";
import styles from "./singleBarrage.less";

let requestAnimationFrameId: any;

class CanvasBarrage {
  public canvasId: any;
  public canvasText: any;
  public isPaused: boolean = true;
  public ratio: any;

  public barrages: any[] = [];

  constructor(canvasId: any) {
    if (!canvasId) return;
    this.canvasId = canvasId;
    this.canvasText = canvasId.getContext("2d");
    this.isPaused = true; // 判断是否关闭弹幕

    // this.canvasText.height = this.canvasText.canvas.clientHeight; // 设置画布的宽高 默认为全屏大小
    // this.canvasText.width = this.canvasText.canvas.clientWidth;

    this.ratio = this.getPixelRatio(this.canvasText);
    console.log(this.ratio);

    canvasId.width = this.canvasText.canvas.clientWidth * this.ratio;
    canvasId.height = this.canvasText.canvas.clientHeight * this.ratio;
    this.canvasText.height = this.canvasText.canvas.clientHeight * this.ratio;
    this.canvasText.width = this.canvasText.canvas.clientWidth * this.ratio;
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
      barrage => barrage.y > -barrage.height
    );
    this.barrages.forEach(barrage => {
      barrage.y -= 1 * barrage.speed;
      barrage.render();
    });
  };
  // 手动添加弹幕类事件
  addBarrage = (value: any) => {
    this.barrages.push(new Barrages(value, this));
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
  public speed: number = 1;
  public canvasText: any;
  public color: string = "#fff";
  public fontSize: number = 20;
  public height: number = 300;
  public x: number = 0;
  public y: number = 0;
  public ratio: any;

  public rowRenderLength: number = 0;
  public range: number = 0;

  constructor(obj: any, props: any) {
    this.time = obj.time || new Date();
    this.obj = obj;
    this.speed = obj.speed || 1;
    this.ratio = props.ratio;
    this.canvasText = props.canvasText; //canvas模板导入
    this.Init();
  }
  // 初始化弹幕的状态，颜色、透明度、阴影、字体大小
  Init = () => {
    this.color = this.obj.color || "red";
    this.fontSize = this.obj.fontSize || 30;
    let opacity = this.obj.opacity || "0.8";
    let position = this.obj.position || "all";
    this.canvasText.shadowColor = `rgba(0,0,0,${opacity})`;
    this.canvasText.shadowBlur = 0;
    this.height = this.fontSize; // 这一点重点注意，根据输入的内容设置canvas的宽度
    // 设置弹幕出现的位置
    this.x = 0;
    this.y = this.canvasText.canvas.clientHeight;
    // 计算每行渲染字体个数
    this.rowRenderLength = Math.floor(
      this.canvasText.width / (this.fontSize * this.ratio)
    );
    this.range = Math.ceil(this.obj.value.length / this.rowRenderLength);
    this.time = (this.fontSize * this.range) / (60 * this.speed);
  };
  render = () => {
    const ctx = this.canvasText;
    ctx.strokeRect(
      this.x + 1,
      this.y + this.range * this.fontSize + 20,
      ctx.canvas.width / this.ratio - 1,
      0
    );
    ctx.stroke();
    this.canvasText.font = `${this.fontSize}px Arial`;
    this.canvasText.fillStyle = this.color;
    //  如果渲染内容存在 并且长度宽于canvas宽度 换行处理
    if (
      this.obj.value &&
      this.canvasText.measureText(this.obj.value).width * this.ratio >
        this.canvasText.width
    ) {
      for (let i = 0; i < this.range; i++) {
        this.canvasText.fillText(
          this.obj.value.substring(
            i * this.rowRenderLength,
            (i + 1) * this.rowRenderLength
          ),
          this.x + 20,
          this.y + this.fontSize * (i + 1)
        );
      }
    } else {
      this.canvasText.fillText(
        this.obj.value,
        this.x + 20,
        this.y + this.fontSize
      );
    }
  };
}
const SingleBarrage = () => {
  const [canvasId, dispatchCanvasId] = useState<any>(null);
  const [canvasBarrage, dispatchCanvasBarrage] = useState<CanvasBarrage | null>(
    null
  );

  const addBarrageClick = () => {
    let data = [
      {
        value:
          "快来呀，造作呀，反正有大把时光。快来呀，造作呀，反正有大把时光。",
        color: "red"
      }
    ];
    let num = Number.parseInt((Math.random() * 8).toString());
    if (canvasBarrage) {
      canvasBarrage.addBarrage(data[0]);
      if (requestAnimationFrameId) {
        window.cancelAnimationFrame(requestAnimationFrameId);
      }
      canvasBarrage.render();
    }
  };
  useEffect(() => {
    if (!canvasId) return;
    dispatchCanvasBarrage(new CanvasBarrage(canvasId));
    if (canvasBarrage) {
      canvasBarrage.render();
    }
  }, [canvasId]);
  return (
    <div className={styles.singleBarrage}>
      <canvas
        ref={el => dispatchCanvasId(el)}
        className={styles.canvasBarrage}
      ></canvas>
      <button onClick={addBarrageClick}>点我</button>
    </div>
  );
};

export default SingleBarrage;
