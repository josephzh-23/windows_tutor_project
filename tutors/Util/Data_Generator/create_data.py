import datetime
import random
from django.core.management.base import BaseCommand

from accounts.models import Account

courses = [
    'Math101',
    'Math105',
    'English101',
    'Science102'
]

tutor_names = [
    'John', 'Michael', 'Luke', 'Sally', 'Joe', 'Dude', 'Guy', 'Barbara'
]


def generate_tutor_name():
    index = random.randint(0, 7)
    return tutor_names[index]


def generate_course_name():
    index = random.randint(0, 4)
    return courses[index]


def generate_hourly_rate():
    return random.randint(0, 100)


def generate_is_available():
    val = random.randint(0, 1)
    if val == 0:
        return False
    return True


def generate_publish_date():
    year = random.randint(2000, 2030)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return datetime.date(year, month, day)


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            'file_name', type=str, help='The txt file that contains the tutor data titles.')

    def handle(self, *args, **kwargs):
        file_name = kwargs['file_name']
        with open(f'{file_name}.txt') as file:
            for row in file:
                title = row
                tutor_name = generate_tutor_name()
                course_name = generate_course_name()
                posted_data = generate_publish_date()
                hourly_rate = generate_hourly_rate()
                is_avaliable = generate_is_available()


                author = Account.objects.get_or_create(
                    username=tutor_name
                )

                journal = Journal(
                    title=title,
                    author=Author.objects.get(name=tutor_name),
                    publish_date=posted_data,
                    views=hourly_rate,
                    reviewed=is_avaliable
                )

                journal.save()

                category = Category.objects.get_or_create(name=course_name)

                journal.courses.add(
                    Category.objects.get(name=course_name))

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))