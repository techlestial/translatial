FROM python
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD python server.py