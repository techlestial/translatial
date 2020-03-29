from graphene import ObjectType


from .translatial import GoogleTranslateQuery

class Query(GoogleTranslateQuery, ObjectType):
    pass
