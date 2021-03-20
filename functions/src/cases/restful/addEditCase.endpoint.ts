import { Request, Response } from 'express';
import { Endpoint, RequestType } from 'firebase-backend';

export default new Endpoint(
  'addEditCase',
  RequestType.POST,
  (req: Request, res: Response) => {
    // TODO Creating/Editing a case logic
    res.status(201).send('Creating/Editing a case');
  }
);
