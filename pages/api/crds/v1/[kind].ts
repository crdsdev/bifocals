import * as k8s from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as request from 'request';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts: request.OptionsWithUrl = { url: 'replace' };
kc.applyToRequest(opts);

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {
    query: { group, version, kind },
  } = req;
  const path = `/apis/${group}/${version}/namespaces//${kind}`;

  return new Promise(resolve => {
    request.get(`${kc.getCurrentCluster().server}${path}`, opts, (error, _response, body) => {
      res.status(error ? 503 : 200).json(body);
      resolve();
    });
  });
};
