from setuptools import setup, find_packages

setup(
    name="translatial",
    description="Wrapper to use Google Translate as GraphQL",
    author="Techlestial Group(Kevin Moe Myint Myat,Pyae Hlian Moe)",
    author_email="techlestial@gmail.com,mmm.myintmyat@gmail.com,pyae.phm@gmail.com",
    packages=find_packages(),
    install_requires=[
        "googletrans",
        "graphene",
        "flask",
        "flask_cors",
        "flask_graphql",
        "requests"
    ]
)
