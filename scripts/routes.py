#coding: utf-8

routes_app = ((r'/(?P<app>admin)\b.*', r'\g<app>'),
              (r'(.*)', r'kolaborativa'),
              (r'/?(.*)', r'kolaborativa'))