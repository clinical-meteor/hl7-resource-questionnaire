import { CardActions, CardText, CardTitle, RaisedButton, TextField } from 'material-ui';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';
 


const SortableItem = SortableElement(({value}) => <li style={{listStyleType: 'none'}}>
    <TextField value={value} />
</li>);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul style={{cursor: 'pointer', listStyleType: 'none'}}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});



export class SortableQuestionnaire extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        items: this.props.items
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };
    render() {
        return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
    }
}

export default SortableQuestionnaire;
