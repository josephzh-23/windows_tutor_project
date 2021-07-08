# Generated by Django 3.2 on 2021-04-30 04:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('listings', '0004_alter_listing_tutor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='tutor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]