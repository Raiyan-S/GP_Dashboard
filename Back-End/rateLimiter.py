from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize the rate limiter outside of main.py because of circular import issues
limiter = Limiter(key_func=get_remote_address)