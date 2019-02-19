import { get } from 'lodash';

Meteor.methods({
    'Questionnaire/initialize': function(){
        console.log('Questionnaire/initialize')
        var newQuestionnaire = {
            "resourceType": "Questionnaire",
            "id": "3141",
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n      <pre>\n            1.Comorbidity?\n              1.1 Cardial Comorbidity\n                1.1.1 Angina?\n                1.1.2 MI?\n              1.2 Vascular Comorbidity?\n              ...\n            Histopathology\n              Abdominal\n                pT category?\n              ...\n          </pre>\n    </div>"
            },
            "url": "http://hl7.org/fhir/Questionnaire/3141",
            "title": "Cancer Quality Forum Questionnaire 2012",
            "status": "draft",
            "subjectType": [
              "Patient"
            ],
            "date": "2012-01",
            "item": [
              {
                "linkId": "1",
                "code": [
                  {
                    "system": "http://example.org/system/code/sections",
                    "code": "COMORBIDITY"
                  }
                ],
                "type": "group",
                "item": [
                  {
                    "linkId": "1.1",
                    "code": [
                      {
                        "system": "http://example.org/system/code/questions",
                        "code": "COMORB"
                      }
                    ],
                    "prefix": "1",
                    "type": "choice",
                    "answerValueSet": "http://hl7.org/fhir/ValueSet/yesnodontknow",
                    "item": [
                      {
                        "linkId": "1.1.1",
                        "code": [
                          {
                            "system": "http://example.org/system/code/sections",
                            "code": "CARDIAL"
                          }
                        ],
                        "type": "group",
                        "enableWhen": [
                          {
                            "question": "1.1",
                            "operator": "=",
                            "answerCoding": {
                              "system": "http://terminology.hl7.org/CodeSystem/v2-0136",
                              "code": "Y"
                            }
                          }
                        ],
                        "item": [
                          {
                            "linkId": "1.1.1.1",
                            "code": [
                              {
                                "system": "http://example.org/system/code/questions",
                                "code": "COMORBCAR"
                              }
                            ],
                            "prefix": "1.1",
                            "type": "choice",
                            "answerValueSet": "http://hl7.org/fhir/ValueSet/yesnodontknow",
                            "item": [
                              {
                                "linkId": "1.1.1.1.1",
                                "code": [
                                  {
                                    "system": "http://example.org/system/code/questions",
                                    "code": "COMCAR00",
                                    "display": "Angina Pectoris"
                                  },
                                  {
                                    "system": "http://snomed.info/sct",
                                    "code": "194828000",
                                    "display": "Angina (disorder)"
                                  }
                                ],
                                "prefix": "1.1.1",
                                "type": "choice",
                                "answerValueSet": "http://hl7.org/fhir/ValueSet/yesnodontknow"
                              },
                              {
                                "linkId": "1.1.1.1.2",
                                "code": [
                                  {
                                    "system": "http://snomed.info/sct",
                                    "code": "22298006",
                                    "display": "Myocardial infarction (disorder)"
                                  }
                                ],
                                "prefix": "1.1.2",
                                "type": "choice",
                                "answerValueSet": "http://hl7.org/fhir/ValueSet/yesnodontknow"
                              }
                            ]
                          },
                          {
                            "linkId": "1.1.1.2",
                            "code": [
                              {
                                "system": "http://example.org/system/code/questions",
                                "code": "COMORBVAS"
                              }
                            ],
                            "prefix": "1.2",
                            "type": "choice",
                            "answerValueSet": "http://hl7.org/fhir/ValueSet/yesnodontknow"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "linkId": "2",
                "code": [
                  {
                    "system": "http://example.org/system/code/sections",
                    "code": "HISTOPATHOLOGY"
                  }
                ],
                "type": "group",
                "item": [
                  {
                    "linkId": "2.1",
                    "code": [
                      {
                        "system": "http://example.org/system/code/sections",
                        "code": "ABDOMINAL"
                      }
                    ],
                    "type": "group",
                    "item": [
                      {
                        "linkId": "2.1.2",
                        "code": [
                          {
                            "system": "http://example.org/system/code/questions",
                            "code": "STADPT",
                            "display": "pT category"
                          }
                        ],
                        "type": "choice"
                      }
                    ]
                  }
                ]
              }
            ]
          };
        Meteor.call('Questionnaire/create', newQuestionnaire)
    }, 
    'Questionnaire/create': function(newQuestionnaire){
        console.log('Questionnaire/create', newQuestionnaire);
        check(newQuestionnaire, Object);
        Questionnaires.insert(newQuestionnaire, {validate: false, filter: false}, function(error, result){
          if(error) console.log(error);

        });
    }, 
    'Questionnaire/drop': function(){
        console.log('Questionnaire/drop')
        Questionnaires.remove({});
    }
})