from graphene import ObjectType, String, Field


class Language(ObjectType):
    name = String()
    lang_code = String()

class Translation(ObjectType):
    target_language = Field(Language)
    content = String()
    pronunciation = String()
