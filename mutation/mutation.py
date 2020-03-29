from graphene import ObjectType, String


class Mutation(ObjectType):
  translate_words = String()
  pass
