from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from notifications.models import Notification
from notifications.utils import LazyNotificationEncoder
from private_chat.utils import find_or_create_private_chat

from django.contrib.contenttypes.models import ContentType


# Create your models here.
class BuddyList(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user")
    buddies = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="buddies")

    notifications = GenericRelation(Notification)

    def __str__(self):
        return self.user.username

    # addinga  new friend here
    def addFriend(self, account):

        # Adding a new friend here
        if not account in self.buddies.all():
            self.buddies.add(account)
            self.save()

            content_type = ContentType.objects.get_for_model(self)

            # Notification created right away
            Notification(target=self.user,
                         from_user=account,

                         redirect_url=f"{settings.BASE_URL}/account/{account.pk}/",
                         verb=f"You are now friends with {account.username}.",

                         content_type=content_type,
                         object_id=self.id,
                         ).save()

            # The second method

            # self.notifications.create(
            # 	target=self.user,
            # 	from_user=account,
            # 	redirect_url=f"{settings.BASE_URL}/account/{account.pk}/",
            # 	verb=f"You are now friends with {account.username}.",
            # 	content_type=content_type,
            # )
            # self.save()
            # Create a private chat (or activate an old one)
            chat = find_or_create_private_chat(self.user, account)
            if not chat.is_active:
                chat.is_active = True
                chat.save()

    def removeFriend(self, account):
        if account in self.buddies.all():
            self.buddies.remove(account)

            # Deactivate the private chat between these two users
            chat = find_or_create_private_chat(self.user, account)
            if chat.is_active:
                chat.is_active = False
                chat.save()

    # Notification also created here
    def unfriend(self, removee):

        # 2 people: remover and removee
        # Need to remove the friend list from person starting the buddieship

        # Person terminating the friendship
        removerFriendsList = self

        print(removerFriendsList)
        print(self.user)
        # 2nd part: remove friend from remover friend list
        removerFriendsList.removeFriend(removee)

        # There was a bug here
        # remove friend from removee friend list
        removee_friend_list = BuddyList.objects.get(user=removee)
        print(removee_friend_list)
        removee_friend_list.removeFriend(self.user)
        print

        content_type = ContentType.objects.get_for_model(self)

        # Another notification created for removee
        # Create notification for removee
        removee_friend_list.notifications.create(
            target=removee,
            from_user=self.user,
            redirect_url=f"{settings.BASE_URL}/account/{self.user.pk}/",
            verb=f"You are no longer friends with {self.user.username}.",
            content_type=content_type,
        )

        # Create notification for remover
        self.notifications.create(
            target=self.user,
            from_user=removee,
            redirect_url=f"{settings.BASE_URL}/account/{removee.pk}/",
            verb=f"You are no longer friends with {removee.username}.",
            content_type=content_type,
        )

    @property
    def get_cname(self):
        return "FriendList"

    # Check if this friend is in the friend List of the function
    def is_mutual_friend(self, friend):
        if friend in self.buddies.all():
            return True
        return False


class FriendRequest(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="receiver")

    # This is used to check if the request is active or not
    is_active = models.BooleanField(blank=False, null=False, default=True)

    timestamp = models.DateTimeField(auto_now_add=True)
    notifications = GenericRelation(Notification)

    def __str__(self):
        return self.sender.username

    # Need to update both the sender and receiver friends list when friend request is sent
    # Self refers to the calling instance:
    # in this case the request instance

    # When friend request accepted, update both sender and receiver friend lists

    def accept(self):
        receiverFriendList = BuddyList.objects.get(user=self.receiver)

        # Update the notification for receiver
        if receiverFriendList:
            content_type = ContentType.objects.get_for_model(self)

            # Update notification for RECEIVER
            receiver_notification = Notification.objects.get(target=self.receiver, content_type=content_type,
                                                             object_id=self.id)
            receiver_notification.is_active = False
            receiver_notification.redirect_url = f"{settings.BASE_URL}/account/{self.sender.pk}/"
            receiver_notification.verb = f"You accepted {self.sender.username}'s friend request."

            receiver_notification.read = True
            receiver_notification.timestamp = timezone.now()
            receiver_notification.save()

            receiverFriendList.addFriend(self.sender)
            senderFriendList = BuddyList.objects.get(user=self.sender)

            if senderFriendList:
                senderFriendList.addFriend(self.receiver)

                # Make sure the sender is notified as well
                self.notifications.create(
                    target=self.sender,
                    from_user=self.receiver,

                    redirect_url=f"{settings.BASE_URL}/account/{self.receiver.pk}/",
                    verb=f"{self.receiver.username} accepted your friend request.",
                    content_type=content_type,
					read = False
                )
                self.is_active = False
                self.save()
            return receiver_notification  # we will need this later to update the realtime notifications

    def decline(self):
        """
		Decline a friend request.
		Is it "declined" by setting the `is_active` field to False
		"""
        self.is_active = False
        self.save()

        content_type = ContentType.objects.get_for_model(self)

        # Update notification for receiver
        receiver_notification = Notification.objects.get(target=self.receiver,
                                                         content_type=content_type,
                                                         object_id=self.id)
        receiver_notification.is_active = False

        receiver_notification.verb = f"You declined {self.sender}'s friend request"

        receiver_notification.from_user = self.sender
        receiver_notification.timestamp = timezone.now()
        receiver_notification.save()

        # Create notification for sender
        # Create notification for SENDER
        self.notifications.create(
            target=self.sender,
            verb=f"{self.receiver.username} declined your friend request.",
            from_user=self.receiver,
            redirect_url=f"{settings.BASE_URL}/account/{self.receiver.pk}/",
            content_type=content_type,
        )
        return receiver_notification

    def cancel(self):
        self.is_active = False
        self.save()
        content_type = ContentType.objects.get_for_model(self)

        # Create notification for SENDER
        self.notifications.create(
			target=self.sender,
			verb=f"You cancelled the friend request to {self.receiver.username}.",
			from_user=self.receiver,
			redirect_url=f"{settings.BASE_URL}/account/{self.receiver.pk}/",
			content_type=content_type,
		)
        notification = Notification.objects.get(target=self.receiver, content_type=content_type, object_id=self.id)
        notification.verb = f"{self.sender.username} cancelled the friend request sent to you."
        notification.timestamp = timezone.now()
        notification.read = False
        notification.save()

    @property
    def get_cname(self):
        """
        For determining what kind of object is associated with a Notification
        """

        return "FriendRequest"


# When friend request is sent, so does notification will happen here

@receiver(post_save, sender=FriendRequest)
# Instnace= the friend request here
def create_notification(sender, instance, created, **kwargs):
    if created:
        print("notification created")
        instance.notifications.create(
            target=instance.receiver,
            from_user=instance.sender,

            redirect_url=f"{settings.BASE_URL}/account/{instance.sender.pk}/",
            verb=f"{instance.sender.username} sent you a friend request.",
            content_type=instance,

        )
