def g_return_if_empty(value):
    if value:
        return value
    else:
        return T("Undefined")
        												
def is_url(url):
    from urllib2 import urlopen
    try:
        valid = urlopen(url)
    except:
        return False
    else:
        return True
