#coding: utf-8

default_application = 'redekolaborativa'    # ordinarily set in base routes.py
default_controller = 'default'  # ordinarily set in app-specific routes.py
default_function = 'index'      # ordinarily set in app-specific routes.py


BASE = ''
routes_in = (
    (BASE + '/index', BASE + '/redekolaborativa/default/index'),
    (BASE + '/principal', BASE + '/redekolaborativa/default/principal'),
    (BASE + '/user/$anything', BASE + '/redekolaborativa/default/user/$anything'),
    (BASE + '/user_info/$anything', BASE + '/redekolaborativa/default/user_info/$anything'),
    (BASE + '/projects/$anything', BASE + '/redekolaborativa/default/projects/$anything'),
    (BASE + '/create_project', BASE + '/redekolaborativa/default/create_project'),
    (BASE + '/edit_project/$anything', BASE + '/redekolaborativa/default/edit_project/$anything'),
    (BASE + '/download/$anything', BASE + '/redekolaborativa/default/download/$anything'),
    (BASE + '/call/$anything', BASE + '/redekolaborativa/default/call$anything'),
    (BASE + '/call/json/$anything', BASE + '/redekolaborativa/default/call/json/$anything'),
    (BASE + '/data/$anything', BASE + '/redekolaborativa/default/data/$anything'),
    (BASE + '/search', BASE + '/redekolaborativa/default/search.load'),
    (BASE + '/results', BASE + '/redekolaborativa/default/results'),
    (BASE + '/$username', BASE + '/redekolaborativa/default/user_info/$username'),
    (BASE + '/landing', BASE + '/redekolaborativa/default/landing'),
    )

routes_out = [(x, y) for (y, x) in routes_in]
