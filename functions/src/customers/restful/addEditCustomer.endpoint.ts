import {Request, Response } from 'express';
import {Endpoint, RequestType} from 'firebase-backend';

export default new Endpoint(
  'addEditCustomer',
  RequestType.POST,
  (req: Request, res: Response) => {
    // TODO Creating/Editing a customer
    res.status(201).send('Creating/Editing a customer');
  }
);

