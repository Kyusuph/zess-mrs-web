import * as functions from 'firebase-functions';

exports.onCaseCreated = functions.firestore
  .document('cases/{caseId}')
  .onCreate(async (snapshot) => {
    console.log(`Case created id ${snapshot.id}`);
  });
