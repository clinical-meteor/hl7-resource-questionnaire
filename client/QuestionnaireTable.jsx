import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';
import { TableNoData } from 'meteor/clinical:glass-ui'


flattenQuestionnaire = function(questionnaire){
  let result = {
    _id: questionnaire._id,
    title: '',
    state: '',
    date: '',
    items: 0
  };

  result.date = moment(questionnaire.date).add(1, 'days').format("YYYY-MM-DD")
  result.title = get(questionnaire, 'title', '');
  result.status = get(questionnaire, 'status', '');
  result.items = get(questionnaire, 'item', []).length;

  return result;
}

export class QuestionnaireTable extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    let data = {
      style: {
        hideOnPhone: {
          visibility: 'visible',
          display: 'table'
        },
        cellHideOnPhone: {
          visibility: 'visible',
          display: 'table',
          paddingTop: '16px',
          maxWidth: '120px'
        },
        cell: {
          paddingTop: '16px'
        },
        avatar: {
          // color: rgb(255, 255, 255);
          backgroundColor: 'rgb(188, 188, 188)',
          userSelect: 'none',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      selected: [],
      questionnaires: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }
    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    if(this.props.data){
      // console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(questionnaire){
          data.questionnaires.push(flattenQuestionnaire(questionnaire));
        });  
      }
    } else {
      data.questionnaires = Questionnaires.find().map(function(questionnaire){
        return flattenQuestionnaire(questionnaire);
      });
    }


    // console.log("QuestionnaireTable[data]", data);
    return data;
  }
  imgError(avatarId) {
    this.refs[avatarId].src = Meteor.absoluteUrl() + 'noAvatar.png';
  }
  rowClick(id){
    Session.set('questionnairesUpsert', false);
    Session.set('selectedQuestionnaire', id);
    // Session.set('questionnairePageTabIndex', 2);
  }
  renderRowAvatarHeader(){
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <th className='avatar'>photo</th>
      );
    }
  }
  renderRowAvatar(questionnaire, avatarStyle){
    console.log('renderRowAvatar', questionnaire, avatarStyle)
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <td className='avatar'>
          <img src={questionnaire.photo} ref={questionnaire._id} onError={ this.imgError.bind(this, questionnaire._id) } style={avatarStyle}/>
        </td>
      );
    }
  }
  renderSendButtonHeader(){
    if (this.props.showSendButton === true) {
      return (
        <th className='sendButton' style={this.data.style.hideOnPhone}></th>
      );
    }
  }
  renderSendButton(questionnaire, avatarStyle){
    if (this.props.showSendButton === true) {
      return (
        <td className='sendButton' style={this.data.style.hideOnPhone}>
          <FlatButton label="send" onClick={this.onSend.bind('this', this.data.questionnaires[i]._id)}/>
        </td>
      );
    }
  }
  onSend(id){
    let questionnaire = Questionnaires.findOne({_id: id});

    console.log("QuestionnaireTable.onSend()", questionnaire);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Questionnaire', {
      data: questionnaire
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  selectQuestionnaireRow(questionnaireId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(questionnaireId);
    }
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.questionnaires.length === 0){
      footer = <TableNoData noDataPadding={ this.props.noDataPadding } />
    } else {
      for (var i = 0; i < this.data.questionnaires.length; i++) {
        tableRows.push(
          <tr key={i} className="questionnaireRow" style={{cursor: "pointer"}} onClick={this.selectQuestionnaireRow.bind(this, this.data.questionnaires[i].id )} >
            <td className='title' onClick={ this.rowClick.bind('this', this.data.questionnaires[i]._id)} style={this.data.style.cell}>{this.data.questionnaires[i].title }</td>
            <td className='status' onClick={ this.rowClick.bind('this', this.data.questionnaires[i]._id)} style={this.data.style.cell}>{this.data.questionnaires[i].status }</td>
            <td className='date' onClick={ this.rowClick.bind('this', this.data.questionnaires[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.questionnaires[i].date }</td>
            <td className='items' onClick={ this.rowClick.bind('this', this.data.questionnaires[i]._id)} style={this.data.style.cell}>{this.data.questionnaires[i].items }</td>
          </tr>
        );
      }
    }
    


    return(
      <div>
        <Table id='questionnairesTable' hover >
          <thead>
            <tr>
              <th className='title'>Title</th>
              <th className='status'>Status</th>
              <th className='date' style={{minWidth: '100px'}}>Date</th>
              <th className='items'>Items</th>
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
        { footer }
      </div>
    );
  }
}


ReactMixin(QuestionnaireTable.prototype, ReactMeteorData);
export default QuestionnaireTable;