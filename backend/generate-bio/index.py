import json
import os
import urllib.request
import psycopg2


CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
}

TONE_PROMPTS = {
    'gothic': (
        "You are a dark, poetic copywriter crafting Instagram/TikTok bios with a Gothic aesthetic. "
        "Use atmospheric imagery, shadow/darkness metaphors, moon references, and mysterious symbols (🌙⛧🕯🖤✦). "
        "3–4 short lines, no hashtags, highly evocative."
    ),
    'aesthetic': (
        "You are a soft-aesthetic copywriter crafting Instagram/TikTok bios. "
        "Use dreamy, pastel, film-grain vibes with gentle metaphors. Symbols like ✦☾🌸🜂🎞. "
        "3–4 short lines, poetic but gentle, no hashtags."
    ),
    'professional': (
        "You are a brand strategist crafting a professional Instagram/TikTok bio. "
        "Crisp, confident, authority-building. Use bullet points with ◆ or •. "
        "State niche, value proposition, and call to action. 3–4 lines, no hashtags."
    ),
}


def _openai_chat(messages: list, api_key: str) -> str:
    payload = json.dumps({
        'model': 'gpt-4o-mini',
        'messages': messages,
        'max_tokens': 200,
        'temperature': 0.88,
    }).encode()

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
        },
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read())
    return data['choices'][0]['message']['content'].strip()


def handler(event: dict, context) -> dict:
    """Генерирует атмосферное bio через OpenAI и сохраняет в таблицу generated_bios."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    user_id = body.get('user_id')
    tone = (body.get('tone') or 'gothic').lower()
    keywords = (body.get('keywords') or '').strip()
    platform = (body.get('platform') or 'Instagram').strip()

    if not user_id:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'user_id required'})}

    if not keywords:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'keywords required'})}

    system_prompt = TONE_PROMPTS.get(tone, TONE_PROMPTS['gothic'])
    user_prompt = (
        f"Create a {tone} {platform} bio for someone whose keywords/vibe are: {keywords}. "
        f"Output only the bio text, no explanation, no quotes."
    )

    api_key = os.environ.get('OPENAI_API_KEY', '')
    if not api_key:
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': 'OpenAI key not configured'})}

    bio_text = _openai_chat(
        [{'role': 'system', 'content': system_prompt}, {'role': 'user', 'content': user_prompt}],
        api_key,
    )

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO generated_bios (user_id, tone, bio_text) VALUES (%s, %s, %s) RETURNING id, created_at",
        (user_id, tone, bio_text),
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'bio': {'id': row[0], 'tone': tone, 'bio_text': bio_text, 'created_at': str(row[1])},
        }),
    }
