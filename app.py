import click
import logging
import sys

from util import db_connect
from cache_software import cache_software
from corporate import sync_projects
from github import sync_all as github_sync_all
from releases import sync_releases
from zotero import zotero_sync
from oaipmh import list_records


class MaxLevel(object):
    def __init__(self, level):
        self.__level = level

    def filter(self, log_record):
        return log_record.levelno <= self.__level


log_formatter = logging.Formatter('%(asctime)s %(name)s [%(levelname)s] %(message)s')
stdout_handler = logging.StreamHandler(stream=sys.stdout)
stdout_handler.addFilter(MaxLevel(logging.WARNING))
stdout_handler.setFormatter(log_formatter)

stderr_handler = logging.StreamHandler()
stderr_handler.setLevel(logging.ERROR)
stderr_handler.setFormatter(log_formatter)

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(stdout_handler)
logger.addHandler(stderr_handler)

choices = click.Choice(['github', 'zotero', 'projects', 'releases', 'cache_software', 'oai-pmh', 'all'])

@click.command()
@click.option('--task', required=1, help='Which task to run.', type=choices)
def run_task(task):
    db = db_connect()
    if task == 'github':
        github_sync_all()
    elif task == 'zotero':
        zotero_sync()
    elif task == 'projects':
        sync_projects()
    elif task == 'releases':
        sync_releases(db)
    elif task == 'oai-pmh':
        list_records()
    elif task == 'cache_software':
        cache_software()
    elif task == 'all':
        github_sync_all()
        sync_releases(db)
        zotero_sync()
        sync_projects()
        list_records()
        cache_software()
    else:
        raise Exception('No such task: ' + task)


if __name__ == '__main__':
    run_task()
