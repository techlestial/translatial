from graphene import ObjectType

from .language import LanguageQuery

class Query(LanguageQuery, ObjectType):
    pass
