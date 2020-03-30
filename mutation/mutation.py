from graphene import ObjectType, String
from .translate import TranslateWords

class Mutation(ObjectType):
    translate_words = TranslateWords.Field()
    pass
