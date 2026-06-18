import json
import os
import hashlib
import hmac
import secrets
import psycopg2


def _hash_password(password: str, salt: str) -> str:
    return hashlib.sha256((salt + password).encode()).hexdigest()


def _cors_headers() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def handler(event: dict, context) -> dict:
    '''Регистрация и вход пользователей BioGenie AI. Хранит аккаунты в таблице users.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': _cors_headers(),
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')
    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''
    name = (body.get('name') or '').strip()

    if not email or not password:
        return {
            'statusCode': 400,
            'headers': _cors_headers(),
            'body': json.dumps({'error': 'Email and password are required'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if action == 'signup':
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return {
                    'statusCode': 409,
                    'headers': _cors_headers(),
                    'body': json.dumps({'error': 'This email is already summoned'}),
                }

            salt = secrets.token_hex(16)
            pwd_hash = salt + ':' + _hash_password(password, salt)
            cur.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id, name, email",
                (email, pwd_hash, name or email.split('@')[0]),
            )
            row = cur.fetchone()
            conn.commit()
            return {
                'statusCode': 200,
                'headers': _cors_headers(),
                'body': json.dumps({
                    'user': {'id': row[0], 'name': row[1], 'email': row[2]},
                    'message': 'Account conjured successfully',
                }),
            }

        if action == 'login':
            cur.execute("SELECT id, password_hash, name, email FROM users WHERE email = %s", (email,))
            row = cur.fetchone()
            if not row:
                return {
                    'statusCode': 401,
                    'headers': _cors_headers(),
                    'body': json.dumps({'error': 'Invalid email or password'}),
                }

            stored = row[1]
            salt, real_hash = stored.split(':', 1)
            if not hmac.compare_digest(real_hash, _hash_password(password, salt)):
                return {
                    'statusCode': 401,
                    'headers': _cors_headers(),
                    'body': json.dumps({'error': 'Invalid email or password'}),
                }

            return {
                'statusCode': 200,
                'headers': _cors_headers(),
                'body': json.dumps({
                    'user': {'id': row[0], 'name': row[2], 'email': row[3]},
                    'message': 'Welcome back to the dark',
                }),
            }

        return {
            'statusCode': 400,
            'headers': _cors_headers(),
            'body': json.dumps({'error': 'Unknown action'}),
        }
    finally:
        cur.close()
        conn.close()
