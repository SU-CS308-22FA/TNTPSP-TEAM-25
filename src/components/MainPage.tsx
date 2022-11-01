import React, { useRef, useState } from "react";
import { Button, Card, Col, Row,Divider, Image, Checkbox, Form, Input } from "antd";
import { Layout } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Link } from "react-router-dom";



const { Content } = Layout;


function MainPage() {

return (
    
    <div style={{ padding: "15px 15px 0px 15px", background: "#CD1818", height: 750 }}>
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
    <br />
    <Row>
      <Col span={24}>
      <Link to="/Userprofile">
          <button>Go to User Profile</button>
        </Link>
      </Col>
    </Row>
    
    <Row>
          <Col span={2} />
          <Col span={10}>
            <Card
              bordered={false} style={{ backgroundColor: "#CD1818", height: 200, width: 700, borderWidth: "32px", marginRight: "10000px", }}>
              <Row>
                <text style={{ fontSize: "50px", fontFamily: "serif", backgroundColor: "#CD1818", }}>
                  Comment, Communicate, Rate
                </text>
              </Row>
              <Row>
                <Col span={20} style={{ marginTop: 30, marginBottom: 35 }}>
                  <text style={{ fontSize: "20px", fontWeight: "bold", opacity: 0.65, }}>
                  TNTPSP is a social media platform which recommends Turkish national team player selection to Turkish Football Federation.
                  </text>
                </Col>
              </Row>
             
              <br />
            </Card>
          </Col>

          <Col span={10}>
           
          </Col>
          <Col span={2} />
        </Row>
    <br />
    </div>
    
    
    

    
   
    );
}
export default MainPage;