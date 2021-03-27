import { Request, Response } from 'express';
import { Endpoint, RequestType } from 'firebase-backend';
import * as admin from 'firebase-admin';


admin.initializeApp();

const db = admin.firestore();

export default new Endpoint(
  'getCasePerUser',
  RequestType.GET,
  async (req: Request, res: Response) => {
    const id = req.headers['user-id'];
    if(!id) {
      const error = {
        message: 'Missing user-id header',
        description: 'user-id header is the required for completing this request, use other functions instead.'
      }
      res.status(403).send(error);
    }
    try {
      const snapshot = await db.collection('cases').where('userId', '==', id).get();
      const cases: any[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        cases.push(data);
      })
      res.send(cases);
    } catch (e) {
      console.error(e);
      res.send(e);
    }
  }
);
