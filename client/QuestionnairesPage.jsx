import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';
import { Glass, GlassCard, VerticalCanvas, FullPageCanvas } from 'meteor/clinical:glass-ui';

import QuestionnaireDetail from './QuestionnaireDetail';
import QuestionnaireTable from './QuestionnaireTable';
import SortableQuestionnaire from './SortableQuestionnaire';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';


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
      currentQuestionnaire: null
    };

    if (Session.get('questionnaireFormData')) {
      data.questionnaire = Session.get('questionnaireFormData');
    }
    if (Session.get('questionnaireSearchFilter')) {
      data.questionnaireSearchFilter = Session.get('questionnaireSearchFilter');
    }
    if (Session.get("selectedQuestionnaire")) {
      data.currentQuestionnaire = Session.get("selectedQuestionnaire");
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("QuestionnairesPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('questionnairePageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedQuestionnaire', false);
    Session.set('questionnaireUpsert', false);
  }

  render() {
    console.log('React.version: ' + React.version);
    return (
      <div id="questionnairesPage">
        <FullPageCanvas>
          <Col md={8}>
            <GlassCard height="auto">
              <CardTitle
                title="Questionnaires"
              />
              <CardText>
                <Tabs id='questionnairesPageTabs' default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                  <Tab className="newQuestionnaireTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                    <QuestionnaireDetail id='newQuestionnaire' />
                  </Tab>
                  <Tab className="questionnaireListTab" label='Questionnaires' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                    <Col md={6}>
                      <QuestionnaireTable showBarcodes={true} showAvatars={true} />
                    </Col>
                    <Col md={6}>
                    <SortableQuestionnaire />
                    </Col>
                  </Tab>
                  <Tab className="questionnaireDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                    <QuestionnaireDetail id='questionnaireDetails' currentQuestionnaire={this.data.currentQuestionnaire} />
                  </Tab>
              </Tabs>


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