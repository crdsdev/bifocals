import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.ApiextensionsV1beta1Api);

export default (req, res) => {
    k8sApi.listCustomResourceDefinition().then((ret) => {
        res.status(200).json(ret)
    });
}