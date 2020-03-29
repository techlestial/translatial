import json
import requests


def get_languages():
    payload = requests.get(
        'https://translate.googleapis.com/translate_a/l?alpha=1&client=translate_about').json()
    languages = payload['tl']
    return languages
