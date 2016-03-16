
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
    type: [ IdentifierSchema ]
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
    type: [ ContactPointSchema ]
    },
  "subjectType" : {
    type: [ String ]
    },
  "group" : {
    type: GroupSchema
    }
});
Questionnaires.attachSchema(QuestionnaireSchema);
