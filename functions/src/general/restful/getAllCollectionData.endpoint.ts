import { Request, Response } from 'express';
import { Endpoint, RequestType } from 'firebase-backend';
import * as admin from 'firebase-admin';


const db = admin.firestore();

export default new Endpoint(
  'getAllCollectionData',
  RequestType.GET,
  async (req: Request, res: Response) => {
    const collection: any = req.headers['collection'];
    if (!collection) {
      const error = {
        message: 'Missing collection header',
        description:
          'Collection header field is required for completing this request, use other functions instead.'
      };
      res.status(403).send(error);
    }
    try {
      const snapshot = await db.collection(collection).get();
      const data: any[] = [];
      snapshot.docs.forEach((doc: any) => {
        const singleData = doc.data();
        data.push(singleData);
      });
      res.send(data);
    } catch (e) {
      console.error(e);
      res.send(e);
    }
  }
);
