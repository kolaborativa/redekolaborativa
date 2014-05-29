# -*- coding: utf-8 -*-
import os
from gluon import current

## Authentication with Facebook

FACEBOOK_ID = ''
FACEBOOK_SECRET = ''

## Email settings
if not current.request.env.web2py_runtime_gae:
    EMAIL_SERVER =  'smtp.gmail.com:587' or 'logging'
else:
    EMAIL_SERVER =  'gae'

if not current.request.is_local:
    # ENV VARIABLES SETS IN OPENSHIFT AND GETUP
    kolaborativa_email = os.environ['KOLABORATIVA_EMAIL']
    kolaborativa_email_pass = os.environ['KOLABORATIVA_EMAIL_PASS']
    CLIENT_EMAIL = kolaborativa_email
    CLIENT_LOGIN = '{email}:{passwd}'.format(email=kolaborativa_email, passwd=kolaborativa_email_pass)
else:
    CLIENT_EMAIL = 'you@email.com'
    CLIENT_LOGIN = 'you_user:you_pass'
