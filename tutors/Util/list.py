# from collections import dict_items

# Basic list consturcting
data = {}
data['message']= "failed"


thislist = ["apple", "banana", "cherry"]
print(thislist)

# HERE we will have a list of sample functions and examples that we can reuse
thisdict = {
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}
print(thisdict["brand"])

#Iterate thru dictionary
a_dict = {'color': 'blue', 'fruit': 'apple', 'pet': 'dog'}
d_items = a_dict.items()

d_items  # Here d_items is a view of items
dict_items([('color', 'blue'), ('fruit', 'apple'), ('pet', 'dog')])