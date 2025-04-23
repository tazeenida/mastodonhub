from django.urls import get_resolver

def print_url_patterns():
    """Print all URL patterns in the project"""
    resolver = get_resolver()
    
    print("\nAvailable URL patterns:")
    for pattern in resolver.url_patterns:
        print_pattern(pattern)

def print_pattern(pattern, prefix=''):
    """Recursively print URL patterns"""
    if hasattr(pattern, 'url_patterns'):
        for p in pattern.url_patterns:
            print_pattern(p, prefix + pattern.pattern.regex.pattern)
    else:
        name = getattr(pattern, 'name', None)
        view = getattr(pattern, 'callback', None)
        view_name = view.__name__ if view else str(view)
        view_module = view.__module__ if view else ''
        print(f"{prefix}{pattern.pattern.regex.pattern} - Name: {name}, View: {view_module}.{view_name}")

# To use this, run:
# python manage.py shell
# from mastodonhub.url_finder import print_url_patterns
# print_url_patterns()