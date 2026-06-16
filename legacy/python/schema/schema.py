# Imports
from graphene import Schema
from query.query import Query
from mutation.mutation import Mutation

schema = Schema(query=Query, mutation=Mutation)