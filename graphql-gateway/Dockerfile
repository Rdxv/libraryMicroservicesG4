## STAGE 1: Setup base python environment

FROM python:3-slim as python
ENV PYTHONUNBUFFERED=true
WORKDIR /app



## STAGE 2: Install Poetry and project dependencies (Poetry and its dependecies are not carried to the next stage)

FROM python as poetry
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV POETRY_VIRTUALENVS_OPTIONS_NO_PIP=true
ENV POETRY_VIRTUALENVS_OPTIONS_NO_SETUPTOOLS=true
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN python -c 'from urllib.request import urlopen; print(urlopen("https://install.python-poetry.org").read().decode())' | python -
COPY . ./
RUN poetry install --no-interaction --no-ansi --no-root -vvv



## STAGE 3: Copy project files and dependecies and start app

FROM python as runtime
ENV PATH="/app/.venv/bin:$PATH"
COPY --from=poetry /app /app
EXPOSE 8000
CMD ["python", "app.py"]