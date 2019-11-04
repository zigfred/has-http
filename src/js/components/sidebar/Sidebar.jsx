import React, { Component } from "react";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarCollapsed: false
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }
  toggleSidebar() {
    this.setState({
      sidebarCollapsed: !this.state.sidebarCollapsed
    });
  }

  render() {
    const {sidebarCollapsed} = this.state;
    return (
      <div className={sidebarCollapsed ? "sidebarComponent" : "sidebarComponent active"}>
        <div className="sidebar">
          {this.props.sidebar}
        </div>

        <div className="content" >
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default Sidebar;