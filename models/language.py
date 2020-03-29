from graphene import ObjectType,String

class Language(ObjectType):
  name = String()
  lang_code = String()
