import json


def json2obj(data):
    def _json_object_hook(d):
        from collections import namedtuple
        return namedtuple('X', d.keys())(*d.values())
    return json.loads(data, object_hook=_json_object_hook)


def decode_json(s, **kwargs):
    return json.loads(s, **kwargs)


def encode_json(s, **kwargs):
    return json.dumps(s, **kwargs)
