import { Request, Response } from 'express';
import { Endpoint, RequestType } from 'firebase-backend';
import axios from 'axios';
import * as projectConfig from '../../../config/config';

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

export default new Endpoint(
  'registerUser',
  RequestType.POST,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const key = req.headers['api-key'];
    if(!key) {
      const error = {
        message: 'Missing api-key header',
        description: 'api-key header is the required header for verifying your project with firebase APIs requests'
      }
      res.status(403).send(error);
    }
    try {
      const url = `${projectConfig.config.signUpWithEmailAndPassword}?key=${key}`;
      const body = {
        email,
        password,
        returnSecureToken: true,
      };
      const authRes = await axios.post(url, body);
      const id = authRes.data['localId'];
      await db.collection('users').doc(id).set({
        id,
        email,
      });
      res.send(authRes.data);
    } catch (e) {
      console.error(e);
      res.send(e);
    }
  }
);
