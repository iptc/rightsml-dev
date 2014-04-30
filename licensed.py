#!/usr/bin/python

class mklicense:

	def __init__(self,target, assigner, assignee):
		self.target = target
		self.assigner = assigner
		self.assignee = assignee

	def simpleGeographic(self, geography):
		return simpleGeographic(target=self.target, assigner=self.assigner, assignee=self.assignee, geography=geography)

class simpleGeographic:

	def __init__(self,target, assigner, assignee, geography):
		self.target = target
		self.assigner = assigner
		self.assignee = assignee
		self.geography = geography
	
	def xml(self):
		return self.geography
