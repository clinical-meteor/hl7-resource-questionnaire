import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';
import { GlassCard, VerticalCanvas } from 'meteor/clinical:glass-ui';

import Glass from './Glass';
//import GlassCard from './GlassCard';
import QuestionnaireDetail from './QuestionnaireDetail';
import QuestionnaireTable from './QuestionnaireTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
//import { VerticalCanvas } from './VerticalCanvas';

// import { Questionnaires } from '../lib/Questionnaires';
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
        <VerticalCanvas>
          <GlassCard height="auto">
            <CardTitle
              title="Questionnaires"
            />
            <CardText>
              <Tabs id='questionnairesPageTabs' default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                 <Tab className="newQuestionnaireTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                   {/* <QuestionnaireDetail id='newQuestionnaire' /> */}
                 </Tab>
                 <Tab className="questionnaireListTab" label='Questionnaires' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                   <QuestionnaireTable showBarcodes={true} showAvatars={true} />
                 </Tab>
                 <Tab className="questionnaireDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                   {/* <QuestionnaireDetail id='questionnaireDetails' currentQuestionnaire={this.data.currentQuestionnaire} /> */}
                 </Tab>
             </Tabs>


            </CardText>
          </GlassCard>
        </VerticalCanvas>
      </div>
    );
  }
}



ReactMixin(QuestionnairesPage.prototype, ReactMeteorData);

export default QuestionnairesPage;