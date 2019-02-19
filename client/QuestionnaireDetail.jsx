import { CardActions, CardText, CardTitle, RaisedButton, TextField } from 'material-ui';
import { get } from 'lodash';

import { Bert } from 'meteor/clinical:alert';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Questionnaires } from '../lib/Questionnaires';
import { Session } from 'meteor/session';


let defaultQuestionnaire = {
  "resourceType" : "Questionnaire"
};


Session.setDefault('questionnaireUpsert', false);
Session.setDefault('selectedQuestionnaire', false);

export class QuestionnaireDetail extends React.Component {
  getMeteorData() {
    let data = {
      questionnaireId: false,
      questionnaire: defaultQuestionnaire
    };

    if (Session.get('questionnaireUpsert')) {
      data.questionnaire = Session.get('questionnaireUpsert');
    } else {
      if (Session.get('selectedQuestionnaire')) {
        data.questionnaireId = Session.get('selectedQuestionnaire');
        console.log("selectedQuestionnaire", Session.get('selectedQuestionnaire'));

        let selectedQuestionnaire = Questionnaires.findOne({_id: Session.get('selectedQuestionnaire')});
        console.log("selectedQuestionnaire", selectedQuestionnaire);

        if (selectedQuestionnaire) {
          data.questionnaire = selectedQuestionnaire;

          if (typeof selectedQuestionnaire.birthDate === "object") {
            data.questionnaire.birthDate = moment(selectedQuestionnaire.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.questionnaire = defaultQuestionnaire;
      }
    }

    console.log("QuestionnaireDetail[data]", data);
    return data;
  }

  render() {

    let questionnaireDocument;
    let questions = [];
    if(this.data.questionnaire){
      if(get(this.data.questionnaire, 'item')){
        this.data.questionnaire.item.forEach(function(item){
          console.log('item', item)
          if(['question', 'choice'].includes(item.type)){
            questions.push(<li key={get(item, 'id')}>
            <CardTitle 
              title={get(item, 'text')} 
              subtitle={get(item, 'type')}
              />
          </li>)
          }
        }
      )}

      questionnaireDocument = <div id='questionnaireDocument'>
        <ul>
          { questions }
        </ul>
      </div>
    }

    return (
      <div id={this.props.id} className="questionnaireDetail">
        { questionnaireDocument }   
      </div>
    );
  }
  determineButtons(questionnaireId){
    if (questionnaireId) {
      return (
        <div>
          <RaisedButton id='saveQuestionnaireButton' className='saveQuestionnaireButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveQuestionnaireButton'  className='saveQuestionnaireButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  changeState(field, event, value){
    let questionnaireUpdate;

    if(process.env.TRACE) console.log("questionnaireDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new questionnaire
    if (Session.get('questionnaireUpsert')) {
      questionnaireUpdate = Session.get('questionnaireUpsert');
    } else {
      questionnaireUpdate = defaultQuestionnaire;
    }



    // if there's an existing questionnaire, use them
    if (Session.get('selectedQuestionnaire')) {
      questionnaireUpdate = this.data.questionnaire;
    }

    switch (field) {
      case "name":
        questionnaireUpdate.name[0].text = value;
        break;
      case "gender":
        questionnaireUpdate.gender = value.toLowerCase();
        break;
      case "birthDate":
        questionnaireUpdate.birthDate = value;
        break;
      case "photo":
        questionnaireUpdate.photo[0].url = value;
        break;
      case "mrn":
        questionnaireUpdate.identifier[0].value = value;
        break;
      default:

    }
    // questionnaireUpdate[field] = value;
    process.env.TRACE && console.log("questionnaireUpdate", questionnaireUpdate);

    Session.set('questionnaireUpsert', questionnaireUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let questionnaireUpdate = Session.get('questionnaireUpsert', questionnaireUpdate);


    if (questionnaireUpdate.birthDate) {
      questionnaireUpdate.birthDate = new Date(questionnaireUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("questionnaireUpdate", questionnaireUpdate);

    if (Session.get('selectedQuestionnaire')) {
      if(process.env.NODE_ENV === "test") console.log("Updating questionnaire...");

      delete questionnaireUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      questionnaireUpdate.resourceType = 'Questionnaire';

      Questionnaires.update({_id: Session.get('selectedQuestionnaire')}, {$set: questionnaireUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Questionnaires.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Questionnaires", recordId: Session.get('selectedQuestionnaire')});
          // Session.set('questionnaireUpdate', defaultQuestionnaire);
          Session.set('questionnaireUpsert', false);
          Session.set('selectedQuestionnaire', false);
          Session.set('questionnairePageTabIndex', 1);
          Bert.alert('Questionnaire added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new questionnaire...", questionnaireUpdate);

      Questionnaires.insert(questionnaireUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Questionnaires.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Questionnaires", recordId: result});
          Session.set('questionnairePageTabIndex', 1);
          Session.set('selectedQuestionnaire', false);
          Session.set('questionnaireUpsert', false);
          Bert.alert('Questionnaire added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('questionnairePageTabIndex', 1);
  }

  handleDeleteButton(){
    Questionnaires.remove({_id: Session.get('selectedQuestionnaire')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Questionnaires.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Questionnaires", recordId: Session.get('selectedQuestionnaire')});
        // Session.set('questionnaireUpdate', defaultQuestionnaire);
        Session.set('questionnaireUpsert', false);
        Session.set('questionnairePageTabIndex', 1);
        Session.set('selectedQuestionnaire', false);
        Bert.alert('Questionnaire removed!', 'success');
      }
    });
  }
}


ReactMixin(QuestionnaireDetail.prototype, ReactMeteorData);
export default QuestionnaireDetail;