import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

export default class DocSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'light',
      openKeys: [],
      selectedKeys: '',
    }
  }

  componentDidMount() {
    const href = window.location.href;
    const path = href.replace(/.*\/docs/, '');
    const parts = path.split('/');

    const openKeys = parts.reduce(({prev, merge}, cur) => {
      const nextState = { prev, merge };

      if (cur) {
        nextState.prev = `${prev}/${cur}`;
        nextState.merge.push(nextState.prev);
      }

      return nextState;
    }, {
      prev: '',
      merge: [],
    })

    this.setState({
      selectedKeys: path,
      openKeys: openKeys.merge,
    })
  }

  handleClick = (e) => {
    const { openKeys } = this.state;

    if (openKeys.indexOf(e.key) >= 0) {
      this.setState({
        openKeys: openKeys.filter(key => !key.startsWith(e.key))
      })
    } else {
      this.setState({
        openKeys: openKeys.concat(e.key)
      })
    }
  }

  renderSidebar(data, parentSlug) {
    const { children, title, permalink, slug } = data;
    const key = `${parentSlug}/${slug}`;

    if (children.length > 0) {
      return (
        <SubMenu
          key={key}
          title={<span>{title}</span>}
          onTitleClick={this.handleClick.bind(this)}
        >
          {children.map((child, order) => this.renderSidebar(child, key, order))}
        </SubMenu>
      )
    }

    return <Menu.Item key={key}><a href={permalink}>{title}</a></Menu.Item>;
  }

  render() {
    const { manifest } = this.props;
    const { selectedKeys, openKeys } = this.state;
    const base = manifest[0];

    return (
      <section className='sidebar'>
        <div className="doc-belongs">{base.title}</div>

        <Menu
          style={{ width: 210 }}
          selectedKeys={[selectedKeys]}
          openKeys={openKeys}
          mode="inline"
        >
          {base.children.map((data) => this.renderSidebar(data, `/${base.slug}`))}
        </Menu>
        <style jsx global>{`
          {/* .ant-menu-inline .ant-menu-item,
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
          } */}

          .doc-belongs {
            font-size: 14px;
            line-height: 42px;
            padding-left: 24px;
            color: #999;
          }
        `}
        </style>
      </section>
    )
  }
}
