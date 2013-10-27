# -*- coding: utf-8 -*-

## Authentication with Facebook

FACEBOOK_ID = ''
FACEBOOK_SECRET = ''

## Email settings
from gluon import current
if not current.request.env.web2py_runtime_gae:
    EMAIL_SERVER =  'smtp.gmail.com:587' or 'logging'
else:
    EMAIL_SERVER =  'gae'

CLIENT_EMAIL = 'you@email.com'
CLIENT_LOGIN = 'your_user:your_pass'
