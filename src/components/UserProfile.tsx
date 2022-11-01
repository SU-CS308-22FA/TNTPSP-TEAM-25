import React, { useRef, useState } from "react";
import { Button, Card, Col, Row, Image, Checkbox, Form, Input } from "antd";
import { Layout } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Link } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';



const { Content } = Layout;


function UserProfile() {

return (
    
    <div style={{ padding: "15px 15px 0px 15px", background: "#CD1818" , height: 750 }}>
      <Row>
      <Col span={24}>
      <text style={{ fontSize: "50px", fontFamily: "Franklin Gothic Medium", backgroundColor: "#CD1818", }}>
                  Welcome to User Profile
                </text>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
      <Avatar style={{}} size={130} icon={<UserOutlined />} />
      </Col>
    </Row>
        <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div className="card">
        <h1> name </h1>
        <p className="title"> email@gmail.com</p>
        <p> Standart User </p>
        <p> Password </p>
        
        <p>
        <Link to="/UpdateProfile">
          <button>Update</button>
        </Link>
        </p>
        <p>
          <button>Delete</button>
        </p>
      </div>
    </div>
    <Link to="/Mainpage">
          <button>Go back</button>
        </Link>
    </div>

    
   
    );
}
export default UserProfile;