import json
import os
import psycopg2


CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
}


def handler(event: dict, context) -> dict:
    """Возвращает историю сгенерированных bio для пользователя."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    user_id = params.get('user_id')

    if not user_id:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'user_id required'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "SELECT id, tone, bio_text, created_at FROM generated_bios WHERE user_id = %s ORDER BY created_at DESC LIMIT 20",
        (user_id,),
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    bios = [
        {'id': r[0], 'tone': r[1], 'bio_text': r[2], 'created_at': str(r[3])}
        for r in rows
    ]

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'bios': bios})}
