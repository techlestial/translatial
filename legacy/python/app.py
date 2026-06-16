# Imports
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_graphql import GraphQLView
from info import apiInfo

# app init
app = Flask(__name__)
app.debug = True
CORS(app)

@app.route('/')
def index():
    return jsonify(info=apiInfo)


if __name__ == '__main__':
    app.run()

# Import Schema and create DB
from schema.schema import schema

# Graphql init
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True
    )
)
