import * as k8s from '@kubernetes/client-node';
import * as request from 'request';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts: request.OptionsWithUrl = {url: "replace"}
kc.applyToRequest(opts);

export default (req, res) => {
    const {
        query: { group, version, kind },
    } = req

    const path = `/apis/${group}/${version}/namespaces//${kind}`
    request.get(`${kc.getCurrentCluster().server}${path}`, opts,
    (error, response, body) => {
        if (error) {
            res.status(503).json(body)
        }
        res.status(200).json(body)
  })
}