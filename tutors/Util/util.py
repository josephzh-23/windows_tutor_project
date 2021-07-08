from friend.models import BuddyList


def turn_QuerySet_to_Json(querySet):


    jsonData = []
    for set in querySet:
        jsonData.append(set)
        
    return jsonData