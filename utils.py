import json
import requests

from collections import namedtuple


def _json_object_hook(d):
    return namedtuple('X', d.keys())(*d.values())


def json2obj(data):
    return json.loads(data, object_hook=_json_object_hook)


def get_languages():
    payload = requests.get('https://translate.googleapis.com/translate_a/l?alpha=1&client=translate_about').json()
    languages = payload['tl']
    return languages