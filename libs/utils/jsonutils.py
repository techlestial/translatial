import json
import six


def json2obj(data):
    def _json_object_hook(d):
        from collections import namedtuple
        return namedtuple('X', d.keys())(*d.values())
    return json.loads(data, object_hook=_json_object_hook)


def decode_json(s, **kwargs):
    if isinstance(s, six.binary_type):
        s = s.decode("utf-8")
    return json.loads(s, **kwargs)


def encode_json(s, **kwargs):
    if isinstance(s, six.text_type):
        s = s.encode()
    return json.dumps(s, **kwargs)
