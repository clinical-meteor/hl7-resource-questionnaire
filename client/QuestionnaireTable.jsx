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
    id: questionnaire.id,
    active: questionnaire.active.toString(),
    gender: questionnaire.gender,
    name: '',
    mrn: '',
    birthDate: '',
    photo: "/thumbnail-blank.png",
    initials: 'abc'
  };

  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  result.birthDate = moment(questionnaire.birthDate).add(1, 'days').format("YYYY-MM-DD")
  result.photo = get(questionnaire, 'photo[0].url', '');
  result.mrn = get(questionnaire, 'identifier[0].value', '');

  if(has(questionnaire, 'name[0].text')){
    result.name = get(questionnaire, 'name[0].text');    
  } else {
    result.name = get(questionnaire, 'name[0].given[0]') + ' ' + get(questionnaire, 'name[0].family[0]');
  }

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
      patients: []
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
        this.props.data.forEach(function(patient){
          data.patients.push(flattenQuestionnaire(patient));
        });  
      }
    } else {
      data.patients = Questionnaires.find().map(function(patient){
        return flattenQuestionnaire(patient);
      });
    }


    if (Session.get('appWidth') < 768) {
      data.style.hideOnPhone.visibility = 'hidden';
      data.style.hideOnPhone.display = 'none';
      data.style.cellHideOnPhone.visibility = 'hidden';
      data.style.cellHideOnPhone.display = 'none';
    } else {
      data.style.hideOnPhone.visibility = 'visible';
      data.style.hideOnPhone.display = 'table-cell';
      data.style.cellHideOnPhone.visibility = 'visible';
      data.style.cellHideOnPhone.display = 'table-cell';
    }

    // console.log("QuestionnaireTable[data]", data);
    return data;
  }
  imgError(avatarId) {
    this.refs[avatarId].src = Meteor.absoluteUrl() + 'noAvatar.png';
  }
  rowClick(id){
    Session.set('patientsUpsert', false);
    Session.set('selectedQuestionnaire', id);
    Session.set('patientPageTabIndex', 2);
  }
  renderRowAvatarHeader(){
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <th className='avatar'>photo</th>
      );
    }
  }
  renderRowAvatar(patient, avatarStyle){
    console.log('renderRowAvatar', patient, avatarStyle)
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <td className='avatar'>
          <img src={patient.photo} ref={patient._id} onError={ this.imgError.bind(this, patient._id) } style={avatarStyle}/>
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
  renderSendButton(patient, avatarStyle){
    if (this.props.showSendButton === true) {
      return (
        <td className='sendButton' style={this.data.style.hideOnPhone}>
          <FlatButton label="send" onClick={this.onSend.bind('this', this.data.patients[i]._id)}/>
        </td>
      );
    }
  }
  onSend(id){
    let patient = Questionnaires.findOne({_id: id});

    console.log("QuestionnaireTable.onSend()", patient);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Questionnaire', {
      data: patient
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  selectQuestionnaireRow(patientId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(patientId);
    }
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.patients.length === 0){
      footer = <TableNoData noDataPadding={ this.props.noDataPadding } />
    } else {
      for (var i = 0; i < this.data.patients.length; i++) {
        tableRows.push(
          <tr key={i} className="patientRow" style={{cursor: "pointer"}} onClick={this.selectQuestionnaireRow.bind(this, this.data.patients[i].id )} >
  
            { this.renderRowAvatar(this.data.patients[i], this.data.style.avatar) }
  
            <td className='name' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].name }</td>
            <td className='title' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].title }</td>
            <td className='status' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].status }</td>
            <td className='approvalDate' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.patients[i].birthDate }</td>
            <td className='purpose' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cellHideOnPhone}>{this.data.patients[i].purpose}</td>
            <td className='code' style={this.data.style.cellHideOnPhone}>{this.data.patients[i].code}</td>
            <td className='id' onClick={ this.rowClick.bind('this', this.data.patients[i].id)} style={this.data.style.cellHideOnPhone}><span className="barcode">{this.data.patients[i].id}</span></td>            

              { this.renderSendButton(this.data.patients[i], this.data.style.avatar) }
          </tr>
        );
      }
    }
    


    return(
      <div>
        <Table id='patientsTable' hover >
          <thead>
            <tr>
              { this.renderRowAvatarHeader() }

              <th className='title'>title</th>
              <th className='name'>name</th>
              <th className='status'>status</th>
              <th className='approvalDate' style={{minWidth: '100px'}}>approval date</th>
              <th className='purpose' style={this.data.style.hideOnPhone}>purpose</th>
              <th className='code' style={this.data.style.hideOnPhone}>code</th>
              <th className='id' style={this.data.style.hideOnPhone}>_id</th>
              
              { this.renderSendButtonHeader() }
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