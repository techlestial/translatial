from graphene import ObjectType, List, String
from models.language import Language
from utils import get_languages

class LanguageQuery(ObjectType):
  languages = List(Language)

  def resolve_languages(parent, info, **kargs):
    languages = get_languages()
    language_list = []
    for key in languages.keys():
      language_list.append(Language(name=languages[key],lang_code=key))
    return language_list