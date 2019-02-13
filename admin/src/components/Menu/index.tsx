import * as React from "react";

import { Image, Menu } from "semantic-ui-react";
// import { Link } from 'react-router-dom';

import { IJWT, ISettings } from "../../rootReducer";
import { ISchema } from "../../interfaces/json-schema";
import { IData } from "../../interfaces/resource";

import "../../style/Menu.css";
import ResourceType from "./ResourceType";

interface IProps {
  jwt: IJWT;
  schema: { [key: string]: ISchema };
  data: IData;
  settings: ISettings;
  push(location: any): any;
}

export default class MainMenu extends React.PureComponent<IProps, {}> {
  render() {
    const resources = this.props.settings.resources;
    return (
      <Menu
        id="main_menu"
        vertical={true}
        inverted={true}
        className="main_menu"
      >
        <Menu.Item>
          <Image avatar={true} src={this.props.jwt.claims.user.image} />&nbsp;
          {this.props.jwt.claims.user.name}
        </Menu.Item>
        {Object.keys(resources).map((type: string) => (
          <ResourceType
            key={type}
            type={type}
            icon={resources[type].icon}
            defaultOpen={false}
            readonly={resources[type].readonly}
          />
        ))}
      </Menu>
    );
  }
}
