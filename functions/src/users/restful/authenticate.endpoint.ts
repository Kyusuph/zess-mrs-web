import { Request, Response } from 'express';
import { Endpoint, RequestType } from 'firebase-backend';
import axios from 'axios';
import * as projectConfig from '../../../config/config';

// var projectKey = 'AIzaSyALBA4HUgyBDz2enAm9_8HP6cViU7e3Upg';

export default new Endpoint(
  'authenticate',
  RequestType.POST,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const key = req.headers['apiKey'];
    try {
      const url = `${projectConfig.config.signInWithEmailAndPassword}?key=${key}`;
      const body = {
        email,
        password,
        returnSecureToken: true,
      };
      const authRes = await axios.post(url, body);
      res.send(authRes.data);
    } catch (e) {
      console.error(e);
      res.send(e);
    }
  }
);
