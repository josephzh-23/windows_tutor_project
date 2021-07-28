import datetime
import random
from django.core.management.base import BaseCommand

from accounts.models import Account, Subject, Posting

# case 1
# This file has to be run from under the
# maangement/command directory here not anywhere else

# 2. Need to include the 'tutors' in installed_app
# This file is used to craete some dummy data and insert into the database
courses = [
    'Math101',
    'Math105',
    'English101',
    'Science102',
    'CoolMath102'
]

# Generate the random emails here
domains = ["hotmail.com", "gmail.com", "aol.com", "mail.com", "mail.kz", "yahoo.com"]
letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"]


def get_one_random_domain(domains):
    return domains[random.randint(0, len(domains) - 1)]


# This would take a bunch of letters and loop and add
# UP to length 7 as discussed
def get_one_random_name(letters):
    name = ""
    for i in range(7):
        name = name + letters[random.randint(0, 11)]
    return name


def generate_random_emails():
    # for i in range(0, 20):
    #     one_name = str(get_one_random_name(letters))
    #     one_domain = str(get_one_random_domain(domains))
    #     email = one_name + "@" + one_domain
    one_name = str(get_one_random_name(letters))
    one_domain = str(get_one_random_domain(domains))
    email = one_name + "@" + one_domain
    return email


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

    # Build the file here
    def handle(self, *args, **kwargs):
        file_name = kwargs['file_name']

        # With each row in the file
        with open(f'{file_name}.txt') as file:
            for row in file:
                title = row
                # tutor_name = generate_tutor_name()

                tutor_name = get_one_random_name(letters)
                course_name = generate_course_name()
                posted_data = generate_publish_date()
                hourly_rate = generate_hourly_rate()
                is_avaliable = generate_is_available()

                rand_email = generate_random_emails()
                print('email is with username ', rand_email, tutor_name)

                # Make sure if author is not found here
                # Then create an user with a password, email and username

                try:
                    author = Account.objects.get(
                        username=tutor_name
                    )
                    return author
                except Account.DoesNotExist:
                    Account.objects.create_user(rand_email,
                                                tutor_name,
                                                "931108"
                                                )


                posting = Posting(
                    title=title,
                    author=Account.objects.get(username=tutor_name),
                    publish_date=posted_data,
                    price_per_hour=hourly_rate,
                    reviewed=is_avaliable
                )
                print('the posting is ', posting)
                posting.save()

                subject = Subject.objects.get_or_create(name=course_name)

                posting.subject.add(
                    Subject.objects.get(name=course_name))

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))