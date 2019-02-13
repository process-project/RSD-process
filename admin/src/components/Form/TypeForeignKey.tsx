import * as React from "react";
import { IProps } from "./IProps";
import { IForeignKeySchema } from "../../interfaces/json-schema";
import { IResource } from "../../interfaces/resource";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";
import styled from "styled-components";
import resourceToString from "../../custom/resourceToString";

interface IState {
  choices: DropdownItemProps[];
  isOpen: boolean;
}

export default class TypeForeignKey extends React.Component<
  IProps<IForeignKeySchema>,
  IState
> {
  constructor(props: IProps<IForeignKeySchema>) {
    super(props);
    this.state = {
      choices: this.computeChoices(),
      isOpen: false
    };
  }

  validate() {
    if (
      !this.state.choices.find(choice => choice.key === this.props.value.id)
    ) {
      return [
        {
          message: `key "${this.props.value.id}" not found in collection "${
            this.props.value.collection
          }"`
        }
      ];
    }
    return [];
  }

  computeChoices() {
    const foreignType = this.props.schema.properties.collection.enum[0];
    const foreignData = this.props.data[foreignType];
    return foreignData.map((item: IResource) => ({
      key: item.primaryKey.id,
      value: item.primaryKey.id,
      text: resourceToString(item, this.props.resourceTemplates[foreignType])
    }));
  }

  shouldComponentUpdate(newProps: IProps<IForeignKeySchema>, newState: IState) {
    return (
      newState !== this.state ||
      newProps.value !== this.props.value ||
      newProps.data !== this.props.data ||
      newProps.validationErrors !== this.props.validationErrors
    );
  }

  render() {
    const currentChoice = this.state.choices.find(
      choice => choice.key === this.props.value.id
    );
    const options = this.state.isOpen
      ? this.state.choices
      : currentChoice
        ? [currentChoice]
        : [];

    return (
      <Container>
        <Left>
          {this.props.showLabel !== false && (
            <Label>
              {(this.props.settings && this.props.settings.label) ||
                this.props.label}
            </Label>
          )}
        </Left>
        <div style={{ flex: 1 }}>
          <Dropdown
            disabled={!!this.props.readonly || !!this.props.settings.readonly}
            defaultValue={this.props.value ? this.props.value.id : null}
            selection={true}
            fluid={true}
            search={true}
            options={options}
            style={{ width: "100%" }}
            onChange={(_, field) =>
              this.props.onChange({
                id: field.value,
                collection: this.props.schema.properties.collection.enum[0]
              })
            }
            onOpen={() => this.setState({ isOpen: true })}
            onClose={() => this.setState({ isOpen: false })}
          />
          {this.props.validationErrors &&
            this.props.validationErrors.map((error, i) => (
              <div key={i}>
                <span style={{ color: "red" }}>{error.message}</span>
              </div>
            ))}
        </div>
      </Container>
    );
  }
}

const Left = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  min-width: 150px;
`;

const Label = styled.label`
  display: inline-block;
  font-weight: bold;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
