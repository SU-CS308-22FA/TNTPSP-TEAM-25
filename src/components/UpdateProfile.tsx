import React, { useRef, useState } from "react";
import { Button, Card, Col, Row, Image, Checkbox, Form, Input } from "antd";
import { Layout } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';



const { Content } = Layout;



function UpdateProfile() {


return (
    
    <div style={{ padding: "15px 15px 0px 15px", background: "#CD1818" , height: 750 }}>
      <Row>
      <Col span={24}>
      <text style={{ fontSize: "50px", fontFamily: "Franklin Gothic Medium", backgroundColor: "#CD1818", }}>
                  Update Profile
                </text>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
      <Avatar style={{}} size={130} icon={<UserOutlined />} />
      </Col>
    </Row>
    <Row>
      <Col span={24}>
      <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      
    >
     
      <Form.Item label="New Email">
        <Input />
      </Form.Item>
      <Form.Item label="New Password">
        <Input />
      </Form.Item>
      <Form.Item>
      <Link to="/Userprofile">
          <button>Submit</button>
        </Link>
      </Form.Item>
      
    </Form>
      </Col>
    </Row>
        
    <Link to="/Userprofile">
          <button>Go back</button>
        </Link>
    </div>

    
   
    );
}
export default UpdateProfile;