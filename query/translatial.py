import json

from graphene import ObjectType, List, String
from models.query import GoogleTranslate
from libs.utils.jsonutils import json2obj


def _init_google_translate():
    from googletrans import Translator
    translate = Translator(service_urls=[
        "translate.google.com"
    ])
    return translate


class GoogleTranslateQuery(ObjectType):
    google_translate = List(GoogleTranslate, content=String(
        required=True), target_language_code=String(required=True), source_language_code=String(default_value="en"))

    def resolve_google_translate(self, content, target_language_code, source_language_code):
        translator = _init_google_translate()
        response = translator.translate(content, dest=target_language_code, src=source_language_code)[
            "google_translate"]
        return json2obj(json.dumps(response))
