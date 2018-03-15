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

  renderSidebar(data, i) {
    const { children, depth, value } = data;
    const key = `${depth}-${i}`;
    if (children.length > 0) {
      return (
        <SubMenu key={key} title={<span>{value}</span>}>
          {children.map((child, key) => this.renderSidebar(child, key))}
        </SubMenu>
      )
    }

    return <Menu.Item key={key}>{value}</Menu.Item>
  }

  render() {
    const { manifest } = this.props;
    return (
      <section className='sidebar'>
        <Menu
          onClick={this.handleClick}
          style={{ width: 210 }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[this.state.current]}
          mode="inline"
        >
          {manifest.map((data, i) => this.renderSidebar(data, i))}
        </Menu>
        <style jsx global>{`
          .ant-menu-inline .ant-menu-item,
          .ant-menu-inline .ant-menu-submenu-title,
          .ant-menu-vertical .ant-menu-item,
          .ant-menu-vertical .ant-menu-submenu-title {
            font-size: 14px !important;
            line-height: 55px !important;
            color: #333 !important;
            height: 55px !important;
          }

          :root .ant-menu-submenu-inline>.ant-menu-submenu-title:after {
            font-size: 14px !important;
          }
        `}
        </style>
      </section>
    )
  }
}
