import json

from graphene import ObjectType, List, String
from .constants import GoogleTranslate
from .utils import json2obj


def _init_google_translate():
    from googletrans import Translator
    translate = Translator(service_urls=[
        "translate.google.com"
    ])
    return translate


class GoogleTranslateQuery(ObjectType):
    google_translate = List(GoogleTranslate, content=String(
        required=True), target_language_code=String(required=True), source_language_code=String(default_value="en"))

    def resolve_google_translation(self, info, content, dest_lan, src_lan):
        translator = _init_google_translate()
        response = translator.translate(content, dest=dest_lan, src=src_lan)[
            "google_translate"]
        return json2obj(json.dumps(response))
