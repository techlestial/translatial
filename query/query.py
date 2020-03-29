from graphene import ObjectType

from .language import LanguageQuery
from .translatial import GoogleTranslateQuery

class Query(LanguageQuery,GoogleTranslateQuery, ObjectType):
    pass
