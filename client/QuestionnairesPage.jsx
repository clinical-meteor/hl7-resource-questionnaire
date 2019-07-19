import { CardText, CardTitle, CardActions, Tab, Tabs, TextField, Toggle, RaisedButton } from 'material-ui';
import { Glass, GlassCard, VerticalCanvas, FullPageCanvas, DynamicSpacer } from 'meteor/clinical:glass-ui';
import { Select, MenuItem } from '@material-ui/core';

import QuestionnaireDetail from './QuestionnaireDetail';
import QuestionnaireTable from './QuestionnaireTable';
import SortableQuestionnaire from './SortableQuestionnaire';


import PropTypes from 'prop-types';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Grid, Col, Row } from 'react-bootstrap';
import { get } from 'lodash';
import { Session } from 'meteor/session';



let defaultQuestionnaire = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('questionnaireFormData', defaultQuestionnaire);
Session.setDefault('questionnaireSearchFilter', '');


Session.setDefault('enableCurrentQuestionnaire', false);
export class QuestionnairesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('questionnairePageTabIndex'),
      questionnaire: defaultQuestionnaire,
      questionnaireSearchFilter: '',
      currentQuestionnaire: null,
      questionnaireId: false,
      sortableItems: ['Lorem ipsum?', 'Ipsum foo?', 'Dolar set et?'],
      enabled: Session.get('enableCurrentQuestionnaire'),
      chatbotInstalled: false
    };

    if (Session.get('questionnaireFormData')) {
      data.questionnaire = Session.get('questionnaireFormData');
    }
    if (Session.get('questionnaireSearchFilter')) {
      data.questionnaireSearchFilter = Session.get('questionnaireSearchFilter');
    }
    if (Session.get("selectedQuestionnaire")) {
      console.log("data.questionnaireId", Session.get('data.questionnaireId'));

        data.currentQuestionnaire = Questionnaires.findOne({_id: Session.get('selectedQuestionnaire')});
        console.log("data.currentQuestionnaire", data.currentQuestionnaire);

        if (get(data, 'selectedQuestionnaire.item')) {
          data.sortableItems = [];
          data.currentQuestionnaire.item.forEach(function(item){
            console.log('item', item)
            data.sortableItems.push(get(item, 'text'));              
          });
        }
    }


    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    console.log("QuestionnairesPage[data]", data);
    return data;
  }
  enableQuestionnaire(){
    Session.toggle('enableCurrentQuestionnaire');
  }

  handleTabChange(index){
    Session.set('questionnairePageTabIndex', index);
  }
  selectLanguage(){
    
  }
  onNewTab(){
    Session.set('selectedQuestionnaire', false);
    Session.set('questionnaireUpsert', false);
  }
  addChoice(){
    console.log('addChoice')
  }
  render() {
    console.log('React.version: ' + React.version);

    return (
      <div id="questionnairesPage">
        <FullPageCanvas>
          <Col md={4}>
            <GlassCard height="auto">
              <CardTitle
                title="Questionnaires"
              />
              <QuestionnaireTable 
                hideCheckboxes={true}
                hideIdentifier={true}
                onRemoveRecord={function(questionnaireId){
                  Questionnaires.remove({_id: questionnaireId})
                }}
              />
            </GlassCard>
          </Col>
          <Col md={4}>
            <GlassCard >
              <CardTitle 
                id='questionnaireTitleInput' 
                title={get(this, 'data.currentQuestionnaire.title')} 
                />
              <CardText>
                {/* <Select
                  value={ currentSelectIndex }
                  onChange={this.selectLanguage}
                  style={{
                    position: 'absolute',     
                    right: '20px',
                    top: '20px',
                    marginRight: '20px',
                    width: '240px',
                    fontSize: '150%'
                  }}
                  inputProps={{
                    name: 'age',
                    id: 'age-simple',
                  }}
                >
                  { menuItems }
                </Select> */}
              <Toggle
                label="Enabled"
                toggled={ this.data.enabled }
                onToggle={ this.enableQuestionnaire.bind(this) }
              />
              </CardText>
            </GlassCard>
            <DynamicSpacer />

            <CardTitle 
                title='Add Questions' 
                />

            <GlassCard >
              <CardText>
                <TextField
                  hintText="Lorem ipsum..."
                  errorText="Question"
                  type='text'
                  fullWidth />
              </CardText>
              <CardActions>

              </CardActions>
            </GlassCard>
            <DynamicSpacer />

            <GlassCard >
              <CardText>
                <TextField
                  hintText="Lorem ipsum dolor set et..."
                  errorText="Multiline"
                  type='text'
                  multiLine={true}         
                  rows={3}         
                  fullWidth />
              </CardText>
            </GlassCard>
            <DynamicSpacer />

            <GlassCard >
              <CardText>
              <TextField
                  hintText="Lorem ipsum...."
                  errorText="Multiple Choice Question"
                  type='text'
                  fullWidth />
                <TextField
                  hintText="Multiple Choice"
                  errorText="New Choice"
                  type='text'
                  style={{paddingLeft: '20px'}}
                  fullWidth />
                  <DynamicSpacer />
                <RaisedButton onClick={this.addChoice} style={{margin: '20px'}}>Add</RaisedButton>
              </CardText>

            </GlassCard>
            <DynamicSpacer />
            



          </Col>
          <Col md={4}>
            <GlassCard height='auto' >
              <CardText>
                <QuestionnaireDetail id='questionnaireDetails' currentQuestionnaire={this.data.currentQuestionnaire}  />
              </CardText>
            </GlassCard>
          </Col>
          
        </FullPageCanvas>
      </div>
    );
  }
}


ReactMixin(QuestionnairesPage.prototype, ReactMeteorData);
export default QuestionnairesPage;