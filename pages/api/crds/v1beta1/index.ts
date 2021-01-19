import * as k8s from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.ApiextensionsV1beta1Api);

export default (_req: NextApiRequest, res: NextApiResponse): void => {
  k8sApi.listCustomResourceDefinition().then((ret) => {
    res.status(200).json(ret);
  });
};