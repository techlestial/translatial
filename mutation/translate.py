import json

from graphene import ObjectType, List, String, Mutation
from libs.utils.jsonutils import json2obj
from libs.utils.commonutils import _init_google_translate


class TranslateWords(Mutation):
    class Arguments:
        content = String(required=True)
        target_languages = List(String,required=True)
        source_language = String()
    result = String()
    def mutate(self, info, content,target_languages, **kargs):
        translator = _init_google_translate()
        response = translator.translate(content,dest=target_languages[0])
        print(response)
        return TranslateWords(result=response.text)