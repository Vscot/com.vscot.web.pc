import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  PageHeader,
  Button,
  Descriptions,
  Divider,
  Table,
  Row,
  DatePicker,
  Input,
  message,
  Avatar,
  Form,
  Modal,
  Upload,
} from "antd";
import moment from "moment";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import styles from "./roomDetail.less";
import { post, submitForm } from "@/api";
import { RcFile } from "antd/lib/upload";

const { Search, TextArea } = Input;
const { confirm } = Modal;

interface RoomInfo {
  id?: string;
  title?: string;
  totalnum?: number;
  description?: string;
  speed?: number;
  fontsize?: number;
  background_img?: string;
  name?: string;
  sensitive?: string;
}

interface SearchParams {
  search?: string;
  time?: string;
  page: number;
  pageSize: number;
  id: string;
}

const DefaultRoomInfo = {
  id: "-",
  title: "-",
  totalnum: 0,
  description: "-",
  speed: 0,
  fontsize: 0,
  color: "-",
  background_img: "-",
  name: "-",
  sensitive: "-",
};

const RoomDetail = () => {
  const history = useHistory();
  const param: { id?: string } = useParams();
  const id = param.id as string;

  const [page, dispatchPage] = useState(1);
  const [pageSize, dispatchPageSize] = useState(10);
  const [total, dispatchTotal] = useState(0);

  const [searchValue, dispatchSearchValue] = useState("");
  const [date, dispatchDate] = useState("");
  const [roomInfo, dispatchRoomInfo] = useState(DefaultRoomInfo);
  const [roomUserList, dispatchRoomUserList] = useState([]);

  const [roomForm] = Form.useForm();
  const [roomEditFormVisible, dispatchRoomEditFormVisible] = useState(false);
  const [file, dispatchFile] = useState<RcFile[]>([]);

  const [currentUser, dispatchCurrentUser] = useState("");

  const handleRoomEditFormCancel = () => {
    dispatchRoomEditFormVisible(false);
  };

  const [barrageForm] = Form.useForm();
  const [barrageEditFormVisible, dispatchBarrageEditFormVisible] = useState(
    false
  );
  const handleBarrageEditFormCancel = () => {
    dispatchBarrageEditFormVisible(false);
  };

  const [editUserSendMessageForm] = Form.useForm();
  const [
    editUserSendMessageVisible,
    dispatchEditUserSendMessageVisible,
  ] = useState(false);
  const handleEditUserSendMessageCancel = () => {
    dispatchEditUserSendMessageVisible(false);
  };

  const fetchRoomInfo = () => {
    post("/v1/room/getroominfo", {
      id,
    }).then((res) => {
      if (res.data.code !== 0) {
        message.error(res.data.message);
      } else {
        dispatchRoomInfo(res.data.data);
      }
    });
  };

  const fetchData = () => {
    post("/v1/login/getRoomUserList", {
      page,
      pageSize,
      id,
      time: date,
      search: searchValue,
    }).then((res) => {
      console.log(res);
      if (res.data.code === 0) {
        dispatchRoomUserList(res.data.data);
        dispatchTotal(res.data.total);
      } else {
        message.error(res.data.message);
      }
    });
  };

  useEffect(() => {
    if (id) {
      fetchRoomInfo();
    }
  }, [barrageEditFormVisible, roomEditFormVisible,param.id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [editUserSendMessageVisible,param.id]);

  const columns = [
    {
      title: "用户昵称",
      dataIndex: "nickname",
      key: "nickname",
      ellipsis: true,
      width: 100,
    },
    {
      title: "用户头像",
      dataIndex: "headerimg",
      key: "headerimg",
      ellipsis: true,
      width: 100,
      render: (text: string) => {
        return <Avatar src={text} />;
      },
    },
    {
      title: "用户状态",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        if (text == "0") {
          return "禁言";
        }
        if (text == "1") {
          return "正常";
        }
        if ((text = "-1")) {
          return "限制发言条数";
        }
        return "-";
      },
    },
    {
      title: "用户允许发言条数",
      dataIndex: "num",
      key: "num",
      render: (text: string,record: any) => {
        return record.status === -1 ? text : '-'
      }
    },
    {
      title: "用户加入时间",
      dataIndex: "updatetime",
      key: "updatetime",
      ellipsis: true,
      render: (text: string) => {
        return moment(text).format("YYYY-MM-DD hh:mm:ss");
      },
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: any) => (
        <span>
          <Button
            type="primary"
            onClick={() => editUserSendMessage(record.openid)}
          >
            设置发言条数
          </Button>
          <Divider type="vertical" />
          <Button onClick={() => submitUserBan(record.openid, record.status)}>
            {record.status == 1 ? "设置禁言" : "取消禁言"}
          </Button>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => submitUserOutRoom(record.openid)}
          >
            踢出房间
          </Button>
        </span>
      ),
    },
  ];

  const goBack = () => {
    history.go(-1);
  };
  const onPageChange = (page: number, pageSize?: number) => {
    dispatchPage(page);
  };

  const onPageSizeChange = (current: number, size: number) => {
    dispatchPageSize(current);
  };

  const onDateChange = (date: any, dateString: any) => {
    dispatchDate(dateString);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchSearchValue(e.target.value);
  };

  const handleSearchUser = () => {
    fetchData();
  };

  const handleEditRoomInfo = () => {
    roomForm.setFieldsValue({
      title: roomInfo.title,
      desc: roomInfo.description,
    });
    dispatchFile([
      {
        uid: 1,
        url: roomInfo.background_img ? roomInfo.background_img : "",
        status: "done",
        name: roomInfo.background_img ? roomInfo.background_img : "",
      } as any,
    ]);
    dispatchRoomEditFormVisible(true);
  };

  const handleEditBarrageInfo = () => {
    barrageForm.setFieldsValue({
      speed: roomInfo.speed,
      fontSize: roomInfo.fontsize,
      color: roomInfo.color,
    });
    dispatchBarrageEditFormVisible(true);
  };

  const editUserSendMessage = (userid: string) => {
    dispatchEditUserSendMessageVisible(true);
    dispatchCurrentUser(userid);
  };

  const submitUserBan = (userid: string, status: number) => {
    confirm({
      title: "是否设置该用户禁言?",
      icon: <ExclamationCircleOutlined />,
      content: "点击确定代表确定设置当前选中用户为禁言状态",
      onOk() {
        post("/v1/room/edituserstatus", {
          id,
          userid,
          status: status == 1 ? 0 : 1,
        }).then((res) => {
          if (res.data.code === 0) {
            message.success("设置成功");
            fetchData();
          } else {
            message.error(res.data.message);
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const submitUserOutRoom = (userid: string) => {
    confirm({
      title: "是否将该用户踢出房间?",
      icon: <ExclamationCircleOutlined />,
      content: "点击确定代表确定将当前选择用户踢出当前房间",
      onOk() {
        post("/v1/room/outuser", {
          id,
          userid,
        }).then((res) => {
          if (res.data.code === 0) {
            message.success("踢出房间操作成功");
            fetchData();
          } else {
            message.error(res.data.message);
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const submitUserSendMessage = () => {
    post("/v1/room/setusersendmessage", {
      id,
      userid: currentUser,
      sendnumber: editUserSendMessageForm.getFieldValue("number"),
    }).then((res) => {
      if (res.data.code === 0) {
        message.success("设置成功");
        dispatchEditUserSendMessageVisible(false)
      } else {
        message.error(res.data.message);
      }
    });
  };

  const goRoom = (id: string) => {
    history.push(`/multibarrage/${id}`);
  };

  const editRoomInfo = () => {
    const formData = new FormData();
    const title = roomForm.getFieldValue("title");
    const desc = roomForm.getFieldValue("desc");
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("id", id);
    formData.append("header", "{}");

    if (file && file.length) {
      formData.append("header", file[0]);
    }

    submitForm("/v1/room/editroominfo", formData).then((res) => {
      if (res.data.code === 0) {
        message.success("更改房间设置成功");
        dispatchBarrageEditFormVisible(false);
      } else {
        message.error(res.data.message);
      }
    });
  };

  const editBarrageInfo = () => {
    post("/v1/room/editbarrageinfo", {
      fontSize: barrageForm.getFieldValue("fontSize"),
      speed: barrageForm.getFieldValue("speed"),
      color: barrageForm.getFieldValue("color"),
      id,
    }).then((res) => {
      if (res.data.code === 0) {
        message.success("更改弹幕设置成功");
        dispatchRoomEditFormVisible(false);
      } else {
        message.error(res.data.message);
      }
    });
  };

  return (
    <div className={styles.roomDetailPage}>
      <PageHeader
        className={styles.pageHeader}
        onBack={goBack}
        ghost={false}
        title={roomInfo.name}
        extra={[
          <Button
            type="primary"
            key="editRoomInfo"
            onClick={handleEditRoomInfo}
          >
            编辑房间信息
          </Button>,
          <Button
            type="primary"
            key="editBarrageInfo"
            onClick={handleEditBarrageInfo}
          >
            编辑弹幕信息
          </Button>,
          <Button type="primary" key="goRoom" onClick={() => goRoom(id)}>
            进入房间
          </Button>,
        ]}
      />
      <div className={styles.roomDetailInfo}>
        <Descriptions bordered>
          <Descriptions.Item label="房间标题" span={3}>
            {roomInfo.title}
          </Descriptions.Item>
          <Descriptions.Item label="房间ID" span={2}>
            {roomInfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="房间人数" span={1}>
            <span>{roomInfo.totalnum}</span>
          </Descriptions.Item>
          <Descriptions.Item label="房间描述" span={3}>
            <span>{roomInfo.description}</span>
          </Descriptions.Item>

          <Descriptions.Item label="弹幕速度" span={1}>
            {roomInfo.speed}
          </Descriptions.Item>
          <Descriptions.Item label="弹幕字体大小" span={2}>
            {roomInfo.fontsize}
          </Descriptions.Item>
          <Descriptions.Item label="弹幕颜色" span={3}>
            {roomInfo.color}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.roomDetailInfo}>
        <Row>
          <div
            style={{
              marginBottom: 20,
            }}
          >
            <DatePicker onChange={onDateChange} style={{ paddingRight: 10 }} />
            <Search
              placeholder="请输入用户昵称"
              value={searchValue}
              onChange={handleSearchInputChange}
              style={{ width: 200, paddingRight: 10 }}
            />
            <Button type="primary" onClick={handleSearchUser}>
              搜索
            </Button>
          </div>
        </Row>
        <Table
          columns={columns}
          dataSource={roomUserList}
          bordered
          size="small"
          rowKey="id"
          pagination={{
            position: "bottom",
            pageSize: pageSize,
            current: page,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: onPageSizeChange,
            onChange: onPageChange,
            hideOnSinglePage: false,
          }}
        ></Table>
      </div>

      <Modal
        title="编辑房间信息"
        visible={roomEditFormVisible}
        onCancel={handleRoomEditFormCancel}
        destroyOnClose={true}
        onOk={editRoomInfo}
      >
        <Form form={roomForm}>
          <Form.Item label="标题" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input />
          </Form.Item>
          <Form.Item label="背景图片" name="backgroundImg">
            <Upload
              onRemove={(file) => {}}
              beforeUpload={(file: RcFile) => {
                dispatchFile([file]);
                return false;
              }}
              fileList={file}
            >
              <Button>
                <UploadOutlined /> 上传背景图片
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑弹幕信息"
        visible={barrageEditFormVisible}
        onCancel={handleBarrageEditFormCancel}
        destroyOnClose={true}
        onOk={editBarrageInfo}
      >
        <Form form={barrageForm}>
          <Form.Item label="弹幕速度" name="speed">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="弹幕字体大小" name="fontSize">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="弹幕颜色" name="color">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="设置用户发言条数"
        visible={editUserSendMessageVisible}
        onCancel={handleEditUserSendMessageCancel}
        destroyOnClose={true}
        onOk={submitUserSendMessage}
      >
        <Form form={editUserSendMessageForm}>
          <Form.Item label="发言条数" name="number">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomDetail;
