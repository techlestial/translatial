from graphene import ObjectType, String


class GoogleTranslate(ObjectType):
    content = String()
    source_language_code = String()
    target_language_code = String()
