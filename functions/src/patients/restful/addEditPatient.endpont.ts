import { Request, Response } from 'express';
import {Endpoint, RequestType} from 'firebase-backend';

export default new Endpoint(
  'addEditPatient',
  RequestType.POST,
  (req: Request, res: Response) => {
    // TODO Creating/Editing a patient
    res.status(201).send('Creating/Editing a patient');
  }
);
