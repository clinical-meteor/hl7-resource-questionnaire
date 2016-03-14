
Questionnaires = new Meteor.Collection('questionnaires');

if (Meteor.isClient){
  Meteor.subscribe('questionnaires');
}



QuestionnaireSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Questionnaire"
    },
  "identifier" : {
    type: [ Identifier ]
    },
  "version" : {
    type: String
    },
  "status" : {
    type: String
    },
  "date" : {
    type: Date
    },
  "publisher" : {
    type: String
    },
  "telecom" : {
    type: [ ContactPoint ]
    },
  "subjectType" : {
    type: [String]
    },
  "group" : {
    type: GroupSchema
    }
});
Questionnaires.attachSchema(QuestionnaireSchema);
