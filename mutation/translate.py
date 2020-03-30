import json

from graphene import ObjectType, List, String, Mutation
from libs.utils.jsonutils import json2obj
from libs.utils.commonutils import _init_google_translate
from models.models import Translation


class TranslateWords(Mutation):
    class Arguments:
        content = String(required=True)
        target_languages = List(String,required=True)
    result = List(Translation)
    def mutate(self, info, content,target_languages, **kargs):
        translator = _init_google_translate()
        result_list = []
        for target in target_languages:
            response = translator.translate(content,dest=target)
            result_list.append(Translation(target_language=target,content=response.text,pronunciation=response.pronunciation if response.pronunciation else 'N.A'))
        return TranslateWords(result=result_list)