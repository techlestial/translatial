# Translatial ㊗️

This is a Translation-As-A-Service (TAAS) GraphQL backend API server for translating multiple languages at one time.

https://translatial.m3yevn.endpoint.ainize.ai/graphql

[![Run on Ainize](https://ainize.ai/static/images/run_on_ainize_button.svg)](https://translatial.m3yevn.endpoint.ainize.ai/graphql)


### Tech Stacks 📚

 - Python 🐍
 - Flask 🍶
 - Graphene graphql
 - Google Translate

### Setting up ⚙️

Assumed you have python and virtualenv installed

  - virtualenv venv
  - source venv/bin/activate
  - pip install . (using setup.py)
  - export FLASK_DEBUG=True (for debugging)
  - flask run

### Serving Production 🍹

Production server is served using Waitress
by

``
$ waitress-serve --port 5000 app:app
``

### Happy Coding!