# -*- coding: utf-8 -*-

#
# This scaffolding model makes your app work on Google App Engine too
# File is released under public domain and you can use without limitations
#

# if SSL/HTTPS is properly configured and you want all HTTP requests to
# be redirected to HTTPS, uncomment the line below:
# request.requires_https()

if not request.is_local :
    # OPENSHIFT AND/OR GETUP
    import os
    # ENV VARIABLES SETS IN OPENSHIFT AND GETUP
    user_db = os.environ['KOLABORATIVA_MYSQL_LOGIN']
    pass_db = os.environ['KOLABORATIVA_MYSQL_PASS']
    host_db = '{host}:{port}'.format(host=os.environ['OPENSHIFT_MYSQL_DB_HOST'], port = os.environ['OPENSHIFT_MYSQL_DB_PORT'])
    name_db = 'rede_kolaborativa'

    db = DAL('mysql://{user}:{pas}@{host}/{name}'.format(user=user_db, pas=pass_db, host=host_db, name=name_db))
else:
    # LOCAL
    db = DAL('sqlite://storage.sqlite', pool_size=1, check_reserved=['all'])

# store sessions and tickets there
session.connect(request, response, db=db)

# by default give a view/generic.extension to all actions from localhost
# none otherwise. a pattern can be 'controller/function.extension'
response.generic_patterns = ['*']
# (optional) optimize handling of static files
# response.optimize_css = 'concat,minify,inline'
# response.optimize_js = 'concat,minify,inline'

#
# Here is sample code if you need for
# - email capabilities
# - authentication (registration, login, logout, ... )
# - authorization (role based authorization)
# - services (xml, csv, json, xmlrpc, jsonrpc, amf, rss)
# - old style crud actions
# (more options discussed in gluon/tools.py)
#

from gluon.tools import Auth, Crud, Service, PluginManager, Mail
auth = Auth(db)
crud, service, plugins = Crud(db), Service(), PluginManager()

#import email's data
from data_config import EMAIL_SERVER, CLIENT_EMAIL, CLIENT_LOGIN

# configure mail
mail = auth.settings.mailer
mail.settings.server = EMAIL_SERVER
#the sender has to be an admin of the app on GAE
mail.settings.sender = CLIENT_EMAIL
mail.settings.login = CLIENT_LOGIN

# configure auth policy
auth.settings.registration_requires_verification = True
auth.settings.registration_requires_approval = False
auth.settings.reset_password_requires_verification = True
auth.messages.verify_email_subject = T("Rede Kolaborativa - Confirmação de cadastro")
auth.messages.verify_email = 'Olá %(username)s, \n\nVocê está a um clique de desenvolver projetos com os outros membros da Rede Kolaborativa! \nVocê será redirecionado à pagina da home, FAÇA SEU LOGIN normalmente para começar a acessar a Rede Kolaborativa. \n\nClique para confirmar seu cadastro: http://'+request.env.http_host+URL('default','user',args=['verify_email'])+'/%(key)s'

# if you need to use OpenID, Facebook, MySpace, Twitter, Linkedin, etc.
# register with janrain.com, write your domain:api_key in private/janrain.key
from gluon.contrib.login_methods.rpx_account import use_janrain
use_janrain(auth, filename='private/janrain.key')

# addctional auth settings
auth.settings.formstyle = "divs"
auth.messages.register_button = T("Kollaborate!")

# 'localization tables' necessary for the user table
db.define_table('country',
    Field('name', 'string'),
    Field('abbrev', 'string'),
    format='%(name)s'
)

db.define_table('states',
    Field('country_id', db.country),
    Field('name', 'string'),
    Field('abbrev', 'string'),
    format='%(name)s'
)

db.define_table('city',
    Field('states_id', db.states),
    Field('country_id', db.country),
    Field('name', 'string'),
    format='%(name)s'
)


# auth user extra fields
auth.settings.extra_fields["auth_user"] = [
    Field("born_on", "date", label='%s (%s)' %(T("Date of birth"),T("optional")) ),
    Field("country_id", db.country, label=T("Country")),
    Field("states_id", db.states, label=T("State")),
    Field("city_id", db.city, label=T("City")),
    Field("bio", "text"),
    Field("avatar", "upload"),
    Field("user_available", 'boolean', default=False),
    Field("availability", "list:string", widget=SQLFORM.widgets.checkboxes.widget, requires=IS_IN_SET( [
            (T('OpenSource'), T('OpenSource')),
            (T('Enterprising'), T('Enterprising')),
            (T('Others'), T('Others')),
        ], multiple=True), default="Others")
]

# create all tables needed by auth if not custom tables
auth.define_tables(username=True, signature=False)

# auth default attributes rename
db.auth_user.first_name.label = T("Name")
db.auth_user.last_name.label = T("Nickname")
db.auth_user.last_name.requires = IS_EMPTY_OR(IS_ALPHANUMERIC(error_message='Must be alphanumeric!'))

auth.settings.register_next= URL('message_register')
auth.settings.login_next = URL('panel')
auth.settings.logged_url = URL('user_info')
auth.settings.verify_email_next = URL('index')
auth.settings.login_url = URL('index')

#
# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable',Field('myfield','string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
# 'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.
#
# More API examples for controllers:
#
# >>> db.mytable.insert(myfield='value')
# >>> rows=db(db.mytable.myfield=='value').select(db.mytable.ALL)
# >>> for row in rows: print row.id, row.myfield
#

# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
