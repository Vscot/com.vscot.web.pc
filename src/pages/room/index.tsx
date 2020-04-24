import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import styles from "./index.less";
import { Table, Divider, Row, Input, Button, DatePicker, message } from "antd";
import { post } from "@/api";
import globalStoreState from "@/stores";

const { Search } = Input;

interface SearchParams {
  time?: string;
  search?: string;
}

const RoomIndex = () => {
  const history = useHistory();
  const state = useContext(globalStoreState);

  const [date, dispatchDate] = useState("");
  const [search, dispatchSearch] = useState("");

  const [tableData, dispatchTableData] = useState([]);

  const goRoomDetail = (id: string) => {
    history.push(`/roomdetail/${id}`);
  };
  const deleteRoom = (id: string) => {
    post('/v1/room/deleteroom',{
      userid: state.state.userInfo.openid,
      roomid: id
    }).then(res => {
      if(res.data.code === 0){
        message.success("删除功能")
        fetchData()
      }else{
        message.error(res.data.message)
      }
    })
  };

  const goRoom = (id: string) => {
    history.push(`/multibarrage/${id}`);
  };

  const fetchData = () => {
    const searchParams: SearchParams = {
      time: date,
      search
    };
    post("/v1/room/searchroomlist", {
      id: state.state.userInfo.openid
        ? state.state.userInfo.openid
        : "obaiTw7DWmkL34q_nOJ4bBDoMEVo",
      ...searchParams,
    }).then((res) => {
      if (res.data.code !== 0) {
        message.error(res.data.message);
      } else {
        dispatchTableData(res.data.data);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "房间名",
      dataIndex: "title",
      key: "title",
      render: (text: any) => {
        return text ? text : "-";
      },
    },
    {
      title: "房间号",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "当前房间人数",
      dataIndex: "totalnum",
      key: "totalnum",
    },
    {
      title: "房间描述",
      dataIndex: "description",
      key: "description",
      render: (text: any) => {
        return text ? text : "-";
      },
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: any) => (
        <span>
          <Button type="primary" onClick={() => goRoomDetail(record.name)}>
            编辑
          </Button>
          <Divider type="vertical" />
          <Button onClick={() => goRoom(record.name)}>进入房间</Button>
          <Divider type="vertical" />
          <Button type="danger" onClick={() => deleteRoom(record.name)}>
            删除
          </Button>
        </span>
      ),
    },
  ];

  const onDateChange = (date: any, dateString: any) => {
    dispatchDate(dateString);
  };

  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    dispatchSearch(e.target.value as string);
  }

  const handleSearchClick = () => {
    fetchData();
  };

  return (
    <div className={styles.roomPage}>
      <Row style={{ padding: 10 }}>
        <div className={styles.headerToolBar}>
          <DatePicker onChange={onDateChange} style={{ paddingRight: 10 }} />
          <Search
            placeholder="请输入房间号"
            allowClear
            value={search}
            onChange={handleSearchChange}
            style={{ width: 200, paddingRight: 10 }}
          />
          <Button type="primary" onClick={handleSearchClick}>
            搜索
          </Button>
        </div>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={tableData}
        bordered
        size="small"
        style={{
          padding: 10,
        }}
        pagination={false}
      ></Table>
    </div>
  );
};

export default RoomIndex;
