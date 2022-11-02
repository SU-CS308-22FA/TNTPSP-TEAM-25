import React, { useRef, useState } from "react";
import { Button, Card, Col, Row, Image, Checkbox, Form, Input } from "antd";
import { Layout } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Link } from "react-router-dom";
import LoginPage from "./LoginPage";



const { Content } = Layout;

interface activePage {
    page: string;
  }

function SignupPage() {

  const onFinish = (values: any) => {
      const formInfo = {
        username: values.username,
        email: values.email,
        password: values.password
      }
      console.log(values);

      var url = "/register?email=" + values.email + "&password=" + values.password
      fetch(url, {
        method: "GET"
      }).then(res => console.log(res))

  }

      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

return (
    <div style={{ padding: "15px 15px 0px 15px", background: "#CD1818" , height: 750 }}>
    <Row>
      <Col span={2} />
      <Col span={6}>
      <Row>
      <Col span={12}>
      <text style={{ fontSize: "75px", fontFamily: "Franklin Gothic Medium", backgroundColor: "#CD1818", }}>
                  TNTPSP
                </text>
      </Col>
      <Col span={12}>
      <text style={{ fontSize: "35px", fontFamily: "Franklin Gothic Medium", backgroundColor: "#CD1818", }}>
                  Turkish National Team Player Selection Platform
                </text>
      </Col>
    </Row>
      </Col>

      <Col span={10}>
      <Card
          bordered={false} style={{ backgroundColor: "#CD1818", height: 200, width: 700, borderWidth: "32px", marginRight: "10000px", }}>
          <Row>
          <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >

     <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input name="username"/>
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input name="email"/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password name="password "/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
          </Row>

          <br />
        </Card>
      </Col>
      <Col span={6} >
      <Link to="/">
          <button>Go to Login</button>
        </Link>
      </Col>

    </Row>
    <br />
  </div>



    );
}
export default SignupPage;
