import json
import requests


def get_languages():
    payload = requests.get(
        'https://translate.googleapis.com/translate_a/l?alpha=1&client=translate_about').json()
    languages = payload['tl']
    return languages


def is_language_valid(s):
    """
    :input: s(string)
    :description: To check whether the input data is valid language or not
    :rtype: bool
    """

    if (type(s) is not str):
        return

    from googletrans import Translator
    detected_language = Translator().detect(s).lang
    if get_languages().get(detected_language) is not None:
        return True
    return False
