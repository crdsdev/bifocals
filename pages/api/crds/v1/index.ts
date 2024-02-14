import * as k8s from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.ApiextensionsV1Api);

export default async (_req: NextApiRequest, res: NextApiResponse): Promise<void> =>
  new Promise(resolve => {
    k8sApi
      .listCustomResourceDefinition()
      .then(ret => {
        res.status(200).json(ret);
        resolve();
      })
      .catch(err => {
        res.json(err);
        res.status(405).end();
        return resolve();
      });
  });
