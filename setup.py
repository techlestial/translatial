from setuptools import setup, find_packages

setup(
    name="gwrapper",
    description="Wrapper to use Google Translate as GraphQL",
    author="Pyae Hlian Moe",
    author_email="pyae.phm@gmail.com",
    packages=find_packages(),
    install_requires=[
        "googletrans",
        "graphene"
    ]
)
