import json
import requests
import googletrans


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

    detected_language = googletrans.Translator().detect(s).lang
    if get_languages().get(detected_language) is not None:
        return True
    return False


def google_translate():
    translate = googletrans.Translator(service_urls=[
        "translate.google.com"
    ])
    return translate


def map_lang_code(code):
    from .jsonutils import encode_json, json2obj
    data = dict()
    if googletrans.LANGUAGES.get(code):
        data["name"] = googletrans.LANGUAGES[code]
        data["lang_code"] = code
        return json2obj(encode_json(data))
    return None
