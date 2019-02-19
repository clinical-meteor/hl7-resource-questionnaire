

import QuestionnairesPage from './client/QuestionnairesPage';
import QuestionnaireTable from './client/QuestionnaireTable';
import QuestionnaireDetail from './client/QuestionnaireDetail';

var DynamicRoutes = [{
  'name': 'QuestionnairePage',
  'path': '/questionnaires',
  'component': QuestionnairesPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Questionnaires',
  'to': '/questionnaires',
  'href': '/questionnaires'
}];
var AdminSidebarElements = [{
  'primaryText': 'Questionnaires',
  'to': '/questionnaires',
  'href': '/questionnaires'
}];

export { 
  AdminSidebarElements,
  SidebarElements, 
  DynamicRoutes, 

  QuestionnairesPage,
  QuestionnaireTable,
  QuestionnaireDetail
};


