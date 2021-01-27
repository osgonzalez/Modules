from random import randrange
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))

def line_appender(file_path, target):
	file = open(dir_path + "\\" + file_path, "r")
	splitfile = file.read().splitlines()
	for line in splitfile:
		target.append(line)

def name_selector(target_list):
	selected = target_list[randrange(len(target_list))]
	return selected

def name_builder(first_name_list_path, last_name_list_path):
	first_name_list = []
	last_name_list = []

	line_appender(first_name_list_path, first_name_list)
	line_appender(last_name_list_path, last_name_list)

	first_name_selected = name_selector(first_name_list)
	last_name_selected = name_selector(last_name_list)

	name = first_name_selected+" "+last_name_selected
	return name


def generateNames(num):

	toRet = []

	for i in range(num) :
		if randrange(0,i+1)%2==0 :
			toRet.append(name_builder("first_name_male.txt", "last_name.txt"))
		else:
			 toRet.append(name_builder("first_name_female.txt", "last_name.txt"))


	return toRet


