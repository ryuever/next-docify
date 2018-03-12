import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

export default class DocSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'light',
      current: '1',
    }
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 210 }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[this.state.current]}
        mode="inline"
      >
        <SubMenu key="sub1" title={<span>概述</span>}>
          <Menu.Item key="1">概述</Menu.Item>
        </SubMenu>

        <SubMenu key="sub2" title={<span>开发指南</span>}>
          <SubMenu key="sub2-1" title={<span>创建项目</span>}>
            <Menu.Item key="1">Android Studio配置</Menu.Item>
            <Menu.Item key="2">Hello PalMap</Menu.Item>
            <Menu.Item key="3">开发注意事项</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2-2" title={<span>创建地图</span>}>
            <Menu.Item key="4">显示地图</Menu.Item>
            <Menu.Item key="5">显示定位</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2-3" title={<span>地图交互</span>}>
            <Menu.Item key="6">事件交互</Menu.Item>
            <Menu.Item key="7">控件和手势</Menu.Item>
            <Menu.Item key="8">方法交互</Menu.Item>
          </SubMenu>

          <SubMenu key="sub2-4" title={<span>在地图上绘制</span>}>
            <Menu.Item key="9">添加文本标记</Menu.Item>
            <Menu.Item key="10">点标记动画</Menu.Item>
            <Menu.Item key="11">绘制点标记</Menu.Item>
            <Menu.Item key="12">绘制线</Menu.Item>
          </SubMenu>

          <SubMenu key="sub2-5" title={<span>路线规划</span>}>
            <Menu.Item key="13">实现路线规划</Menu.Item>
          </SubMenu>

          <SubMenu key="sub2-6" title={<span>导航</span>}>
            <Menu.Item key="14">实现室内导航</Menu.Item>
          </SubMenu>

          <SubMenu key="sub2-7" title={<span>工具</span>}>
            <Menu.Item key="15">坐标转换</Menu.Item>
          </SubMenu>

          <SubMenu key="sub2-8" title={<span>实用文档</span>}>
          </SubMenu>
        </SubMenu>

        <SubMenu key="sub3" title={<span>更新日志</span>}>
          <Menu.Item key="1">概述</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}
