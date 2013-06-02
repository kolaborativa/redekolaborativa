# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

#########################################################################
## This is a samples controller
## - index is the default action of any application
## - user is required for authentication and authorization
## - download is for downloading files uploaded in the db (does streaming)
## - call exposes all registered services (none by default)
#########################################################################


def index():
    return dict(form=auth.login())

def principal():
    return dict()

def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    """

    if 'register' in request.args:
        fields_to_hide = [
        'last_name', 'age', 'localization', 'bio', 'social_networking','availability']

        for fieldname in fields_to_hide:
            field = db.auth_user[fieldname]
            field.readable = field.writable = False

    elif 'login' in request.args:
        db.auth_user.username.label = T("Username or Email")
        auth.settings.login_userfield = 'username'
        if request.vars.username and not IS_EMAIL()(request.vars.username)[1]:
            auth.settings.login_userfield = 'email'
            request.vars.email = request.vars.username
            request.post_vars.email = request.vars.email
            request.vars.username = None
            request.post_vars.username = None

        return dict(form=auth.login())

    elif 'profile' in request.args:
        form=auth()
        professions = db(db.profession.user_id == auth.user.id).select()

        competencies = []
        if professions:
            for i in professions:
                this_competence = db(db.competence.profession_id == i.id).select()
                if this_competence:
                    competencies.append(this_competence)

        form_profession = SQLFORM.factory(
            db.profession,
            table_name='professions',
            submit_button=T('add')
            )
        form_competencies = SQLFORM.factory(
            Field("profession_id",label="profession_id"),
            db.competence,
            table_name='competencies',
            )

        # auth form
        if form.process().accepted:
            redirect(URL("user_info"))
        elif form.errors:
            response.session = 'form has errors'

        # professions form
        if form_profession.process().accepted:
            # id_professions = [i.id for i in professions]
            # if not request.vars.profession in id_professions:
            db.profession.insert(
                profession=request.vars.profession,
                user_id=auth.user.id
                )
            # else:
            #     db(db.profession.id == ).update(
            #         profession=request.vars.profession,
            #         )

            response.flash = 'form accepted'
            redirect(URL("user",args=["profile"]))
        elif form_profession.errors:
            response.flash = 'form has errors'

        # competencies form
        if form_competencies.process().accepted:
            db.competence.insert(
                competence=request.vars.competence,
                profession_id=request.vars.profession_id,
                )

            response.flash = 'form accepted'
            redirect(URL("user",args=["profile"]))
        elif form_competencies.errors:
            response.flash = 'form has errors'

        return dict(
            form=form,form_profession=form_profession,form_competencies=form_competencies,
            professions=professions,competencies=competencies)

    return dict(form=auth())


def user_info():
    message = T("User doesn't exist.")
    seach_user = request.args(0) or auth.user.username
    user = db.auth_user(username=seach_user) or message
    professions = db(db.profession.user_id == user.id).select()
    competencies = []
    if professions:
        for i in professions:
            this_competence = db(db.competence.profession_id == i.id).select()
            if this_competence:
                competencies.append(this_competence)
    last_project = my_projects = colaborate_projects = None

    if user != message:
        last_project = db(db.projects.project_owner == user).select(orderby='created_on').last()
        my_projects = db(db.projects.project_owner == user).select(orderby='created_on', limitby=(0,5))
        team = db(db.projects).select(orderby='created_on', limitby=(0,5))
        colaborate_projects = {}
        if team != None:
            for n,i in enumerate(team):
                if str(user.id) in i.team:
                    colaborate_projects[n] = i
    return dict(
            user=user, message=message, professions=professions, competencies=competencies,
            last_project=last_project, my_projects=my_projects, colaborate_projects=colaborate_projects)

def projects():
    message = T("Project not found.")
    project = db.projects(id=request.args(0)) or message
    team = db(db.projects).select()
    return dict(project=project, message=message)

@auth.requires_login()
def create_project():
    form = SQLFORM(db.projects)
    if form.process().accepted:
        session.flash = T('Project created!')
        db.auth_membership.insert()
        project_id = form.vars.id
        redirect(URL('projects', args=project_id))
    elif form.errors:
        response.flash = T('Form has errors!')
    return dict(form=form)

@auth.requires_login()
def manage_team():
    message = form = ''
    project = db(db.projects.id == request.args(0)).select(db.projects.id)
    if project:
        form = SQLFORM(db.team_function)
        if form.process().accepted:
            response.flash = T("User function defined.")
        elif form.errors:
            response.flash = T("Form has errors!")
    else:
        message = T("This project doesn't exist!")
    return dict(form=form, message=message)

def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


@auth.requires_signature()
def data():
    """
    http://..../[app]/default/data/tables
    http://..../[app]/default/data/create/[table]
    http://..../[app]/default/data/read/[table]/[id]
    http://..../[app]/default/data/update/[table]/[id]
    http://..../[app]/default/data/delete/[table]/[id]
    http://..../[app]/default/data/select/[table]
    http://..../[app]/default/data/search/[table]
    but URLs must be signed, i.e. linked with
      A('table',_href=URL('data/tables',user_signature=True))
    or with the signed load operator
      LOAD('default','data.load',args='tables',ajax=True,user_signature=True)
    """
    return dict(form=crud())
